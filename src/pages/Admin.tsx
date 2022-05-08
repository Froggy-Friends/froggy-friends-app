import { Grid, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useStakingDeposits } from "../client";

export default function Admin() {
  const [stakingWallet, setStakingWallet] = useState("");
  const deposits = useStakingDeposits(stakingWallet);

  const onStakingWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStakingWallet(event.target.value);
  }

  const getRole = (deposits: number[]) => {
    const { length } = deposits;
    if (length >= 20) {
      return "Froggy Whale"
    } else if (length >= 15) {
      return "Froggy Baby Whale"
    } else if (length >= 10) {
      return "Froggy Maxi";
    } else if (length >= 5) {
      return "Froggy Wrangler";
    } else {
      return "None";
    }
  }

  return (
    <Grid id="admin" container alignItems="center" direction="column" pt={10} pb={30}>
      <Typography variant="h3" pb={10}>Staking Deposits Checker </Typography>

      <Grid id="wallet" justifyContent="center" container pb={5}>
        <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
          <TextField label="Wallet" variant="outlined" fullWidth value={stakingWallet} onChange={onStakingWalletChange}/>
        </Grid>
      </Grid>

      {
        deposits && 
        <Grid id="staked" pb={5}>
          <Grid item xl={12} lg={12}>
            <Typography variant="h5">Froggies Staked: {deposits.length}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5">Roles: {getRole(deposits)}</Typography>
          </Grid>
        </Grid> 
      }
    </Grid>
  )
}