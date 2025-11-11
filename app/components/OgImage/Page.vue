<template>
  <div
    class="w-full h-full flex justify-between relative p-[60px]"
    :class="[colorMode === 'light' ? ['bg-white', 'text-gray-900'] : ['bg-gray-900', 'text-white']]"
  >
    <div
      class="flex absolute top-0 -right-full"
      :style="{
        width: '200%',
        height: '200%',
        backgroundImage: `radial-gradient(circle, rgba(${themeRgb}, 0.5) 0%,  ${colorMode === 'dark' ? 'rgba(5, 5, 5,0.3)' : 'rgba(255, 255, 255, 0.7)'} 50%, ${props.colorMode === 'dark' ? 'rgba(5, 5, 5,0)' : 'rgba(255, 255, 255, 0)'} 70%)`
      }"
    />
    <div class="h-full w-full justify-between relative">
      <div class="flex flex-row justify-between items-start">
        <div class="flex flex-col w-full max-w-[65%]">
          <h1
            class="m-0 font-bold mb-[30px] text-[75px]"
            :style="{ lineClamp: description ? 2 : 3 }"
            style="display: block; text-overflow: ellipsis"
          >
            {{ title || 'BibleTime' }}
          </h1>
          <p
            v-if="description"
            class="text-[35px] leading-12"
            style="display: block; line-clamp: 3; text-overflow: ellipsis"
            :class="[colorMode === 'light' ? ['text-gray-700'] : ['text-gray-300']]"
          >
            {{ description }}
          </p>
        </div>
      </div>
      <div class="flex flex-row justify-center items-center text-left w-full">
        <AppLogo style="height: 120px; width: 484px" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * @credits Nuxt SEO <https://nuxtseo.com/>
 */

import { useOgImageRuntimeConfig } from '#og-image/app/utils'
import { computed } from 'vue'

// convert to typescript props
const props = withDefaults(
  defineProps<{
    avatar?: string
    colorMode?: 'dark' | 'light'
    description?: string
    theme?: string
    title?: string
  }>(),
  {
    avatar: 'https://wol.jw.org/en/wol/mp/r1/lp-e/w13/2013/1210',
    colorMode: undefined,
    description: undefined,
    theme: '#0f356e',
    title: 'title'
  }
)

const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const runtimeConfig = useOgImageRuntimeConfig()

const colorMode = computed(() => {
  return props.colorMode || runtimeConfig.colorPreference || 'light'
})

const themeHex = computed(() => {
  // regex test if valid hex
  if (HexRegex.test(props.theme)) return props.theme

  // if it's hex without the hash, just add the hash
  if (HexRegex.test(`#${props.theme}`)) return `#${props.theme}`

  // if it's rgb or rgba, we convert it to hex
  if (props.theme.startsWith('rgb')) {
    const rgb = props.theme
      .replace('rgb(', '')
      .replace('rgba(', '')
      .replace(')', '')
      .split(',')
      .map((v) => Number.parseInt(v.trim(), 10))
    const hex = rgb
      .map((v) => {
        const hex = v.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      })
      .join('')
    return `#${hex}`
  }
  return '#FFFFFF'
})

const themeRgb = computed(() => {
  // we want to convert it so it's just `<red>, <green>, <blue>` (255, 255, 255)
  return themeHex.value
    .replace('#', '')
    .match(/.{1,2}/g)
    ?.map((v) => Number.parseInt(v, 16))
    .join(', ')
})
</script>
