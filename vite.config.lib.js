import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Ascii3DAnimation',
      fileName: 'ascii-3d-animation',
      formats: ['es']
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['three'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          three: 'THREE'
        }
      }
    }
  }
})
