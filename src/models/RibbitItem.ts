import { Attribute } from './Attribute';
export interface RibbitItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  supply: number;
  limit: number;
  isActive: boolean;
  attributes: Attribute[];
}