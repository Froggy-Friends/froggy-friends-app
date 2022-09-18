import { Attribute } from "./Attribute";

export interface Froggy {
    name: string;
    description: string;
    image: string;
    dna: string;
    edition: number;
    date: number;
    isStaked: boolean;
    isPaired: boolean;
    ribbit: number;
    rarity: string;
    animation_url: string;
    attributes: Attribute[];
  }