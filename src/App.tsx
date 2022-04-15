import { useEthers } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, createStyles, Grid, IconButton, LinearProgress, CircularProgress, Modal, Snackbar, Theme, useMediaQuery, useTheme, CardHeader, Card, CardContent, CardMedia } from "@mui/material";
import { Button, Link, Typography } from "@mui/material";
import logo from './images/logo.png';
import { useEffect, useState } from 'react';
import { Close, Error } from '@mui/icons-material';
import axios from 'axios';


const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: '#000000'
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
    mintButton: {
      marginTop: theme.spacing(5)
    },
    froggylist: {
      cursor: 'pointer'
    },
    stepper: {
      width: '100%'
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
  const [froggies, setFroggies] = useState([]);
  const { activateBrowserWallet, account } = useEthers();

  useEffect(() => {
    async function getFroggiesOwned(address: string) {
      try {
        setLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_API}/owned`, { account: address});
        console.log("response data: ", response.data);
        setFroggies(response.data);
        setLoading(false);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
      }
    }

    if (account) {
      console.log("get froggies owned for account: ", account);
      getFroggiesOwned(account);
    }
  }, [account])

  // useEffect(() => {
  //   if (froggylistMintState.status === 'Exception') {
  //     if (froggylistMintState.errorMessage?.includes('insufficient funds')) {
  //       setAlertMessage('Insufficient funds');
  //     } else if (froggylistMintState.errorMessage?.includes('unknown account')) {
  //       setAlertMessage('Refresh page to connect');
  //     } else {
  //       setAlertMessage(froggylistMintState.errorMessage?.replace(/^execution reverted:/i, ''));
  //     }
  //     setShowAlert(true);
  //   } else if (froggylistMintState.status === 'Mining') {
  //     setTx(froggylistMintState.transaction?.hash);
  //     setTxPending(true);
  //     setTxFail(false);
  //     setShowModal(true);
  //   } else if (froggylistMintState.status === 'Success') {
  //     setTxPending(false);
  //   } else if (froggylistMintState.status === 'Fail') {
  //     setTxFail(true);
  //   }
  // }, [froggylistMintState.status])

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
      <Grid id='toolbar' container item justifyContent='space-between' height={100} xl={12} lg={12} md={12} sm={12} xs={12} p={1}>
        <Grid container item justifyContent='center' xl={4} lg={4} md={3} sm={3} xs={3} pb={3}>
          <Avatar className={classes.avatar} alt='Home' src={logo} sx={{height: 75, width: 75}}/>
        </Grid>
        { isDesktop && 
          <Grid container item justifyContent='center' textAlign='center' xl={6} lg={6} md={9} sm={9} xs={9} pt={2}>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <Link href='https://alpha.froggyfriendsnft.com/team' underline='none'>
                <Typography variant='h5'>Team</Typography>
              </Link>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <Link href='https://alpha.froggyfriendsnft.com/collabs' underline='none'>
                <Typography variant='h5'>Collabs</Typography>
              </Link>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <Link href={process.env.REACT_APP_STAKING_URL} underline='none'>
                <Typography variant='h5'>Stake</Typography>
              </Link>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <Link href='https://alpha.froggyfriendsnft.com/marketplace' underline='none'>
                <Typography variant='h5'>Market</Typography>
              </Link>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <Link href='https://alpha.froggyfriendsnft.com/license' underline='none'>
                <Typography variant='h5'>License</Typography>
              </Link>
            </Grid> 
          </Grid>
        }
      </Grid>
      <Grid id='info' container direction='column' textAlign='center' pt={20}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={10}>
          <Typography variant='h2' color='primary'>Froggy Friends Staking</Typography>
        </Grid>
        { !account && <Grid item p={3}>
            <Button className={classes.mintButton} variant='contained' onClick={() => activateBrowserWallet()}>
              <Typography variant='h5'>Login</Typography>  
            </Button>
        </Grid>
        }
        { loading && 
          <Grid item>
            <Typography variant='h3' color='primary'>Loading Froggies</Typography>
            <CircularProgress />
          </Grid>
        }
        <Grid id='froggies' container item xl={12} lg={12} md={12} sm={12} xs={12} p={20}>
          {
            froggies.map((froggy: any) => {
              return <Grid key={froggy.edition} item xl={2} lg={2} md={2} sm={6} xs={6}>
                <Card>
                  <CardMedia component='img' image={froggy.image} alt='Froggy'/>
                  <CardContent>
                    <Typography variant='h5'>{froggy.name}</Typography>
                    <Typography>Ribbit</Typography>
                  </CardContent>
                </Card>
              </Grid>

            })
          }
        </Grid>
      </Grid>
      <Grid id='footer' className={classes.footer} container justifyContent='center' textAlign='center'>
        <Grid container item direction='column' alignItems='center' pb={10}>
          <Grid item p={5}>
            <Avatar className={classes.avatar} alt='Home' src={logo} sx={{height: 50, width: 50}}/>
          </Grid>
          <Grid item>
            <Typography variant='body1' color='secondary'>
              4,444 of the friendliest frogs in the metaverse. 
            </Typography>
          </Grid>
          <Grid container justifyContent='center' pt={2} maxWidth={500}>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
              <Typography color='primary'>Team</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
            <Typography color='primary'>Collabs</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
            <Typography color='primary'>Staking</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
            <Typography color='primary'>Market</Typography>
            </Grid>
          </Grid>
          <Grid container justifyContent='space-between' mt={10} pb={-10} maxWidth={'60%'} sx={{borderTop: '1px solid #b3b6bb'}}>
            <Grid item>
              <Typography color='secondary' pt={3}>Froggy Friends NFT</Typography>
            </Grid>
            <Grid item>
              <Grid container>
              <Typography color='secondary' pt={3} pr={1}>Terms Of Use</Typography>
              <Typography color='secondary' pt={3}>•</Typography>
              <Typography color='secondary' pt={3} pl={1}>Privacy Policy</Typography>
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
