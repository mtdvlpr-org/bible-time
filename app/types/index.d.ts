import type { AvatarProps } from '@nuxt/ui'

export interface Mail {
  body: string
  date: string
  from: User
  id: number
  subject: string
  unread?: boolean
}
export interface Member {
  avatar: AvatarProps
  name: string
  role: 'member' | 'owner'
  username: string
}

export interface Notification {
  body: string
  date: string
  id: number
  sender: User
  unread?: boolean
}

export type Period = 'daily' | 'monthly' | 'weekly'

export interface Range {
  end: Date
  start: Date
}

export interface Sale {
  amount: number
  date: string
  email: string
  id: string
  status: SaleStatus
}

export type SaleStatus = 'failed' | 'paid' | 'refunded'

export interface Stat {
  formatter?: (value: number) => string
  icon: string
  title: string
  value: number | string
  variation: number
}

export interface User {
  avatar?: AvatarProps
  email: string
  id: number
  location: string
  name: string
  status: UserStatus
}

export type UserStatus = 'bounced' | 'subscribed' | 'unsubscribed'
