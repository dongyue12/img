const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, '..', '..', 'img');
const distDir = path.join(__dirname, '..', '..', 'dist');
const publicDir = path.join(__dirname, '..', '..');

// 创建dist目录
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制public目录到dist
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 跳过uploads目录
      if (entry.name === 'uploads') {
        continue;
      }
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 处理单张图片
async function processImage(file) {
  const sourcePath = path.join(sourceDir, file);
  const name = path.basename(file, path.extname(file));
  const webpPath = path.join(distDir, `${name}.webp`);

  try {
    // 检查是否需要重新构建
    if (fs.existsSync(webpPath)) {
      const sourceStat = fs.statSync(sourcePath);
      const webpStat = fs.statSync(webpPath);

      // 如果源文件没有修改，跳过处理
      if (sourceStat.mtime <= webpStat.mtime) {
        console.log(`跳过: ${file} (未修改)`);
        return;
      }
    }

    // 转换为WebP并压缩
    await sharp(sourcePath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    console.log(`已处理: ${file} -> ${name}.webp`);

    // 删除源文件以节省空间
    fs.unlinkSync(sourcePath);
    console.log(`已删除源文件: ${file}`);
  } catch (error) {
    console.error(`处理 ${file} 失败:`, error.message);
  }
}

// 处理图片
async function processImages() {
  // 确保源目录存在
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
    console.log('创建img目录，请将图片放入该目录');
    return;
  }

  const files = fs.readdirSync(sourceDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext);
  });

  console.log(`找到 ${imageFiles.length} 张图片`);

  // 并行处理所有图片
  await Promise.all(imageFiles.map(file => processImage(file)));

  // 复制public目录到dist/public（排除uploads）
  const distPublicDir = path.join(distDir, 'public');
  copyDirectory(path.join(publicDir, 'public'), distPublicDir);

  // 生成索引页面
  generateIndexPage(imageFiles);
}

// 生成索引页面
function generateIndexPage(imageFiles) {
  const images = imageFiles.map(file => {
    const name = path.basename(file, path.extname(file));
    return {
      name: name,
      webp: `${name}.webp`,
      original: file
    };
  });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图床 - 图片索引</title>
    <link rel="icon" type="image/svg+xml" href="public/favicon.svg">
    <link rel="stylesheet" href="public/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>图床 - 图片索引</h1>
            <p>共 ${images.length} 张图片</p>
        </header>

        <div class="gallery-section">
            <div class="gallery">
                ${images.map(img => `
                    <div class="image-card">
                        <img class="image-preview" src="${img.webp}" alt="${img.name}">
                        <div class="image-info">
                            <div class="image-meta">
                                <span class="image-name">${img.name}</span>
                            </div>
                            <div class="image-link">
                                <input type="text" value="/${img.webp}" readonly>
                                <button class="copy-btn" onclick="copyLink(window.location.origin + '/${img.webp}')">复制</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    <script src="public/js/gallery.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  console.log('已生成索引页面');
}

// 运行
processImages().catch(console.error);
