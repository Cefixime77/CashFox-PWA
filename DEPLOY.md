# 🚀 CashFox PWA 部署指南

构建产物在 `dist/` 目录。部署后你将获得一个**永久公网 URL**，
iPhone 随时随地都能打开，不需要和电脑在同一 WiFi。

---

## 方案一：Netlify Drop（最快 ⚡）

**免费、无需注册命令行、2 分钟搞定**

1. 打开 https://app.netlify.com/drop
2. 把 `e:\Code\CashFox-PWA\dist\` 整个文件夹拖进去
3. 自动部署完成，获得 URL 如 `https://happy-fox-12345.netlify.app`
4. iPhone Safari 打开这个 URL → 添加到桌面
5. ✅ 永久可用

> 之后每次更新：重新 `npx vite build`，再拖一次 `dist` 文件夹到 Netlify

---

## 方案二：GitHub Pages（推荐长期使用 🔧）

**免费、自动部署、关联你的 GitHub 仓库**

1. 推送代码到 GitHub：
```bash
cd e:/Code/CashFox-PWA
git init
git add .
git commit -m "CashFox PWA ready"
git remote add origin https://github.com/你的用户名/CashFox-PWA.git
git push -u origin main
```

2. 在 GitHub 仓库页面：
   Settings → Pages → Source: **GitHub Actions**

3. 创建 `.github/workflows/deploy.yml`（见下方）

4. 推送后自动部署，URL: `https://你的用户名.github.io/CashFox-PWA`

### GitHub Actions 自动部署配置

在项目根目录创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

---

## 方案三：Cloudflare Pages

1. 推送代码到 GitHub
2. 登录 https://pages.cloudflare.com
3. 连接 GitHub 仓库
4. 构建命令：`npm run build`，输出目录：`dist`
5. 自动部署，获得 `https://cashfox.pages.dev`

---

## 本地预览生产构建（不需要热点）

如果只是临时想让 iPhone 随时打开（电脑必须开着）：

```bash
# 安装 Cloudflare Tunnel（免费）
npm install -g cloudflared

# 创建一个永久的公网隧道
cloudflared tunnel --url http://localhost:4173
# 获得 URL: https://xxx.trycloudflare.com
```

> 电脑和 iPhone 不需要在同一网络，电脑开着就行。

---

## 方案对比

| 方案 | 永久URL | 免费 | 电脑关了也能用 | 自动更新 |
|------|---------|------|---------------|----------|
| **Netlify Drop** | ✅ | ✅ | ✅ | ❌ 手动拖拽 |
| **GitHub Pages** | ✅ | ✅ | ✅ | ✅ git push |
| **Cloudflare Pages** | ✅ | ✅ | ✅ | ✅ git push |
| **Cloudflare Tunnel** | ✅ | ✅ | ❌ 电脑要开着 | ✅ 自动 |
| **个人热点** | ❌ | ✅ | ❌ | ✅ 自动 |
