export default function ({
  description,
  image,
  title
}: {
  description?: string
  image?: string
  title?: string
}) {
  useSeoMeta({
    description,
    ogDescription: description,
    ogImage: image,
    ogTitle: title,
    title,
    twitterCard: image ? 'summary_large_image' : undefined,
    twitterImage: image
  })
}
