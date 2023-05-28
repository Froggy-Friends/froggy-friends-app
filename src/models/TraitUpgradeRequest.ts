export interface TraitUpgradeRequest {
  account: string;
  message: string;
  signature: string;
  transaction: string;
  frogId: number;
  traitId: number;
  upgradeId: number;
}