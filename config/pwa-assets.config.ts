import { createAppleSplashScreens, defineConfig } from '@vite-pwa/assets-generator/config'

import {
  appleTouchSizes,
  iconBaseUrl,
  maskableSizes,
  transparentSizes
} from './../app/utils/assets'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  images: [`public${iconBaseUrl}/logo.svg`],
  preset: {
    apple: { sizes: appleTouchSizes },
    appleSplashScreens: createAppleSplashScreens({ darkResizeOptions: {} }),
    maskable: { sizes: maskableSizes },
    transparent: { favicons: [[64, 'favicon.ico']], sizes: transparentSizes }
  }
})
