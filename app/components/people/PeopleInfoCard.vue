<template>
  <UCard class="p-4">
    <div class="flex items-center gap-4">
      <UAvatar
        size="xl"
        :alt="person.name"
        class="w-28 h-28 md:w-32 md:h-32"
        :src="person.avatar_url ?? undefined"
      />
      <div>
        <h2 class="text-lg font-semibold">{{ i18nStore.translate(person.name) }}</h2>
        <div class="text-sm text-zinc-500">
          {{ aliases.length ? aliases.join(', ') : '' }}
        </div>
      </div>
    </div>
    <div class="mt-4 space-y-2">
      <div>
        <div class="text-xs text-zinc-500">{{ $t('people.born') }}</div>
        <div class="font-medium">
          {{ formatYear(person.birth_year, person.birth_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('people.died') }}</div>
        <div class="font-medium">
          {{ formatYear(person.death_year, person.death_precision) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-zinc-500">{{ $t('person.gender') }}</div>
        <div class="font-medium">
          {{ gender }}
        </div>
      </div>
    </div>
  </UCard>
</template>
<script setup lang="ts">
const props = defineProps<{
  person: Omit<Tables<'people'>, 'father' | 'mother'>
}>()

const { t } = useI18n()
const i18nStore = useI18nStore()
const { formatYear } = useDate()

const gender = computed(() => {
  switch (props.person.gender) {
    case 'female':
      return t('person.female')
    case 'male':
      return t('person.male')
    default:
      return t('general.unknown')
  }
})

const aliases = computed(() => {
  return props.person.aliases.map((alias) => i18nStore.translate(alias))
})
</script>
