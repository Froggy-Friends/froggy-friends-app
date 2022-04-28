import { Contract } from "@ethersproject/contracts";
import { useCall, useContractFunction } from '@usedapp/core';
import { Interface } from '@ethersproject/abi';
import froggyfriendsjson from './abi/froggyfriends.json';
import ribbitJson from './abi/ribbit.json';
import stakingJson from './abi/staking.json';

const abi = new Interface(froggyfriendsjson);
const ribbitAbi = new Interface(ribbitJson);
const stakingAbi = new Interface(stakingJson);
const froggyContract = new Contract(`${process.env.REACT_APP_CONTRACT}`, abi);
const ribbitContract = new Contract(`${process.env.REACT_APP_RIBBIT_CONTRACT}`, ribbitAbi);
const stakingContract = new Contract(`${process.env.REACT_APP_STAKING_CONTRACT}`, stakingAbi);
console.log("froggy address: ", froggyContract.address);
console.log("ribbit address: ", ribbitContract.address);
console.log("staking address: ", stakingContract.address);

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