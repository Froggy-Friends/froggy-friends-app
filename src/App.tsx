import { useEthers } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, createStyles, Grid, IconButton, LinearProgress, CircularProgress, Modal, Snackbar, Theme, useMediaQuery, useTheme, CardHeader, Card, CardContent, CardMedia, Container } from "@mui/material";
import { Button, Link, Typography } from "@mui/material";
import logo from './images/logo.png';
import { useEffect, useState } from 'react';
import { Close, Error } from '@mui/icons-material';
import axios from 'axios';
import stake from './images/stake.png';
import ribbit from './images/ribbit.gif';
import twitter from './images/twitter.png';
import opensea from './images/opensea.png';
import looksrare from './images/looksrare.png';
import etherscan from './images/etherscan.png';
import discord from './images/discord.png';
interface Attribute {
  trait_type: string;
  value: string;
}

interface Froggy {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: number;
  date: number;
  attributes: Attribute[];
}
interface Owned {
  froggies: Froggy[];
  totalRibbit: number;
}

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.1)), url(${stake})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      [theme.breakpoints.down('md')]: {
        backgroundSize: 'cover',
      }
    },
    avatar: {
      height: 100,
      width: 100,
      cursor: 'pointer',
      [theme.breakpoints.up('sm')]: {
        marginTop: '5px'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: '10px'
      }
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 5,
      boxShadow: 24,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    },
    ribbit: {
      background: theme.palette.background.default,
      borderRadius: 25,
      padding: 5
    },
    buttons: {
      [theme.breakpoints.down(375)]: {
        maxWidth: '100%',
        flexBasis: '100%',
        padding: theme.spacing(2)
      }
    },
    walletButton: {
      marginTop: theme.spacing(3)
    },
    footer: {
      backgroundColor: '#181818'
    }
  })
);


function App() {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [tx, setTx] = useState<any>('');
  const [txPending, setTxPending] = useState(false);
  const [txFail, setTxFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState<Owned>({froggies:[], totalRibbit: 0});
  const { activateBrowserWallet, account } = useEthers();
  const isTinyMobile = useMediaQuery(theme.breakpoints.down(375));

  useEffect(() => {
    async function getFroggiesOwned(address: string) {
      try {
        setLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_API}/owned`, { account: address});
        console.log("response data: ", response.data);
        setOwned(response.data);
        setLoading(false);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
        setLoading(false);
      }
    }

    if (account) {
      console.log("get froggies owned for account: ", account);
      getFroggiesOwned(account);
    }
  }, [account])

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const onTxModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowModal(false);
    }
  }
  
  return (
    <Grid id='app' className={classes.app} container direction='column'>
      <Container maxWidth='xl'>
        <Grid id='toolbar' container item justifyContent='space-between' height={100} xl={12} lg={12} md={12} sm={12} xs={12} p={1}>
          <Grid container item justifyContent='center' xl={4} lg={4} md={3} sm={3} xs={3} pb={3}>
            <Link href={process.env.REACT_APP_WEBSITE_URL} underline='none'>
              <Avatar className={classes.avatar} alt='Home' src={logo} sx={{height: 125, width: 125}}/>
            </Link>
          </Grid>
          { isDesktop && 
            <Grid container item justifyContent='center' textAlign='center' xl={6} lg={6} md={9} sm={9} xs={9} pt={2}>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/team'} underline='none'>
                  <Typography variant='h5'>Team</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/collabs'} underline='none'>
                  <Typography variant='h5'>Collabs</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_STAKING_URL} underline='none'>
                  <Typography variant='h5'>Stake</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/market'} underline='none'>
                  <Typography variant='h5'>Market</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/license'} underline='none'>
                  <Typography variant='h5'>License</Typography>
                </Link>
              </Grid> 
            </Grid>
          }
        </Grid>
        <Grid id='staking' container direction='column' textAlign='center' pt={10}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={10}>
            <Typography variant='h2' color='primary' fontWeight='bold'>Froggy Friends Staking</Typography>
          </Grid>
          <Grid container item textAlign='left' alignItems='center' xl={12} lg={12} md={12} sm={12} xs={12} pb={2}>
            <Grid container item justifyContent='space-evenly' xl={12} lg={12} md={12} sm={12} xs={12} pb={5} pt={2}>
              <Grid className={classes.ribbit} item display='flex' alignItems='center' xl={3} lg={3} md={3} sm={3} xs={12}>
                <img src={ribbit} style={{height: 50, width: 50}}/>
                <Typography variant='h6' color='primary'>{owned.totalRibbit} $RIBBIT Per Day</Typography>
              </Grid>
              <Grid className={classes.ribbit} item display='flex' alignItems='center' xl={3} lg={3} md={3} sm={3} xs={12}>
                <img src={ribbit} style={{height: 50, width: 50}}/>
                <Typography variant='h6' color='primary'>0 $RIBBIT Balance</Typography>
              </Grid>
              <Grid className={classes.ribbit} item display='flex' alignItems='center' xl={3} lg={3} md={3} sm={3} xs={12}>
                <img src={ribbit} style={{height: 50, width: 50}}/>
                <Typography variant='h6' color='primary'>0 $RIBBIT Staked</Typography>
              </Grid>
            </Grid>
            <Grid container item justifyContent='center' xl={12} lg={12} md={12} sm={12} xs={12}>
              <Grid item textAlign='center' xl={2} lg={2} md={2} sm={2} xs={4} sx={isTinyMobile ? {maxWidth: '100%',flexBasis: '100%',padding: theme.spacing(2)} : {}}>
                <Button variant='contained'>
                  <Typography variant='h5'>Stake</Typography>  
                </Button>
              </Grid>
              <Grid item textAlign='center' xl={2} lg={2} md={2} sm={3} xs={4} sx={isTinyMobile ? {maxWidth: '100%',flexBasis: '100%',padding: theme.spacing(2)} : {}}>
                <Button variant='contained'>
                  <Typography variant='h5'>Unstake</Typography>  
                </Button>
              </Grid>
              <Grid item textAlign='center' xl={2} lg={2} md={2} sm={2} xs={4} sx={isTinyMobile ? {maxWidth: '100%',flexBasis: '100%',padding: theme.spacing(2)} : {}}>
                <Button variant='contained'>
                  <Typography variant='h5'>Claim</Typography>  
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item textAlign='left' alignItems='center' xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
            
          </Grid>
          { !account && <Grid item p={3}>
              <Button variant='contained' onClick={() => activateBrowserWallet()}>
                <Typography variant='h5'>Login</Typography>  
              </Button>
          </Grid>
          }
          { account && loading && 
            <Grid item p={10}>
              <Typography variant='h3' color='primary'>Loading Froggies</Typography>
              <CircularProgress />
            </Grid>
          }
          <Grid id='froggies' container item xl={12} lg={12} md={12} sm={12} xs={12}>
            {
              owned.froggies.map((froggy: any) => {
                return <Grid key={froggy.edition} item xl={2} lg={2} md={3} sm={6} xs={12} p={2} minHeight={300}>
                  <Card sx={{height: '100%'}}>
                    <CardMedia component='img' image={froggy.image} alt='Froggy'/>
                    <CardContent>
                      <Typography variant='h5'>{froggy.name}</Typography>
                      <Typography pb={2}>{froggy.ribbit} $RIBBIT per day</Typography>
                      <Button variant='contained'>
                        <Typography variant='h5'>{froggy.isStaked ? 'Unstake' : 'Stake'}</Typography>
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

              })
            }
          </Grid>
          {
            account && !loading && 
            <Grid item pt={5}>
              <Button variant='contained'>
                <Link href="https://opensea.io/collection/froggyfriendsnft" underline="none" target="_blank">
                  <Typography variant='h5'>Buy Froggies</Typography>
                </Link>
              </Button>
            </Grid>
          }
        </Grid>  
      </Container>  
      <Grid id='footer' className={classes.footer} container justifyContent='center' textAlign='center' mt={20}>
          <Grid container item direction='column' alignItems='center' pb={10}>
            <Grid item p={5}>
              <Avatar className={classes.avatar} alt='Home' src={logo} sx={{height: 50, width: 50}}/>
            </Grid>
            <Grid item>
              <Typography variant='body1' color='secondary'>
                4,444 of the friendliest frogs in the metaverse. 
              </Typography>
            </Grid>
            <Grid container justifyContent='center' p={2}>
                <Grid item p={1}>
                  <Link href="https://twitter.com/FroggyFriendNFT" underline='none' target='_blank'>
                    <Avatar className={classes.avatar} alt='Home' src={twitter} sx={{height: 35, width: 35}}/>
                  </Link>
                </Grid>
                <Grid item p={1}>
                  <Link href="https://opensea.io/collection/froggyfriendsnft" underline='none' target='_blank'>
                    <Avatar className={classes.avatar} alt='Home' src={opensea} sx={{height: 35, width: 35}}/>
                  </Link>
                </Grid>
                <Grid item p={1}>
                  <Link href="https://looksrare.org/collections/0x29652C2e9D3656434Bc8133c69258C8d05290f41" underline='none' target='_blank'>
                    <Avatar className={classes.avatar} alt='Home' src={looksrare} sx={{height: 35, width: 35}}/>
                  </Link>
                </Grid>
                <Grid item p={1}>
                  <Link href="https://etherscan.io/address/0x29652C2e9D3656434Bc8133c69258C8d05290f41#code" underline='none' target='_blank'>
                    <Avatar className={classes.avatar} alt='Home' src={etherscan} sx={{height: 35, width: 35}}/>
                  </Link>
                </Grid>
                <Grid item p={1}>
                  <Link href="https://discord.com/invite/froggyfriends" underline='none' target='_blank'>
                    <Avatar className={classes.avatar} alt='Home' src={discord} sx={{height: 35, width: 35}}/>
                  </Link>
                </Grid>
            </Grid>
            <Grid container justifyContent='center' pt={2} maxWidth={500}>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/team'} underline='none'>
                  <Typography color='primary'>Team</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/collabs'} underline='none'>
                  <Typography color='primary'>Collabs</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_STAKING_URL} underline='none'>
                  <Typography color='primary'>Staking</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/market'} underline='none'>
                  <Typography color='primary'>Market</Typography>
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent='space-between' mt={10} pb={-10} maxWidth={'60%'} sx={{borderTop: '1px solid #b3b6bb'}}>
              <Grid item>
                <Typography color='secondary' pt={3}>&copy;	Froggy Friends NFT</Typography>
              </Grid>
              <Grid item>
                <Grid container>
                  <Link href={process.env.REACT_APP_WEBSITE_URL + '/terms-of-use'} underline='none'>
                    <Typography color='secondary' pt={3} pr={1}>Terms</Typography>
                  </Link>
                  <Typography color='secondary' pt={3}>•</Typography>
                  <Link href={process.env.REACT_APP_WEBSITE_URL + '/privacy-policy'} underline='none'>
                    <Typography color='secondary' pt={3} pl={1}>Privacy</Typography>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      <Snackbar
        open={showAlert} 
        autoHideDuration={5000} 
        message={alertMessage} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onAlertClose}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={onAlertClose}>
            <Close fontSize='small' />
          </IconButton>
        }
      />
      <Modal open={showModal} onClose={onTxModalClose} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal} p={3}>
          <Grid container justifyContent='space-between' pb={5}>
            <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
              { txPending && <Typography id='modal-title' variant="h3" color='primary'>Adopt In Progress</Typography> }
              { !txPending && !txFail && <Typography id='modal-title' variant="h3" color='primary'>Froggy Friend(s) Adopted</Typography> }
              { txFail && <Typography id='modal-title' variant="h3" color='primary'>Adopt Failed <Error fontSize='large'/></Typography> }
            </Grid>
            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
              <IconButton size='small' color='inherit' onClick={onTxModalClose}>
                <Close fontSize='small'/>
              </IconButton>
            </Grid>
          </Grid>
          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${tx}`} target='_blank' sx={{cursor: 'pointer'}}>
            <Typography id='modal-description' variant="h4" pt={3} pb={3}>View Transaction</Typography>
          </Link>
          { txPending && <LinearProgress/>}
        </Box>
      </Modal>
    </Grid>
  );
}

export default App;
