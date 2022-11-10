import { Froggy } from "./Froggy";

export interface Owned {
  froggies: Froggy[];
  totalRibbit: number;
  allowance: number;
  isStakingApproved: boolean;
}