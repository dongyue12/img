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

### 首次部署配置

**重要：首次部署前必须手动启用GitHub Pages**

1. 访问仓库的Settings页面：`https://github.com/<你的用户名>/<仓库名>/settings/pages`
2. 在 "Source" 下选择 "GitHub Actions"
3. 点击 "Save" 保存设置
4. 等待GitHub Pages服务就绪（通常需要几分钟）

### 自动部署

配置完成后，项目会自动部署：

1. 将代码推送到GitHub仓库的main分支
2. GitHub Actions会自动触发构建流程
3. 构建完成后自动部署到GitHub Pages
4. 也可通过手动触发workflow进行部署

### 验证部署

部署完成后，可以通过以下方式验证：
- 访问 `https://<你的用户名>.github.io/<仓库名>/`
- 或访问自定义域名（如果已配置）

### 自定义域名

#### 步骤1：在GitHub仓库中配置自定义域名

1. 进入你的GitHub仓库
2. 点击 `Settings` 标签
3. 在左侧菜单中找到 `Pages` 选项
4. 在 `Custom domain` 输入框中输入你的域名（例如：`img.example.com`）
5. 点击 `Save` 保存
6. 建议勾选 `Enforce HTTPS` 选项（等待DNS生效后）

#### 步骤2：配置DNS记录

根据你的域名服务商，添加以下DNS记录之一：

**方式一：使用CNAME记录（推荐）**
```
类型: CNAME
主机记录: img（或你想要的子域名）
记录值: <你的GitHub用户名>.github.io
TTL: 600（或根据服务商建议设置）
```

**方式二：使用A记录（仅适用于根域名）**
```
类型: A
主机记录: @
记录值: 185.199.108.153
记录值: 185.199.109.153
记录值: 185.199.110.153
记录值: 185.199.111.153
TTL: 600
```

#### 步骤3：验证DNS配置

1. 等待DNS记录生效（通常需要几分钟到24小时）
2. 可以使用以下命令检查DNS是否生效：
   ```bash
   # Windows
   nslookup img.example.com

   # 或使用在线工具
   # 访问 https://www.whatsmydns.net/
   ```

#### 步骤4：配置CNAME文件（可选）

为了确保GitHub Pages正确识别你的自定义域名，可以在项目根目录创建 `CNAME` 文件：

1. 在项目根目录创建 `CNAME` 文件（无扩展名）
2. 文件内容只需一行：你的自定义域名
   ```
   img.example.com
   ```
3. 将该文件提交到仓库

#### 常见问题

**Q: DNS配置后多久生效？**
A: 通常需要几分钟到24小时，取决于DNS服务商的传播速度。

**Q: 如何检查HTTPS是否启用？**
A: 在GitHub Pages设置中，等待DNS生效后，HTTPS状态会自动变为"Available"，然后点击"Enforce HTTPS"即可。

**Q: 可以使用多个自定义域名吗？**
A: 可以，但每个仓库只能设置一个主域名。如需多个域名，建议使用DNS重定向或创建多个仓库。

**Q: 配置自定义域名后访问404怎么办？**
A: 
1. 检查DNS记录是否正确配置
2. 确认CNAME文件是否存在且内容正确
3. 查看GitHub Pages的部署日志
4. 等待DNS完全传播（可能需要更长时间）

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

- 邮箱: 2436847447@qq.com 
