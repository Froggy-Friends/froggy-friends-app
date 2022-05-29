import { RibbitItem } from './models/RibbitItem';
import { Friend } from "./models/Friend";
import { Track } from "./models/Track";
import { SpriteMap } from 'use-sound/dist/types';

export const stakeUrl = "https://froggyfriends.mypinata.cloud/ipfs/QmWh3P7tFJ3inUWKDC63331Fc9pAjPY7uALQobQG3fNT9H";
export const marketplaceUrl = 'https://froggyfriends.mypinata.cloud/ipfs/QmdeDd4KWirXgxQBpVq1MaDhowQwsf3tjRqQUreCXYpG6z';

export const froggyKingData: RibbitItem[] = [
  {
    id: 1,
    name: "Golden Dragon Friend",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/2.png",
    price: 1000000,
    supply: 1,
    limit: 1,
    isActive: true,
    attributes: []
  }
]

export const goldenLilyPadsData: RibbitItem[] = [
  {
    id: 2,
    name: "Golden Lily Pad",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/2.png",
    price: 200000,
    supply: 5,
    limit: 1,
    isActive: true,
    attributes: []
  }
]

export const friendsData: Friend[] = [
  {
    id: 3,
    name: "Rabbit",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/3.png",
    boost: 5,
    price: 1000,
    supply: 200,
    limit: 2,
    isActive: true,
    attributes: []
  },
  {
    id: 4,
    name: "Bear",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/4.png",
    boost: 10,
    price: 2000,
    supply: 100,
    limit: 2,
    isActive: true,
    attributes: []
  },
  {
    id: 5,
    name: "Red Panda",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/5.png",
    boost: 15,
    price: 3000,
    supply: 50,
    limit: 2,
    isActive: true,
    attributes: []
  },
  {
    id: 6,
    name: "Cat",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/6.png",
    boost: 20,
    price: 4000,
    supply: 25,
    limit: 1,
    isActive: false,
    attributes: []
  },
  {
    id: 7,
    name: "Unicorn",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/7.png",
    boost: 30,
    price: 5000,
    supply: 10,
    limit: 1,
    isActive: false,
    attributes: []
  },
  {
    id: 8,
    name: "Golden Tiger",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/2.png",
    boost: 30,
    price: 1000000,
    supply: 1,
    limit: 1,
    isActive: true,
    attributes: []
  }
];

export const collabFriendsData: Friend[] = [
  {
    id: 9,
    name: "Kaiju King",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/8.png",
    boost: 5,
    price: 1000,
    supply: 5,
    limit: 1,
    isActive: true,
    attributes: []
  },
  {
    id: 10,
    name: "Cheetopia",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/9.png",
    boost: 5,
    price: 1000,
    supply: 5,
    limit: 1,
    isActive: false,
    attributes: []
  }
];

export const nftData: RibbitItem[] = [
  {
    id: 11,
    name: "Froggy #1424",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmNqUXJJNgJRqC9hDcjJQr4v6P8jWX49VqoQ4gb1KA7Z7k/1424.png",
    price: 5000,
    supply: 1,
    limit: 1,
    isActive: true,
    attributes: []
  },
  {
    id: 12,
    name: "Froggy #1673",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmNqUXJJNgJRqC9hDcjJQr4v6P8jWX49VqoQ4gb1KA7Z7k/1673.png",
    price: 5000,
    supply: 1,
    limit: 1,
    isActive: true,
    attributes: []
  },
  {
    id: 13,
    name: "Froggy #800",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmNqUXJJNgJRqC9hDcjJQr4v6P8jWX49VqoQ4gb1KA7Z7k/800.png",
    price: 5000,
    supply: 1,
    limit: 1,
    isActive: false,
    attributes: []
  }
];

export const raffleData: RibbitItem[] = [
  {
    id: 14,
    name: "Froggy #11",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmNqUXJJNgJRqC9hDcjJQr4v6P8jWX49VqoQ4gb1KA7Z7k/11.png",
    price: 500,
    supply: 200,
    limit: 1,
    isActive: true,
    attributes: []
  },
  {
    id: 15,
    name: "Froggy #12",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmNqUXJJNgJRqC9hDcjJQr4v6P8jWX49VqoQ4gb1KA7Z7k/12.png",
    price: 500,
    supply: 200,
    limit: 1,
    isActive: false,
    attributes: []
  },
  {
    id: 16,
    name: "Froggy #21",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmNqUXJJNgJRqC9hDcjJQr4v6P8jWX49VqoQ4gb1KA7Z7k/21.png",
    price: 500,
    supply: 200,
    limit: 1,
    isActive: true,
    attributes: []
  }
]

export const tracks: Track[] = [
  {
    id: 'lily',
    name: "Chocolate Lily",
    producer: "Lidly",
    image: "https://froggyfriends.mypinata.cloud/ipfs/Qmcd1yeovkwy6gfeB9U31UG2fHr3YCGzXjxyFtmv8YFRYi"
  },
  {
    id: 'bento',
    name: 'Bento',
    producer: 'Bakcward',
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmfHkLEPpz8LEZUkNKM6VosiBXqcK2TauePu5WqFrCbi3w"
  },
  {
    id: 'meganebashi',
    name: 'Meganebashi',
    producer: 'Lidly',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmYnqum74kfCWpyN52Rqscqwbt5iqa3aS8FbsvWuasLM5d'
  },
  {
    id: 'cafe',
    name: 'Pancake Cafe',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/Qme3MSvme4rzhhFFRbbuPwmGwooUqBAB8u5Lz6uAmM4YB5'
  },
  {
    id: 'meteor',
    name: 'Meteor Station',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmW5agbxds8YkC3fSDbbSz1zqW2c687QdxcTcmgAW7s6aG'
  },
  {
    id: 'district',
    name: 'Onryō District',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmXoQJ8dtX4SmtaZX9jGcSqSWaTFwBhr2m9WcfCEPZx9xq'
  },
  {
    id: 'emirald',
    name: 'Mt. Emirald',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmYwGKmSgrNLjiCfz62WBTZHgDuGzMsT8o3xo874Mr3r9J'
  },
  {
    id: 'highrise',
    name: 'Highrise',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmSARgYs31JXssoicMNcW5mZEVdUQUmCeu1hnvJTHXQpVQ'
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    producer: 'Bakcward',
    image: marketplaceUrl
  },
  {
    id: 'noodle',
    name: 'Noodle House',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmS9bwxXkHqhia6jzq84cB1khYsGppUfhGFumkK6qZuojJ'
  },
  {
    id: 'dreamer',
    name: 'Dreamer',
    producer: 'Bakcward',
    image: 'https://froggyfriends.mypinata.cloud/ipfs/QmZgVtvJMwDCyXH8r58guPLuBz2vAqEPd8wuSTfSEytbBR'
  }
]

// first number is start time in milliseconds
// second number is duration of track in milliseconds
export const sprite: SpriteMap = {
  lily: [0, 127000],
  bento: [138000, 120000],
  meganebashi: [270000, 150000],
  cafe: [430000, 150000],
  meteor: [588000, 106000],
  district: [706000, 116000],
  emirald: [834000, 158000],
  highrise: [1002000, 112000],
  marketplace: [1124000, 148000],
  noodle: [1282000, 168000],
  dreamer: [1459000, 111000]
}