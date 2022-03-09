import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";

import { Avatar, Button, Container, Link, Typography } from "@mui/material";
import froggy from './images/froggy.jpg';
import grass from './images/grass.png';
import twitter from './images/twitter.png';
import opensea from './images/opensea.png';
import looksrare from './images/looksrare.png';
import etherscan from './images/etherscan.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: theme.palette.background.default,
      background: `url(${grass})`,
      backgroundPosition: 'bottom left',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      height: '100%'
    }
  })
);


function App() {
  const classes = useStyles();
  return (
    <Grid id='app' className={classes.app} container direction='column' justifyContent='space-between' alignItems='center' pt={15}>
      <Grid id='header' container item>
        <Grid item xl={2} lg={2} md={3} sm={4} xs={4} p={5}>
          <Avatar alt='Home' src={froggy} sx={{width: '100%'}}/>
        </Grid>
        <Grid item xl={10} lg={10} md={9} sm={8} xs={8} p={5}>
          <Typography variant='h2' fontWeight='bold' textTransform='uppercase'>Froggy Friends</Typography>
          <Typography variant='h4'>4,444 Froggy Friends</Typography>
          <Typography variant='h4'>0.03 ETH mint price</Typography>
        </Grid>
      </Grid>
      {/* <Grid id='mint' item xl={12} lg={12} md={12} sm={12} xs={12} pb={10}>
        <Button variant='contained' color='secondary'>
          <Typography variant='h4'>Coming Soon</Typography>  
        </Button>  
      </Grid> */}
      {/* <Grid container item xl={12} lg={12} md={12} sm={12} xs={12} justifyContent='center' textAlign='center'>
          <Grid item xl={1} lg={1} md={1} sm={2} xs={3}>
            <Link href='https://twitter.com/FroggyFriendNFT' target='_blank'>
              <img alt='Twitter' src={twitter} height={50}/>  
            </Link>
          </Grid>
          <Grid item xl={1} lg={1} md={1} sm={2} xs={3}>
            <Link href='' target='_blank'>
              <img alt='Opensea' src={opensea} height={50}/>  
            </Link>
          </Grid>
          <Grid item xl={1} lg={1} md={1} sm={2} xs={3}>
            <Link href='' target='_blank'>
              <img alt='LooksRare' src={looksrare} height={50}/>  
            </Link>
          </Grid>
          <Grid item xl={1} lg={1} md={1} sm={2} xs={3}>
            <Link href='' target='_blank'>
              <img alt='Etherscan' src={etherscan} height={50}/>  
            </Link>
          </Grid>  
      </Grid>   */}
      {/* <Grid id='grass' className={classes.grass} item>
        <img alt='grass' src={grass} style={{width: '100%', backgroundColor: '#d5e5ef'}}/>
      </Grid> */}
    </Grid>
  );
}

export default App;
