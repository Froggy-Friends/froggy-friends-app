export interface History {
  id: number;
  wallet: string;
  frogId: number;
  friendId: number;
  date: string;
  isPairing: boolean;
  isUnpairing: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  pairTx: string;
  unpairTx: string;
  stakeTx: string;
  unstakeTx: string;
}