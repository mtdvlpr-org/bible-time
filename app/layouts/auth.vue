<template>
  <div class="h-screen flex items-center justify-center px-4">
    <LocaleSelect class="absolute right-8 top-8 z-10" />

    <UPageCard variant="subtle" class="max-w-sm w-full">
      <slot />
    </UPageCard>
  </div>
</template>
