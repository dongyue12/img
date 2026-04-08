# 免费图床 - 静态图片管理系统

一个基于Node.js的静态图床系统，自动将img文件夹中的图片转换为WebP格式并生成静态网页。使用GitHub Actions和GitHub Pages进行自动化部署。

## 功能特点

- 🔄 自动将图片转换为WebP格式
- ⚡ 增量构建与并行处理，提升构建速度
- 🗜️ 图片压缩优化（质量80%）
- 🗑️ 构建后自动删除源文件，节省存储空间
- 🔗 生成静态图片链接
- 📋 一键复制图片链接
- 📱 响应式设计，支持移动端
- 🌐 支持自定义域名访问（域名+图片名）
- 🤖 自动化部署到GitHub Pages
- 🎨 现代化UI设计，包含自定义图标

## 支持的图片格式

- JPEG/JPG
- PNG
- GIF
- WebP
- BMP

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 准备图片

将图片放入项目根目录下的 `img` 文件夹中

### 3. 构建静态网页

```bash
npm run build
```

构建过程会：
- 检查img目录中的图片
- 将图片转换为WebP格式并保存到dist目录
- 自动删除img目录中的源文件以节省空间
- 生成静态网页索引

构建完成后，生成的文件将在 `dist` 目录中

### 4. 本地预览

```bash
npm run server
```

在浏览器中访问 `http://localhost:3000` 查看图片

## 项目结构

```
免费图床/
├── img/              # 源图片目录（构建后自动清空）
├── public/           # 公共资源目录
│   ├── index.html    # 主页
│   ├── favicon.svg   # 网站图标
│   ├── styles.css    # 样式文件
│   └── js/           # JavaScript文件
│       ├── build.js  # 构建脚本
│       ├── gallery.js # 图库交互
│       └── server.js  # 本地服务器
├── dist/             # 构建输出目录
└── package.json      # 项目配置
```

## 部署到GitHub Pages

### 自动部署

项目已配置GitHub Actions工作流，实现自动化部署：

1. 将代码推送到GitHub仓库的main分支
2. GitHub Actions会自动触发构建流程
3. 构建完成后自动部署到GitHub Pages
4. 也可通过手动触发workflow进行部署

### 手动配置（如需要）

1. 在仓库设置中启用GitHub Pages
2. 确保仓库的Settings > Pages > Source设置为GitHub Actions
3. 配置自定义域名（可选）

### 自定义域名

1. 在GitHub仓库设置中配置自定义域名
2. 在域名DNS设置中添加CNAME记录指向你的GitHub Pages
3. 等待DNS生效后即可通过自定义域名访问

## 技术栈

- 构建工具: Node.js 18+
- 图片处理: Sharp
- 前端: 原生HTML/CSS/JavaScript
- 服务器: Express
- 部署: GitHub Actions + GitHub Pages

## 配置说明

### 图片配置

- 源目录: `img/`
- 输出目录: `dist/`
- WebP质量: 80%
- 构建方式: 增量构建 + 并行处理

### GitHub Actions配置

- 触发条件: push到main分支或手动触发
- 构建环境: Ubuntu Latest
- Node版本: 18
- 自动启用GitHub Pages

## 常见问题

### Q: 构建后图片源文件还在吗？
A: 不会。构建完成后会自动删除img目录中的源文件，只保留转换后的WebP格式图片。

### Q: 如何修改图片质量？
A: 编辑`public/js/build.js`文件中的`quality`参数（默认为80）。

### Q: 支持哪些图片格式？
A: 支持JPEG/JPG、PNG、GIF、WebP和BMP格式。

### Q: 如何自定义网站图标？
A: 替换`public/favicon.svg`文件即可。

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 联系方式

- GitHub: https://github.com/zhengxiaowai/image-hosting
