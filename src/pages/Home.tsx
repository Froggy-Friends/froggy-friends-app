import { makeStyles } from '@mui/styles';
import { Avatar, Button, Container, createStyles, Grid, Link, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import froggy from '../images/froggy.jpg';
import clouds from '../images/clouds.png';
import twitter from '../images/twitter.png';
import opensea from '../images/opensea.png';
import looksrare from '../images/looksrare.png';
import etherscan from '../images/etherscan.png';

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
        <Typography variant='h1' fontWeight='bold' textTransform='uppercase'>Froggy Friends</Typography>
      </Grid>
      <Grid id='mint' item pb={10}>
        <Button variant='contained' color='secondary'>
          <Typography variant='h3'>Coming Soon</Typography>  
        </Button>  
      </Grid>
      <Container maxWidth='lg'>
        <Grid container item justifyContent='center' textAlign='center'>
            <Grid className={classes.social} item xl={1} lg={1} md={1} sm={2} xs={3}>
              <Link href='https://twitter.com/FroggyFriendNFT' target='_blank'>
                <img alt='Twitter' src={twitter} height={75}/>  
              </Link>
            </Grid>
            <Grid className={classes.social} item xl={1} lg={1} md={1} sm={2} xs={3}>
              <Link href='' target='_blank'>
                <img alt='Opensea' src={opensea} height={75}/>  
              </Link>
            </Grid>
            <Grid className={classes.social} item xl={1} lg={1} md={1} sm={2} xs={3}>
              <Link href='' target='_blank'>
                <img alt='LooksRare' src={looksrare} height={75}/>  
              </Link>
            </Grid>
            <Grid className={classes.social} item xl={1} lg={1} md={1} sm={2} xs={3}>
              <Link href='' target='_blank'>
                <img alt='Etherscan' src={etherscan} height={75}/>  
              </Link>
            </Grid>  
        </Grid>  
      </Container>
      <Grid id='clouds' className={classes.clouds} item>
        <img alt='clouds' src={clouds} style={{width: '100%'}}/>
      </Grid>
    </Grid>
  );
}
