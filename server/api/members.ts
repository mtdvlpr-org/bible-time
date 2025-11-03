const members = [
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu' },
    name: 'Anthony Fu',
    role: 'member',
    username: 'antfu'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/larbish' },
    name: 'Baptiste Leproux',
    role: 'member',
    username: 'larbish'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/benjamincanac' },
    name: 'Benjamin Canac',
    role: 'owner',
    username: 'benjamincanac'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/celinedumerc' },
    name: 'Céline Dumerc',
    role: 'member',
    username: 'celinedumerc'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe' },
    name: 'Daniel Roe',
    role: 'member',
    username: 'danielroe'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/farnabaz' },
    name: 'Farnabaz',
    role: 'member',
    username: 'farnabaz'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/FerdinandCoumau' },
    name: 'Ferdinand Coumau',
    role: 'member',
    username: 'FerdinandCoumau'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/hugorcd' },
    name: 'Hugo Richard',
    role: 'owner',
    username: 'hugorcd'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/pi0' },
    name: 'Pooya Parsa',
    role: 'member',
    username: 'pi0'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/SarahM19' },
    name: 'Sarah Moriceau',
    role: 'member',
    username: 'SarahM19'
  },
  {
    avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/atinux' },
    name: 'Sébastien Chopin',
    role: 'owner',
    username: 'Atinux'
  }
]

export default eventHandler(async () => {
  return members
})
