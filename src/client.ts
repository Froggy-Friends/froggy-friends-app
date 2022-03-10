import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from '@usedapp/core';
import { Interface } from '@ethersproject/abi';
import froggyfriendsjson from './abi/froggyfriends.json';

const abi = new Interface(froggyfriendsjson);
const contract = new Contract(`${process.env.REACT_APP_CONTRACT}`, abi);

export enum FroggyStatus {
  OFF,
  FROGGYLIST,
  PUBLIC
}

export function useFroggyStatus(): FroggyStatus {
  let result = useContractCall({
    abi: abi,
    address: contract.address,
    method: 'froggyStatus',
    args: []
  });

  if (result && result[0]) {
    const status = result[0];
    if (status == FroggyStatus.OFF) return FroggyStatus.OFF;
    else if (status == FroggyStatus.FROGGYLIST) return FroggyStatus.FROGGYLIST;
    else if (status == FroggyStatus.PUBLIC) return FroggyStatus.PUBLIC;
    else return FroggyStatus.OFF;
  } else {
    return FroggyStatus.OFF;
  }
}