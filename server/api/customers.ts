import type { User } from '~/types'

const customers: User[] = [
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=1'
    },
    email: 'alex.smith@example.com',
    id: 1,
    location: 'New York, USA',
    name: 'Alex Smith',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=2'
    },
    email: 'jordan.brown@example.com',
    id: 2,
    location: 'London, UK',
    name: 'Jordan Brown',
    status: 'unsubscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=3'
    },
    email: 'taylor.green@example.com',
    id: 3,
    location: 'Paris, France',
    name: 'Taylor Green',
    status: 'bounced'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=4'
    },
    email: 'morgan.white@example.com',
    id: 4,
    location: 'Berlin, Germany',
    name: 'Morgan White',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=5'
    },
    email: 'casey.gray@example.com',
    id: 5,
    location: 'Tokyo, Japan',
    name: 'Casey Gray',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=6'
    },
    email: 'jamie.johnson@example.com',
    id: 6,
    location: 'Sydney, Australia',
    name: 'Jamie Johnson',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=7'
    },
    email: 'riley.davis@example.com',
    id: 7,
    location: 'New York, USA',
    name: 'Riley Davis',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=8'
    },
    email: 'kelly.wilson@example.com',
    id: 8,
    location: 'London, UK',
    name: 'Kelly Wilson',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=9'
    },
    email: 'drew.moore@example.com',
    id: 9,
    location: 'Paris, France',
    name: 'Drew Moore',
    status: 'bounced'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=10'
    },
    email: 'jordan.taylor@example.com',
    id: 10,
    location: 'Berlin, Germany',
    name: 'Jordan Taylor',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=11'
    },
    email: 'morgan.anderson@example.com',
    id: 11,
    location: 'Tokyo, Japan',
    name: 'Morgan Anderson',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=12'
    },
    email: 'casey.thomas@example.com',
    id: 12,
    location: 'Sydney, Australia',
    name: 'Casey Thomas',
    status: 'unsubscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=13'
    },
    email: 'jamie.jackson@example.com',
    id: 13,
    location: 'New York, USA',
    name: 'Jamie Jackson',
    status: 'unsubscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=14'
    },
    email: 'riley.white@example.com',
    id: 14,
    location: 'London, UK',
    name: 'Riley White',
    status: 'unsubscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=15'
    },
    email: 'kelly.harris@example.com',
    id: 15,
    location: 'Paris, France',
    name: 'Kelly Harris',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=16'
    },
    email: 'drew.martin@example.com',
    id: 16,
    location: 'Berlin, Germany',
    name: 'Drew Martin',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=17'
    },
    email: 'alex.thompson@example.com',
    id: 17,
    location: 'Tokyo, Japan',
    name: 'Alex Thompson',
    status: 'unsubscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=18'
    },
    email: 'jordan.garcia@example.com',
    id: 18,
    location: 'Sydney, Australia',
    name: 'Jordan Garcia',
    status: 'subscribed'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=19'
    },
    email: 'taylor.rodriguez@example.com',
    id: 19,
    location: 'New York, USA',
    name: 'Taylor Rodriguez',
    status: 'bounced'
  },
  {
    avatar: {
      src: 'https://i.pravatar.cc/128?u=20'
    },
    email: 'morgan.lopez@example.com',
    id: 20,
    location: 'London, UK',
    name: 'Morgan Lopez',
    status: 'subscribed'
  }
]

export default eventHandler(async () => {
  return customers
})
