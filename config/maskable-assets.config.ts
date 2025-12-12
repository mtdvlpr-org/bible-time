import { defineConfig } from '@vite-pwa/assets-generator/config'

import { iconBaseUrl, maskableSizes } from './../app/utils/assets'

export default defineConfig({
  images: [`public${iconBaseUrl}/maskable-icon.png`],
  preset: {
    apple: { sizes: [] },
    maskable: { padding: 0, sizes: maskableSizes },
    transparent: { sizes: [] }
  }
})
