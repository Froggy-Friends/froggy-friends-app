import { makeStyles } from '@mui/styles';
import { Avatar, createStyles, Grid, Slider, Theme } from "@mui/material";

import { Button, Container, Link, Typography } from "@mui/material";
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
      height: '100%',
      [theme.breakpoints.up('md')]: {
        backgroundSize: '100% 20%'
      },
      [theme.breakpoints.up('lg')]: {
        backgroundSize: '100% 30%'
      }
    },
    slider: {
      width: '80%'
    },
    mintButton: {
      width: '80%'
    }
  })
);


function App() {
  const classes = useStyles();
  return (
    <Grid id='app' className={classes.app} container p={2}>
      <Grid id='toolbar' container justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12} p={1}>
        <Grid container item xl={5} lg={5} md={6} sm={8} xs={12}>
          <Avatar alt='Home' src={froggy} sx={{borderRadius: '50%', border: '2px solid black'}}/>
          <Typography variant='h2' fontWeight='bold' textTransform='uppercase' pl={3}>Froggy Friends</Typography>
        </Grid>
        <Grid container item justifyContent='end' xl={3} lg={3} md={3} sm={4} xs={12}>
          <Grid item xl={2} lg={2} md={3} sm={3} xs={3}>
            <Link href='https://twitter.com/FroggyFriendNFT' target='_blank'>
              <img alt='Twitter' src={twitter} height={40}/>  
            </Link>
          </Grid>
          <Grid item xl={2} lg={2} md={3} sm={3} xs={3}>
            <Link href='' target='_blank'>
              <img alt='Opensea' src={opensea} height={40}/>  
            </Link>
          </Grid>
          <Grid item xl={2} lg={2} md={3} sm={3} xs={3}>
            <Link href='' target='_blank'>
              <img alt='LooksRare' src={looksrare} height={40}/>  
            </Link>
          </Grid>
          <Grid item xl={2} lg={2} md={3} sm={3} xs={3}>
            <Link href='' target='_blank'>
              <img alt='Etherscan' src={etherscan} height={40}/>  
            </Link>
          </Grid>  
        </Grid>
      </Grid>
      <Container maxWidth='xl'>
        <Grid id='info' container item justifyContent='center' textAlign='center' xl={12} lg={12} md={12} sm={12} xs={12}>
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12} p={3}>
            <Typography variant='h2' fontWeight='bold'>Minting March 18</Typography>
            <Typography variant='h5' fontFamily='outfit'>4,444 Froggy Friends</Typography>
            <Typography variant='h5' fontFamily='outfit' pb={3}>0.03 ETH mint price</Typography>
            <Slider className={classes.slider} defaultValue={1} step={1} min={1} max={2} />
            <Button className={classes.mintButton} variant='contained' color='secondary'>
              <Typography variant='h4'>Coming Soon</Typography>  
            </Button>
          </Grid>
        </Grid>  
      </Container>
    </Grid>
  );
}

export default App;
