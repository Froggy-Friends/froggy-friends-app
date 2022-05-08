import { Grid, TextField, Typography, createStyles, Theme } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ChangeEvent, useEffect, useState } from "react";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    walletInput: {
      
    },
  })
);

export default function Admin() {
  const classes = useStyles();
  const [stakingWallet, setStakingWallet] = useState("");

  const onStakingWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStakingWallet(event.target.value);
  }

  useEffect(() => {
    if (stakingWallet) {
      console.log("staking wallet change: ", stakingWallet);
    }
  }, [stakingWallet])

  return (
    <Grid id="admin" container alignItems="center" direction="column" pt={10} pb={30}>
      <Typography variant="h3" pb={10}>Admin Page </Typography>

      <Grid id="staker" justifyContent="center" container>
        <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
          <TextField id="wallet" label="Staking Wallet" variant="outlined" fullWidth value={stakingWallet} onChange={onStakingWalletChange}/>
        </Grid>
        <Grid item>

        </Grid>
      </Grid>
    </Grid>
  )
}