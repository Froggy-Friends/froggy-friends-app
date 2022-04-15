import { useEthers } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, createStyles, Grid, IconButton, LinearProgress, Modal, Snackbar, TextField, Theme, useMediaQuery, useTheme } from "@mui/material";
import { Button, Link, Typography } from "@mui/material";
import logo from './images/logo.png';
import { useEffect, useState } from 'react';
import { Close, Error } from '@mui/icons-material';
import { FroggyStatus, useFroggylistMint, useFroggyStatus, useMint, useMinted, useSupply } from './client';
import { parseEther } from "@ethersproject/units";
import { getIsOnFroggylist, getProof } from './http';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: theme.palette.background.default,
      height: '100%',
      [theme.breakpoints.up('md')]: {
        backgroundSize: '100% 20%'
      },
      [theme.breakpoints.up('lg')]: {
        backgroundSize: '100% 30%'
      }
    },
    avatar: {
      height: 100,
      width: 100,
      [theme.breakpoints.up('sm')]: {
        marginTop: '5px'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: '10px'
      }
    },
    mintButton: {
      width: '60%',
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
  const [openModal, setOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tx, setTx] = useState<any>('');
  const [txPending, setTxPending] = useState(false);
  const [txFail, setTxFail] = useState(false);
  const [wallet, setWallet] = useState('');
  const [froggies, setFroggies] = useState(1);
  const [step, setStep] = useState(0);
  const [mintProof, setMintProof] = useState<string[]>([]);
  const { activateBrowserWallet, account } = useEthers();
  const { froggylistMint, froggylistMintState } = useFroggylistMint();
  const { mint, mintState } = useMint();
  const froggyStatus = useFroggyStatus();
  const supply = useSupply();
  const minted = useMinted();
  const soldOut = minted > 0 && supply > 0 && minted === supply;
  const price = parseEther("0.03");

  useEffect(() => {
    soldOut ? setStep(4) : setStep(froggyStatus);
  }, [froggyStatus, soldOut]);

  useEffect(() => {
    if (account) {
      getProof({ wallet: account})
        .then(response => {
          setMintProof(response.proof);
        })
        .catch(() => {
          setAlertMessage("Error getting froggylist proof");
          setShowAlert(true);
        })
    }
  }, [account])

  useEffect(() => {
    if (froggylistMintState.status === 'Exception') {
      if (froggylistMintState.errorMessage?.includes('insufficient funds')) {
        setAlertMessage('Insufficient funds');
      } else if (froggylistMintState.errorMessage?.includes('unknown account')) {
        setAlertMessage('Refresh page to connect');
      } else {
        setAlertMessage(froggylistMintState.errorMessage?.replace(/^execution reverted:/i, ''));
      }
      setShowAlert(true);
    } else if (froggylistMintState.status === 'Mining') {
      setTx(froggylistMintState.transaction?.hash);
      setTxPending(true);
      setTxFail(false);
      setShowModal(true);
    } else if (froggylistMintState.status === 'Success') {
      setTxPending(false);
    } else if (froggylistMintState.status === 'Fail') {
      setTxFail(true);
    }
  }, [froggylistMintState.status])

  useEffect(() => {
    if (mintState.status === 'Exception') {
      if (mintState.errorMessage?.includes('insufficient funds')) {
        setAlertMessage('Insufficient funds');
      } else if (mintState.errorMessage?.includes('unknown account')) {
        setAlertMessage('Refresh page to login');
      } else {
        setAlertMessage(mintState.errorMessage?.replace(/^execution reverted:/i, ''));
      }
      setShowAlert(true);
    } else if (mintState.status === 'Mining') {
      setTx(mintState.transaction?.hash);
      setTxPending(true);
      setTxFail(false);
      setShowModal(true);
    } else if (mintState.status === 'Success') {
      setTxPending(false);
    } else if (mintState.status === 'Fail') {
      setTxFail(true);
    }
  }, [mintState.status])

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };
  
  const onModalClose = () => setOpenModal(false);
  const onWalletChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWallet(event.target.value);
  };

  const checkWallet = () => {
    getIsOnFroggylist(wallet)
      .then(isOnFroggylist => {
        setAlertMessage(isOnFroggylist ? "Wallet on Froggylist" : "Wallet not on Froggylist");
        setShowAlert(true);
      })
      .catch(error => {
        setAlertMessage("Error getting Froggylist status");
        setShowAlert(true);
      });
  }

  const onTxModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowModal(false);
    }
  }

  const onMint = () => {
    const value = { value: price.mul(froggies)};
    if (froggyStatus === FroggyStatus.FROGGYLIST) {
      froggylistMint(froggies, mintProof, value);
    } else if (froggyStatus === FroggyStatus.PUBLIC) {
      mint(froggies, value);
    } else {
      setAlertMessage("Adopting is off");
      setShowAlert(true);
    }
  }
  
  return (
    <Grid id='app' className={classes.app} container>
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
      <Grid id='info' container justifyContent='center' textAlign='center' mt={-10} maxHeight={350}>
        <Grid container item direction='column' alignItems='center' xl={4} lg={6} md={6} sm={8} xs={12} p={3}>
          {
            !account && <Button className={classes.mintButton} variant='contained' onClick={() => activateBrowserWallet()}>
                          <Typography variant='h5'>Login</Typography>  
                        </Button>
          }
        </Grid>
      </Grid>
      <Grid id='footer' className={classes.footer} container justifyContent='center' textAlign='center'>
        <Grid container item direction='column' alignItems='center'>
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
      <Modal open={openModal} onClose={onModalClose} keepMounted aria-labelledby='froggylist' aria-describedby='froggylist'>
        <Box className={classes.modal} p={3}>
          <Grid container justifyContent='space-between' item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
            <Typography variant='h2'>Froggylist Checker</Typography>
            <Close onClick={() => setOpenModal(false)} sx={{cursor: 'pointer'}}/>
          </Grid>
          <Grid container direction='column'>
            <Typography variant='h6' fontFamily='outfit' pb={3}>Enter your wallet address</Typography>
            <TextField id='wallet' placeholder='Your wallet address' value={wallet} onChange={onWalletChange} focused sx={{paddingBottom: 5}}/>
            <Button className={classes.walletButton} variant='contained' color='secondary' onClick={checkWallet}>
              <Typography variant='h4'>Check Wallet</Typography>  
            </Button>
          </Grid>
        </Box>
      </Modal>
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
