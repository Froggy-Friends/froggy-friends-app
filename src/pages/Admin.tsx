import { Container, Grid, Paper, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import { ChangeEvent, useState } from "react";
import { useFroggiesOwned, useStakingDeposits } from "../client";
import banner from '../images/lab.jpg';
import theme from "../theme";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    banner: {
      backgroundImage: `url(${banner})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    }
  })
);

export default function Admin() {
  const classes = useStyles();
  const theme = useTheme();
  const [stakingWallet, setStakingWallet] = useState("");
  const deposits = useStakingDeposits(stakingWallet);
  const owned = useFroggiesOwned(stakingWallet);
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

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
    <Grid id="admin" className={classes.market} container direction="column" justifyContent="start">
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl'  sx={{pt: 5, pb: 5}}>
        <Grid id="wallet" justifyContent="center" container pb={5}>
          <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
            <TextField label="Wallet" variant="outlined" fullWidth value={stakingWallet} onChange={onStakingWalletChange}/>
          </Grid>
        </Grid>
        {
          deposits &&
          <Grid id="staked" pb={5}>
            <Grid item>
              <Typography variant="h5">Froggies Unstaked: {owned}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">Froggies Staked: {deposits.length}</Typography>
            </Grid>
            <Grid item>
            <Typography variant="h5">Froggies Owned: {owned + deposits.length}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">Whale Roles: {getRole(deposits)}</Typography>
            </Grid>
          </Grid> 
        }
      </Container>
    </Grid>
  )
}