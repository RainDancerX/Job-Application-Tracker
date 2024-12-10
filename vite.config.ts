/* 
 * @Author: lucas Liu lantasy.io@gmail.com 
 * @Date: 2024-11-12 15:29:13 
 * @LastEditTime: 2024-12-10 02:01:29 
 * @Description: 
 */ 
import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react-swc'; 
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'; 
import path from 'path'; 
import Unfonts from 'unplugin-fonts/vite'; 
 
// https://vite.dev/config/ 
export default defineConfig({ 
  base: '/JAT/', 
  plugins: [ 
    TanStackRouterVite(), 
    react(), 
    Unfonts({ 
      custom: { 
        families: [ 
          { 
            name: 'Geist', 
            src: './src/assets/fonts/geist/*.woff2', 
          }, 
        ], 
      }, 
    }), 
  ], 
  resolve: { 
    alias: { 
      '@': path.resolve(__dirname, './src'), 
    }, 
  }, 
  build: { 
    rollupOptions: { 
      output: { 
        manualChunks: undefined, 
      }, 
    }, 
  }, 
}); 
