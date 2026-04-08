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

// 文件名计数器，每次从1开始
let imageCounter = 1;

// 处理单张图片
async function processImage(file) {
  const sourcePath = path.join(sourceDir, file);

  // 使用当前计数器作为文件名
  const imageName = imageCounter.toString();
  const webpPath = path.join(distDir, `${imageName}.webp`);

  try {
    // 转换为WebP并压缩
    await sharp(sourcePath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    console.log(`已处理: ${file} -> ${imageName}.webp`);

    // 增加计数器
    imageCounter++;
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

  // 顺序处理所有图片
  if (imageFiles.length > 0) {
    for (const file of imageFiles) {
      await processImage(file);
    }
  } else {
    console.log('没有找到图片，将生成空索引页面');
  }

  // 复制public目录到dist/public（排除uploads）
  const distPublicDir = path.join(distDir, 'public');
  copyDirectory(path.join(publicDir, 'public'), distPublicDir);

  // 生成索引页面
  generateIndexPage(imageFiles);
}

// 生成索引页面
function generateIndexPage(imageFiles) {
  // 获取所有已处理的图片
  const webpFiles = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.webp'))
    .sort((a, b) => {
      // 按数字顺序排序
      const numA = parseInt(path.basename(a, '.webp'));
      const numB = parseInt(path.basename(b, '.webp'));
      return numA - numB;
    });

  const images = webpFiles.map(file => {
    const num = path.basename(file, '.webp');
    return {
      name: num,
      webp: `${num}.webp`,
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
            ${images.length > 0 ? `
            <div class="gallery">
                ${images.map(img => `
                    <div class="image-card">
                        <a href="view.html?img=${img.webp}" class="image-link-wrapper">
                            <img class="image-preview" src="${img.webp}" alt="${img.name}">
                        </a>
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
            ` : `
            <div class="empty-state">
                <p>暂无图片</p>
                <p>请将图片放入img目录后重新构建</p>
            </div>
            `}
        </div>
    </div>
    <script src="public/js/gallery.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  console.log('已生成索引页面');

  // 生成全屏查看页面
  generateViewPage(images);
}

// 生成全屏查看页面
function generateViewPage(images) {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图床 - 全屏查看</title>
    <link rel="icon" type="image/svg+xml" href="public/favicon.svg">
    <link rel="stylesheet" href="public/styles.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
        }

        .view-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
            background: #1a1a1a;
            position: relative;
        }

        .view-image {
            max-width: 100%;
            max-height: calc(100vh - 100px);
            object-fit: contain;
        }

        .view-controls {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
            background: rgba(26, 26, 26, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .view-btn {
            padding: 10px 20px;
            background: #fff;
            color: #333;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }

        .view-btn:hover {
            background: #f0f0f0;
        }

        .view-info {
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            font-size: 14px;
            background: rgba(0, 0, 0, 0.5);
            padding: 5px 15px;
            border-radius: 15px;
        }
    </style>
</head>
<body>
    <div class="view-container">
        <img id="viewImage" class="view-image" src="" alt="">
        <div class="view-controls">
            <button id="prevBtn" class="view-btn">上一张</button>
            <button id="nextBtn" class="view-btn">下一张</button>
            <button id="backBtn" class="view-btn">返回</button>
        </div>
        <div class="view-info">
            <span id="imageInfo"></span>
        </div>
    </div>
    <script>
        const images = ${JSON.stringify(images)};
        let currentIndex = 0;

        // 获取URL参数中的图片
        const urlParams = new URLSearchParams(window.location.search);
        const currentImg = urlParams.get('img');

        // 找到当前图片的索引
        currentIndex = images.findIndex(img => img.webp === currentImg);

        function updateImage() {
            const img = images[currentIndex];
            document.getElementById('viewImage').src = window.location.origin + '/' + img.webp;
            document.getElementById('imageInfo').textContent = \`\${currentIndex + 1} / \${images.length}\`;

            // 更新URL
            history.replaceState(null, '', \`?img=\${img.webp}\`);
        }

        document.getElementById('prevBtn').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateImage();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                updateImage();
            } else if (e.key === 'Escape') {
                window.location.href = 'index.html';
            }
        });

        // 初始化显示
        updateImage();
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(distDir, 'view.html'), html);
  console.log('已生成全屏查看页面');
}

// 运行
processImages().catch(console.error);
