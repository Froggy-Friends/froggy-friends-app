import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme, Typography } from "@mui/material";
import skyscrapers from "../images/skyscrapers.png";


const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    leaderboard: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, 0)), url(${skyscrapers})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '110%',
      direction: 'column',
      justifyContent: 'start',
      alignItems: 'center'
    }
  })
);

export default function Leaderboard() {
  const classes = useStyles();

  return (
    <Grid id="leaderboard" container className={classes.leaderboard} pt={20}>
      
    </Grid>
  )
}