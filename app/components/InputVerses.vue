<template>
  <UFormField required :label="$t('bible.book')">
    <USelectMenu v-model="book" class="w-full" :items="books" value-key="value" />
  </UFormField>
  <UFormField required :label="$t('bible.chapter')">
    <USelect
      v-model="chapter"
      class="w-full"
      :items="chapters"
      :disabled="!book || chapters.length === 1"
    />
  </UFormField>
  <UFormField required :label="$t('bible.verse')">
    <UInputNumber v-model="startVerse" :min="1" :max="endVerse" />
  </UFormField>
  <UFormField :label="$t('bible.until')">
    <UInputNumber v-model="endVerse" :max="176" :min="startVerse" />
  </UFormField>
</template>
<script setup lang="ts">
const model = defineModel<string | undefined>({ required: true })

const { translateBook } = useTranslations()

const book = ref<BibleBookNr | undefined>()
const chapter = ref<number | undefined>()
const startVerse = ref(1)
const endVerse = ref<number | undefined>()

const books = computed(() =>
  Object.keys(bibleChapters).map((c) => ({
    label: translateBook(+c as BibleBookNr),
    value: +c
  }))
)

const chapters = computed(() =>
  book.value ? Array.from({ length: bibleChapters[book.value] }, (_, i) => i + 1) : []
)

watchImmediate(model, (val) => {
  const verse = parseVerseString(val ?? '')

  if (!verse) {
    book.value = undefined
    chapter.value = undefined
    startVerse.value = 1
    endVerse.value = undefined
  } else {
    book.value = verse.book
    chapter.value = verse.chapter
    startVerse.value = verse.start
    endVerse.value = verse.end
  }
})

watch([book, chapter, startVerse, endVerse], () => {
  if (book.value && chapters.value.length === 1) {
    chapter.value = chapters.value[0]
  } else if (book.value && chapter.value && chapter.value > chapters.value.length) {
    chapter.value = undefined
  }

  if (!book.value || !chapter.value || !startVerse.value) {
    model.value = undefined
  } else if (endVerse.value) {
    model.value = `${book.value}:${chapter.value}:${startVerse.value}-${endVerse.value}`
  } else {
    model.value = `${book.value}:${chapter.value}:${startVerse.value}`
  }
})
</script>
