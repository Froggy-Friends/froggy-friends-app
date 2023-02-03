export interface History {
  id: number;
  wallet: string;
  frogId: number;
  friendId: number;
  traitId: number;
  date: string;
  isPairing: boolean;
  isUnpairing: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  isTraitUpgrade: boolean;
  pairTx: string;
  unpairTx: string;
  stakeTx: string;
  unstakeTx: string;
  upgradeTx: string;
}