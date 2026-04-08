const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务 - 指向dist目录
const distDir = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distDir));

// 路由处理
app.get('/', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// 获取所有图片列表
app.get('/api/images', (req, res) => {
  try {
    const images = [];
    const files = fs.readdirSync(distDir).filter(file => {
      return path.extname(file).toLowerCase() === '.webp';
    });

    files.forEach(file => {
      const filePath = path.join(distDir, file);
      const stats = fs.statSync(filePath);

      images.push({
        webpUrl: `/${file}`,
        name: path.basename(file, '.webp'),
        size: stats.size,
        createdAt: stats.birthtime
      });
    });

    res.json({ success: true, data: images });
  } catch (error) {
    console.error('获取图片列表错误:', error);
    res.status(500).json({ error: '获取图片列表失败' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`静态文件目录: ${distDir}`);
});
