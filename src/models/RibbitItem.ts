import { Attribute } from './Attribute';
export interface RibbitItem {
  id: number;
  name: string;
  description: string;
  category: string;
  collabId: number;
  twitter: string;
  discord: string;
  community: boolean;
  endDate: number;
  image: string;
  previewImage: string;
  price: number;
  percentage: number;
  minted: number;
  supply: number;
  walletLimit: number;
  isBoost: boolean;
  isOnSale: boolean;
  attributes: Attribute[];
}