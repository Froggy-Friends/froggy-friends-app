import { Contract } from "@ethersproject/contracts";
import { useCall, useContractFunction } from '@usedapp/core';
import { Interface } from '@ethersproject/abi';
import froggyfriendsjson from './abi/froggyfriends.json';
import ribbitJson from './abi/ribbit.json';
import stakingJson from './abi/staking.json';
import ribbitItemJson from './abi/ribbitItem.json';
import { BigNumber } from "ethers";

const abi = new Interface(froggyfriendsjson);
const ribbitAbi = new Interface(ribbitJson);
const stakingAbi = new Interface(stakingJson);
const ribbitItemAbi = new Interface(ribbitItemJson);
const froggyContract = new Contract(`${process.env.REACT_APP_CONTRACT}`, abi);
const ribbitContract = new Contract(`${process.env.REACT_APP_RIBBIT_CONTRACT}`, ribbitAbi);
const stakingContract = new Contract(`${process.env.REACT_APP_STAKING_CONTRACT}`, stakingAbi);
const ribbitItemContract = new Contract(`${process.env.REACT_APP_RIBBIT_ITEM_CONTRACT}`, ribbitItemAbi);
console.log("froggy address: ", froggyContract.address);
console.log("ribbit address: ", ribbitContract.address);
console.log("staking address: ", stakingContract.address);
console.log("ribbit item address: ", ribbitItemContract.address);

export function useBundleBuy() {
  const { send, state } = useContractFunction(ribbitItemContract, 'bundleBuy');
  return {
    bundleBuy: send,
    bundleBuyState: state
  }
}

export function useApproveSpender() {
  const { send, state } = useContractFunction(ribbitContract, 'approve');
  return {
    approveSpender: send,
    approveSpenderState: state
  }
}

export function useSetApprovalForAll() {
  const { send, state } = useContractFunction(froggyContract, 'setApprovalForAll');
  return {
    setApprovalForAll: send,
    setApprovalForAllState: state
  }
}

export function useStake() {
  const { send, state } = useContractFunction(stakingContract, 'stake');
  return {
    stake: send,
    stakeState: state
  };
}

export function useUnstake() {
  const { send, state } = useContractFunction(stakingContract, 'unStake');
  return {
    unstake: send,
    unstakeState: state
  };
}

export function useClaim() {
  const { send, state } = useContractFunction(stakingContract, 'claim');
  return {
    claim: send,
    claimState: state
  }
}

export function useCheckStakingBalance(account: string) {
  let result = useCall({contract: stakingContract, method: 'balanceOf', args: [account]});
  
  if (result?.value) {
    return result.value[0];
  }

  return 0;
}

export function useStakingStarted() {
  let result = useCall({contract: stakingContract, method: 'started', args: []});

  if (result?.value) {
    return result.value[0];
  }

  return false;
}

export function useFroggiesStaked() {
  const { value, error } = useCall({contract: froggyContract, method: 'balanceOf', args: [stakingContract.address]}) ?? {};
  if (error) {
    console.log("get froggies staked error: ", error);
  }

  return value?.[0].toNumber();
}

export function useStakingDeposits(account: string) {
  const { value, error } = useCall({contract: stakingContract, method: 'deposits', args: [account]}) ?? {};
  if (error) {
    console.log("get staking deposits error: ", error);
  }

  if (value) {
    const deposits: BigNumber[] = value?.[0];
    return deposits.map(d => d.toNumber());
  } else {
    return [];
  }
}

export function useFroggiesOwned(account: string): number {
  const { value, error } = useCall({contract: froggyContract, method: 'balanceOf', args: [account]}) ?? {};
  if (error) {
    console.log("get froggies owned error: ", error);
  }

  if (value) {
    const owned: BigNumber = value?.[0];
    return owned.toNumber();
  } else {
    return 0;
  }
}

export function useSpendingApproved(account: string): boolean {
  const { value, error } = useCall({contract: ribbitContract, method: 'allowance', args: [account, ribbitItemContract.address]}) ?? {};
  if (error) {
    console.log("check spending allowance error: ", error);
  }

  const allowance: BigNumber = value?.[0] || BigNumber.from(0);
  return allowance.gt(0);
}