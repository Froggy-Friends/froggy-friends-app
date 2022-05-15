import { Attribute } from "./Attribute";

export interface Friend {
  id: number;
  name: string;
  description: string;
  image: string;
  boost: number;
  price: number;
  supply: number;
  limit: number;
  attributes: Attribute[];
}