import { makeStyles } from '@mui/styles';
import { Avatar, createStyles, Grid, Slider, Step, StepLabel, Stepper, Theme } from "@mui/material";

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
    avatar: {
      borderRadius: '50%', 
      border: '2px solid black', 
      [theme.breakpoints.up('sm')]: {
        marginTop: '5px'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: '10px'
      }
    },
    mintButton: {
      width: '80%',
      marginTop: theme.spacing(5)
    },
    froggylist: {
      cursor: 'pointer'
    },
    stepper: {
      width: '100%'
    }
  })
);


function App() {
  const classes = useStyles();
  return (
    <Grid id='app' className={classes.app} container p={2}>
      <Grid id='toolbar' container justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12} p={1}>
        <Grid container item justifyContent='center' xl={3} lg={4} md={5} sm={6} xs={12}>
          <Avatar className={classes.avatar} alt='Home' src={froggy}/>
          <Link href='https://www.froggyfriendsnft.com/' variant='h2' fontWeight='bold' textTransform='uppercase' underline='none' pl={3}>Froggy Friends</Link>
        </Grid>
        <Grid container item justifyContent='center' textAlign='center' xl={3} lg={3} md={3} sm={4} xs={12}>
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
        <Grid id='info' container justifyContent='center' textAlign='center' pb={10}>
          <Grid container item direction='column' alignItems='center' xl={4} lg={4} md={6} sm={6} xs={12} p={3}>
            <Typography variant='h2' fontWeight='bold'>Minting March 18</Typography>
            <Typography variant='h5' fontFamily='outfit'>4,444 Froggy Friends</Typography>
            <Typography variant='h5' fontFamily='outfit' pb={3}>0.03 ETH mint price</Typography>
            <Slider sx={{width: '80%', paddingBottom: 5}} defaultValue={1} step={1} min={1} max={2}/>
            <Button className={classes.mintButton} variant='contained' color='secondary'>
              <Typography variant='h4'>Coming Soon</Typography>  
            </Button>
            <Link className={classes.froggylist} variant='h4' pt={3}>Check Froggylist</Link>
          </Grid>
        </Grid>  
        <Grid id='progress' container xl={12} lg={12} md={12} sm={12} xs={12} pb={15}>
          <Stepper className={classes.stepper} activeStep={0} alternativeLabel>
            <Step>
              <StepLabel>
                <Typography variant='h3'>Prep</Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant='h3'>Froggylist Mint</Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant='h3'>Public Mint</Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant='h3'>Sold Out!</Typography>
              </StepLabel>
            </Step>
          </Stepper>  
        </Grid>
      </Container>
    </Grid>
  );
}

export default App;
