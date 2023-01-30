export interface Upgrade {
  id: number;
  wallet: string;
  frogId: number;
  traitId: number;
  traitName: string;
  traitLayer: string;
  date: string;
  background: string;
  body: string;
  eyes: string;
  mouth: string;
  shirt: string;
  hat: string;
  isPending: boolean;
  isFailed: boolean;
  isComplete: boolean;
  transaction: string;
}