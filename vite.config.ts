/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// 站点为纯前端 SPA，构建产物直接静态托管
export default defineConfig({
  // 相对路径，保证部署到 GitHub Pages 子路径（/personal-website/）时资源不 404
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // 与 tsconfig 的 paths 保持一致，避免深层相对路径
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // React 运行时单独成块（Rolldown 只支持函数形式的 manualChunks）
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
              return 'react';
            }
          }
          return undefined;
        },
      },
    },
  },
  // 单元测试只跑数据层与纯函数，DOM 环境由 jsdom 提供
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
