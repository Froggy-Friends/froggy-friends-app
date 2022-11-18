import { Track } from "./models/Track";
import { SpriteMap } from 'use-sound/dist/types';

export const stakeUrl = "https://froggyfriends.mypinata.cloud/ipfs/QmWh3P7tFJ3inUWKDC63331Fc9pAjPY7uALQobQG3fNT9H";
export const marketplaceUrl = 'https://froggyfriends.mypinata.cloud/ipfs/QmdeDd4KWirXgxQBpVq1MaDhowQwsf3tjRqQUreCXYpG6z';

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
