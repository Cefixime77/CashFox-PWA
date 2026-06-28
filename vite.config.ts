import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages 部署在子路径下，所有资源需要加此前缀
  base: '/CashFox-PWA/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // ⚡ 开发模式也启用 PWA（否则 dev 模式下添加到桌面会白屏）
      devOptions: { enabled: true },
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'CashFox - 小狐狸记账',
        short_name: 'CashFox',
        description: '简洁可爱的记账助手 - 让每一笔支出都变得轻松愉快',
        theme_color: '#A8D8EA',
        background_color: '#F5F9FC',
        display: 'minimal-ui',
        orientation: 'portrait',
        start_url: '/CashFox-PWA/',
        scope: '/CashFox-PWA/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cashfox-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          }
        ]
      }
    })
  ]
})
