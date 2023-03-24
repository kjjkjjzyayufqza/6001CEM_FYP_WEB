import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteExternalsPlugin } from 'vite-plugin-externals'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    viteExternalsPlugin({ // 声明为external
      'onnxruntime-web': 'ort'
    })
  ],
  optimizeDeps: {
    exclude: [ // 跳过pre-bundle
      'onnxruntime-web'
    ] 
  },
  server: {
    open: true,
  }
})
