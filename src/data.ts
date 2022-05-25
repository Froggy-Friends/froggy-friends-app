import { RibbitItem } from './models/RibbitItem';
import { Friend } from "./models/Friend";
import { Track } from "./models/Track";
import emirald from "./tracks/Emirald.mp3";
import dragon from "./images/dragon.png";

export const stakeUrl = "https://froggyfriends.mypinata.cloud/ipfs/QmWh3P7tFJ3inUWKDC63331Fc9pAjPY7uALQobQG3fNT9H";

export const froggyKingData: RibbitItem[] = [
  {
    id: 1,
    name: "Golden Dragon Friend",
    description: "",
    image: dragon,
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
    name: "Golden Dragon",
    description: "",
    image: dragon,
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
    name: "Chocolate Lily",
    producer: "Lidly",
    sound: emirald,
    image: stakeUrl
  }
]