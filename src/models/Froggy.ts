import { Attribute } from "./Attribute";

export interface Froggy {
    name: string;
    description: string;
    image: string;
    dna: string;
    edition: number;
    date: number;
    isStaked: boolean;
    ribbit: number;
    rarity: string;
    attributes: Attribute[];
  }