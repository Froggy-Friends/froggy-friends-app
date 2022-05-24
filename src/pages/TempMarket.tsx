import { createStyles, Grid, Theme, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import market from "../images/market.png";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    market: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0, 0, 0, 0)), url(${market})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '100%'
    }
  })
);

export default function TempMarket() {
  const classes = useStyles();

  return (
    <Grid id="market" className={classes.market} container justifyContent="center" pt={20} pb={30}>
      <Typography variant='h2' fontWeight="bold" color='secondary'>Coming Soon</Typography>
    </Grid>
  )
}