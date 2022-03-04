import { makeStyles } from '@mui/styles';
import { Avatar, Button, createStyles, Grid, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import froggy from '../images/froggy.jpg';
import clouds from '../images/clouds.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    home: {
      backgroundColor: theme.palette.background.default,
      width: '100%'
    },
    clouds: {
      width: '100%'
    }
  })
);


export default function Home() {
  const classes = useStyles();
  return (
    <Grid className={classes.home} container direction='column' alignItems='center' pt={15}>
      <Grid id='header' container item justifyContent='center' pb={10}>
        <Avatar alt='Home' src={froggy} sx={{height: 250, width: 250}}/>
      </Grid>
      <Grid id='title' item pb={5}>
        <Typography variant='h1' textTransform='uppercase'>Froggy Friends</Typography>
      </Grid>
      <Grid id='mint' item>
        <Button variant='contained' color='secondary'>
          <Typography variant='h3'>Coming Soon</Typography>  
        </Button>  
      </Grid>
      <Grid id='clouds' className={classes.clouds} item>
        <img alt='clouds' src={clouds} style={{width: '100%'}}/>
      </Grid>
    </Grid>
  );
}
