import { createAppleSplashScreens, defineConfig } from '@vite-pwa/assets-generator/config'

import { appleTouchSizes, iconBaseUrl, transparentSizes } from './../app/utils/assets'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  images: [`public${iconBaseUrl}/logo.svg`],
  preset: {
    apple: { sizes: appleTouchSizes },
    appleSplashScreens: createAppleSplashScreens({ darkResizeOptions: {} }),
    maskable: { padding: 0.45, sizes: [] },
    transparent: { favicons: [[64, 'favicon.ico']], sizes: transparentSizes }
  }
})
