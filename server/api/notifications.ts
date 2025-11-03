import { sub } from 'date-fns'

const notifications = [
  {
    body: 'sent you a message',
    date: sub(new Date(), { minutes: 7 }).toISOString(),
    id: 1,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=2'
      },
      email: 'jordan.brown@example.com',
      name: 'Jordan Brown'
    },
    unread: true
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { hours: 1 }).toISOString(),
    id: 2,
    sender: {
      name: 'Lindsay Walton'
    }
  },
  {
    body: 'sent you a message',
    date: sub(new Date(), { hours: 3 }).toISOString(),
    id: 3,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=3'
      },
      email: 'taylor.green@example.com',
      name: 'Taylor Green'
    },
    unread: true
  },
  {
    body: 'added you to a project',
    date: sub(new Date(), { hours: 3 }).toISOString(),
    id: 4,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=4'
      },
      name: 'Courtney Henry'
    }
  },
  {
    body: 'abandonned cart',
    date: sub(new Date(), { hours: 7 }).toISOString(),
    id: 5,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=5'
      },
      name: 'Tom Cook'
    }
  },
  {
    body: 'purchased your product',
    date: sub(new Date(), { days: 1, hours: 3 }).toISOString(),
    id: 6,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=6'
      },
      name: 'Casey Thomas'
    }
  },
  {
    body: 'sent you a message',
    date: sub(new Date(), { days: 2 }).toISOString(),
    id: 7,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=8'
      },
      email: 'kelly.wilson@example.com',
      name: 'Kelly Wilson'
    },
    unread: true
  },
  {
    body: 'requested a refund',
    date: sub(new Date(), { days: 5, hours: 4 }).toISOString(),
    id: 8,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=9'
      },
      email: 'jamie.johnson@example.com',
      name: 'Jamie Johnson'
    }
  },
  {
    body: 'sent you a message',
    date: sub(new Date(), { days: 6 }).toISOString(),
    id: 9,
    sender: {
      email: 'morgan.anderson@example.com',
      name: 'Morgan Anderson'
    },
    unread: true
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 6 }).toISOString(),
    id: 10,
    sender: {
      name: 'Drew Moore'
    }
  },
  {
    body: 'abandonned cart',
    date: sub(new Date(), { days: 7 }).toISOString(),
    id: 11,
    sender: {
      name: 'Riley Davis'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 9 }).toISOString(),
    id: 12,
    sender: {
      name: 'Jordan Taylor'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 10 }).toISOString(),
    id: 13,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=8'
      },
      email: 'kelly.wilson@example.com',
      name: 'Kelly Wilson'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 11 }).toISOString(),
    id: 14,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=9'
      },
      email: 'jamie.johnson@example.com',
      name: 'Jamie Johnson'
    }
  },
  {
    body: 'purchased your product',
    date: sub(new Date(), { days: 12 }).toISOString(),
    id: 15,
    sender: {
      name: 'Morgan Anderson'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 13 }).toISOString(),
    id: 16,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=16'
      },
      name: 'Drew Moore'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 14 }).toISOString(),
    id: 17,
    sender: {
      name: 'Riley Davis'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 15 }).toISOString(),
    id: 18,
    sender: {
      name: 'Jordan Taylor'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 16 }).toISOString(),
    id: 19,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=8'
      },
      email: 'kelly.wilson@example.com',
      name: 'Kelly Wilson'
    }
  },
  {
    body: 'purchased your product',
    date: sub(new Date(), { days: 17 }).toISOString(),
    id: 20,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=9'
      },
      email: 'jamie.johnson@example.com',
      name: 'Jamie Johnson'
    }
  },
  {
    body: 'abandonned cart',
    date: sub(new Date(), { days: 17 }).toISOString(),
    id: 21,
    sender: {
      name: 'Morgan Anderson'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 18 }).toISOString(),
    id: 22,
    sender: {
      name: 'Drew Moore'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 19 }).toISOString(),
    id: 23,
    sender: {
      name: 'Riley Davis'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 20 }).toISOString(),
    id: 24,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=24'
      },
      name: 'Jordan Taylor'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 20 }).toISOString(),
    id: 25,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=8'
      },
      email: 'kelly.wilson@example.com',
      name: 'Kelly Wilson'
    }
  },
  {
    body: 'abandonned cart',
    date: sub(new Date(), { days: 21 }).toISOString(),
    id: 26,
    sender: {
      avatar: {
        src: 'https://i.pravatar.cc/128?u=9'
      },
      email: 'jamie.johnson@example.com',
      name: 'Jamie Johnson'
    }
  },
  {
    body: 'subscribed to your email list',
    date: sub(new Date(), { days: 22 }).toISOString(),
    id: 27,
    sender: {
      name: 'Morgan Anderson'
    }
  }
]

export default eventHandler(async () => {
  return notifications
})
