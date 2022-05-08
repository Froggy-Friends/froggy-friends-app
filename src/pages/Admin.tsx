import { Grid, TextField, Typography, createStyles, Theme } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    walletInput: {
      
    },
  })
);

export default function Admin() {
  const classes = useStyles();

  return (
    <Grid id="admin" container alignItems="center" direction="column" pt={10} pb={30}>
      <Typography variant="h3" pb={10}>Admin Page </Typography>

      <Grid id="staker" justifyContent="center" container>
        <Grid item xl={4} lg={12}>
          <TextField id="wallet" label="Staking Wallet" variant="outlined" fullWidth />
        </Grid>
      </Grid>
    </Grid>
  )
}