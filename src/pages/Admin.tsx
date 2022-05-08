import { Grid, TextField, Typography, createStyles, Theme, Button } from "@mui/material";
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

  const onCheckStakingWallet = () => {
    
  }

  return (
    <Grid id="admin" container alignItems="center" direction="column" pt={10} pb={30}>
      <Typography variant="h3" pb={10}>Wallet Staking Checker </Typography>

      <Grid id="wallet" justifyContent="center" container pb={5}>
        <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
          <TextField label="Wallet" variant="outlined" fullWidth value={stakingWallet} onChange={onStakingWalletChange}/>
        </Grid>
      </Grid>

      <Grid id="check" textAlign="center" container>
        <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
          <Button variant='contained' onClick={onCheckStakingWallet}>
            <Typography variant='h5'>Check</Typography>  
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}