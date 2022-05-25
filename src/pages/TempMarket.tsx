import { createStyles, Grid, Theme, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import market from "../images/market.png";
import biz from '../images/biz.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    market: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, 0)), url(${market})`,
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
    <Grid id="market" className={classes.market} container direction="column" justifyContent="center" alignItems="center" pb={30}>
      <Typography variant='h2' fontWeight="bold" color='secondary' pb={5}>Coming Soon</Typography>
      <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
    </Grid>
  )
}