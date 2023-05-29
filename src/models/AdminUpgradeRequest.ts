export interface AdminUpgradeRequest {
  frogId: number;
  itemId: number;
  wallet: string;
  transaction: string;
  account: string;
  message: string;
  signature: string;
}