import { Friend } from "./models/Friend";
import { Track } from "./models/Track";
import stake from "./images/stake.png";
import emirald from "./tracks/Emirald.mp3";

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
    attributes: []
  }
];

export const collabFriendsData: Friend[] = [
  {
    id: 8,
    name: "Kaiju King",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/8.png",
    boost: 5,
    price: 1000,
    supply: 5,
    limit: 1,
    attributes: []
  },
  {
    id: 9,
    name: "Cheetopia",
    description: "",
    image: "https://froggyfriends.mypinata.cloud/ipfs/QmSSuUG6pF7HCEMqK7qWzFewYJgS7aJcUGxDGRW9dr7Kfh/9.png",
    boost: 5,
    price: 1000,
    supply: 5,
    limit: 1,
    attributes: []
  }
];

export const tracks: Track[] = [
  {
    name: "Chocolate Lily",
    sound: emirald,
    image: stake
  }
]