import { useEthers, useTokenBalance } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, createStyles, Grid, IconButton, LinearProgress, CircularProgress, Modal, Snackbar, Theme, useMediaQuery, useTheme, Card, CardContent, CardMedia, Container } from "@mui/material";
import { Button, Link, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { Check, Close, Warning } from '@mui/icons-material';
import { useSetApprovalForAll, useStake, useUnstake, useClaim, useCheckStakingBalance, useStakingStarted, useFroggiesStaked } from './client';
import { formatEther } from '@ethersproject/units';
import axios from 'axios';
import stakingBackground from './images/stake.png';
import ribbit from './images/ribbit.gif';
import twitter from './images/twitter.png';
import opensea from './images/opensea.png';
import looksrare from './images/looksrare.png';
import etherscan from './images/etherscan.png';
import discord from './images/discord.png';
import logo from './images/logo.png';
import think from './images/think.png';
import chest from './images/chest.png';
import rain from './images/rain.png';
import please from './images/plz.png';
import hype from './images/hype.png';
import uhhh from './images/uhhh.png';
import hi from './images/hi.png';

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
  allowance: number;
  isStakingApproved: boolean;
}

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.1)), url(${stakingBackground})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      [theme.breakpoints.down('xl')]: {
        backgroundSize: 'contain',
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
      backgroundColor: '#cfdcae',
      color: theme.palette.background.default,
      border: '2px solid #000',
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    },
    ribbit: {
      background: theme.palette.background.default,
      borderRadius: 30,
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
  const isTinyMobile = useMediaQuery(theme.breakpoints.down(375));
  const [froggiesToStake, setFroggiesToStake] = useState<number[]>([]);
  const [froggiesToUnstake, setFroggiesToUnstake] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showClaimModal, setShowClamModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState<Owned>({froggies:[], totalRibbit: 0, allowance: 0, isStakingApproved: false});
  const { activateBrowserWallet, account } = useEthers();
  const ribbitBalance = useTokenBalance(process.env.REACT_APP_RIBBIT_CONTRACT, account) || 0;
  const { setApprovalForAll, setApprovalForAllState } = useSetApprovalForAll();
  const { stake, stakeState } = useStake();
  const { unstake, unstakeState } = useUnstake();
  const { claim, claimState } = useClaim();
  const stakingBalance = useCheckStakingBalance(account ?? '');
  const stakingStarted = useStakingStarted();
  const froggiesStaked = useFroggiesStaked();

  useEffect(() => {
    console.log("staking started: ", stakingStarted);
  }, [stakingStarted])

  useEffect(() => {
    async function getFroggiesOwned(address: string) {
      try {
        setLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_API}/owned`, { account: address});
        setOwned(response.data);
        setLoading(false);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
        setLoading(false);
      }
    }

    if (account) {
      getFroggiesOwned(account);
    }
  }, [account])

  useEffect(() => {
    if (setApprovalForAllState.status === "Exception") {
      console.log("set approval for all error: ", setApprovalForAllState.errorMessage);
    } else if (setApprovalForAllState.status === "Mining") {
      console.log("set approval for all mining...", setApprovalForAllState);
      setShowStakeModal(true);
    } else if (setApprovalForAllState.status === "Success") {
      console.log("set approval for all success: ", setApprovalForAllState);
    } else if (setApprovalForAllState.status === "Fail") {
      console.log("set approval for all error: ", setApprovalForAllState.errorMessage);
    }
  }, [setApprovalForAllState])

  useEffect(() => {
    async function fetchFroggies() {
      setLoading(true);
      const ownedResponse = await axios.post(`${process.env.REACT_APP_API}/owned`, { account: account});
      setOwned(ownedResponse.data);
      setLoading(false);
    }

    if (stakeState.status === "Exception" || stakeState.status === "Fail") {
      console.log("stake error: ", stakeState.errorMessage);
      if (stakeState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(stakeState.errorMessage.replace(/^execution reverted:/i, ''));
        setShowAlert(true);
      }
    } else if (stakeState.status === "Mining") {
      setShowStakeModal(true);
    } else if (stakeState.status === "Success") {
      fetchFroggies();
    }
  }, [stakeState, account])

  useEffect(() => {
    if (unstakeState.status === "Exception" || unstakeState.status === "Fail") {
      console.log("unstake error: ", unstakeState.errorMessage);
      if (unstakeState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(unstakeState.errorMessage.replace(/^execution reverted:/i, ''));
        setShowAlert(true);
      }
    } else if (unstakeState.status === "Mining") {
      setShowUnstakeModal(true);
    }
  }, [unstakeState])

  useEffect(() => {
    if (claimState.status === "Exception" || claimState.status === "Fail") {
      console.log("claim error: ", claimState.errorMessage);
      if (claimState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(claimState.errorMessage.replace(/^execution reverted:/i, ''));
        setShowAlert(true);
      }
    } else if (claimState.status === "Mining") {
      setShowClamModal(true);
    }
  }, [claimState])

  const onStake = async () => {
    try {
      if (stakingStarted) {
        // grant staking contract nft transfer permissions
        if (!owned.isStakingApproved) {
          await setApprovalForAll(process.env.REACT_APP_STAKING_CONTRACT, true);
        }

        // get proof for froggies to stake
        const response = await axios.post(`${process.env.REACT_APP_API}/stake`, froggiesToStake);
        const proof = response.data;
        // deposit nft to staking contract
        await stake(froggiesToStake, proof);
        setFroggiesToStake([]);
      } else {
        setAlertMessage("$RIBBIT staking has not started");
        setShowAlert(true);
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage("Issue staking froggies");
      setShowAlert(true);
      setLoading(false);
    }
  }

  const onUnstake = async () => {
    try {
      await unstake(froggiesToUnstake);
      setFroggiesToUnstake([]);

      setLoading(true);
      const ownedResponse = await axios.post(`${process.env.REACT_APP_API}/owned`, { account: account});
      setOwned(ownedResponse.data);
      setLoading(false);
    } catch (error) {
      setAlertMessage("Issue unstaking froggies");
      setShowAlert(true);
      setLoading(false);
    }
  }

  const onClaim = async () => {
    try {
      await claim();
    } catch (error) {
      setAlertMessage("Issue claiming $RIBBIT");
      setShowAlert(true);
      setLoading(false);
    }
  }

  const onSelectFroggyToStake = (tokenId: number) => {
    if (froggiesToStake.includes(tokenId)) {
      const newFroggiesToStake = froggiesToStake.filter(token => token !== tokenId);
      setFroggiesToStake(newFroggiesToStake);
    } else {
      const newFroggiesToStake = [...froggiesToStake, tokenId];
      setFroggiesToStake(newFroggiesToStake);
    }
  }

  const onSelectFroggyToUnstake = (tokenId: number) => {
    if (froggiesToUnstake.includes(tokenId)) {
      const newFroggiesToUnstake = froggiesToUnstake.filter(token => token !== tokenId);
      setFroggiesToUnstake(newFroggiesToUnstake);
    } else {
      const newFroggiesToUnstake = [...froggiesToUnstake, tokenId];
      setFroggiesToUnstake(newFroggiesToUnstake);
    }
  }

  const getBorderColor = (tokenId: number): string => {
    if (froggiesToStake.includes(tokenId)) {
      return "#5ea14e";
    } else if (froggiesToUnstake.includes(tokenId)) {
      return "#73161D";
    } else {
      return "#1a1b1c";
    }
  };

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const onStakeModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowStakeModal(false);
    }
  }

  const onUnstakeModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowUnstakeModal(false);
    }
  }

  const onClaimModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowClamModal(false);
    }
  }

  const froggiesStakedPercentage = () => {
    let staked = (froggiesStaked / 4444) * 100;
    return staked.toFixed(2);
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
                  <Typography color='secondary' variant='h5'>Team</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/collabs'} underline='none'>
                  <Typography color='secondary' variant='h5'>Collabs</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_STAKING_URL} underline='none'>
                  <Typography color='secondary' variant='h5'>Stake</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/market'} underline='none'>
                  <Typography color='secondary' variant='h5'>Market</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/license'} underline='none'>
                  <Typography color='secondary' variant='h5'>License</Typography>
                </Link>
              </Grid> 
            </Grid>
          }
        </Grid>
        <Grid id='staking' container direction='column' textAlign='center' pt={10}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={8}>
            <Typography variant='h2' color='secondary' fontWeight='bold'>Froggy Friends Staking</Typography>
          </Grid>
          {
            froggiesStaked > 0 && 
            <Grid container item justifyContent='center' xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid className={classes.ribbit} item display='flex' alignItems='center' justifyContent='center' xl={4} lg={4} md={6} sm={7} xs={12}>
                <img src={think} style={{height: 50, width: 50}} alt='think'/>
                <Typography variant='h6' color='secondary' pl={2}>{froggiesStakedPercentage()}&#37; Froggies Staked!</Typography>
              </Grid>
            </Grid>
          }
          <Grid container item textAlign='left' alignItems='center' xl={12} lg={12} md={12} sm={12} xs={12} pb={2}>
            <Grid container item justifyContent='space-evenly' xl={12} lg={12} md={12} sm={12} xs={12} pb={5} pt={2}>
              <Grid className={classes.ribbit} item display='flex' justifyContent='center' alignItems='center' mb={1} xl={3} lg={3} md={3} sm={3} xs={12}>
                <img src={ribbit} style={{height: 50, width: 50}} alt='ribbit'/>
                <Typography variant='h6' color='secondary' pl={2}>{owned.totalRibbit} $RIBBIT Per Day</Typography>
              </Grid>
              <Grid className={classes.ribbit} item display='flex' justifyContent='center' alignItems='center' mb={1} xl={3} lg={3} md={3} sm={3} xs={12} p={1}>
                <img src={chest} style={{height: 50, width: 50}} alt='chest'/>
                <Typography variant='h6' color='secondary' pl={2}>{formatEther(ribbitBalance).slice(0,4)} $RIBBIT Balance</Typography>
              </Grid>
              <Grid className={classes.ribbit} item display='flex' justifyContent='center' alignItems='center' mb={1} xl={3} lg={3} md={3} sm={3} xs={12}>
                <img src={rain} style={{height: 50, width: 50}} alt='rain'/>
                <Typography variant='h6' color='secondary' pl={2}>{formatEther(stakingBalance).slice(0,4)} $RIBBIT Staked</Typography>
              </Grid>
            </Grid>
            <Grid container item justifyContent='center' xl={12} lg={12} md={12} sm={12} xs={12}>
              <Grid item textAlign='center' xl={2} lg={2} md={2} sm={2} xs={4} sx={isTinyMobile ? {maxWidth: '100%',flexBasis: '100%',padding: theme.spacing(2)} : {}}>
                <Button variant='contained' disabled={froggiesToStake.length === 0} onClick={() => onStake()}>
                  <Typography variant='h5'>Stake {froggiesToStake.length || ''}</Typography>  
                </Button>
              </Grid>
              <Grid item textAlign='center' xl={2} lg={2} md={2} sm={3} xs={4} sx={isTinyMobile ? {maxWidth: '100%',flexBasis: '100%',padding: theme.spacing(2)} : {}}>
                <Button variant='contained' disabled={froggiesToUnstake.length === 0} onClick={() => onUnstake()}>
                  <Typography variant='h5'>Unstake {froggiesToUnstake.length || ''}</Typography>  
                </Button>
              </Grid>
              <Grid item textAlign='center' xl={2} lg={2} md={2} sm={2} xs={4} sx={isTinyMobile ? {maxWidth: '100%',flexBasis: '100%',padding: theme.spacing(2)} : {}}>
                <Button variant='contained' onClick={() => onClaim()}>
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
              <CircularProgress color='secondary' size={80}/>
            </Grid>
          }
          <Grid id='froggies' container item xl={12} lg={12} md={12} sm={12} xs={12}>
            {
              owned.froggies.map((froggy: any) => {
                return <Grid key={froggy.edition} item xl={2} lg={2} md={3} sm={6} xs={12} p={2} minHeight={300}>
                  <Card sx={{height: '100%', borderColor: getBorderColor(froggy.edition)}}>
                    <CardMedia component='img' image={froggy.image} alt='Froggy'/>
                    <CardContent>
                      <Typography variant='h5'>{froggy.name}</Typography>
                      <Typography pb={2}>{froggy.ribbit} $RIBBIT per day</Typography>
                      {
                        froggy.isStaked === true && 
                        <Button variant='contained' color='success'  onClick={() => onSelectFroggyToUnstake(froggy.edition)}>
                          <Typography variant='h5'>Unstake</Typography>
                        </Button>
                      }
                      {
                        froggy.isStaked === false && 
                        <Button variant='contained' color='success' onClick={() => onSelectFroggyToStake(froggy.edition)}>
                          <Typography variant='h5'>Stake</Typography>
                        </Button>
                      }
                    </CardContent>
                  </Card>
                </Grid>

              })
            }
          </Grid>
          {
            account && !loading && 
            <Grid item pt={5}>
              <Button variant='contained' onClick={() => window.open("https://opensea.io/collection/froggyfriendsnft", "_blank")}>
                  <Typography variant='h5'>Buy Froggies</Typography>
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
                  <Typography color='secondary'>Team</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/collabs'} underline='none'>
                  <Typography color='secondary'>Collabs</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_STAKING_URL} underline='none'>
                  <Typography color='secondary'>Staking</Typography>
                </Link>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                <Link href={process.env.REACT_APP_WEBSITE_URL + '/market'} underline='none'>
                  <Typography color='secondary'>Market</Typography>
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
      <Modal open={showStakeModal} onClose={onStakeModalClose} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h4" p={3}>{stakeState.status === "Mining" ? "Staking Froggies" : "Froggies Staked"}</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onStakeModalClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' p={3}>
            <Grid item>
              { stakeState.status === "Success" && <img src={hype} style={{height: 100, width: 100}} alt='hype'/> }
              { stakeState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { stakeState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Grid>
          </Grid>
          {
            !owned.isStakingApproved && 
            <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${setApprovalForAllState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
              <Typography id='modal-description' color='primary' variant="h6" p={3}>
                Grant Staking Permissions {setApprovalForAllState.status === "Success" && <Check/>} {setApprovalForAllState.status === "Fail" && <Warning/>}
              </Typography>
            </Link>
          }
          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${stakeState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
            <Typography id='modal-description' color='primary' variant="h6" p={3}>
              Stake Froggies {stakeState.status === "Success" && <Check/>} {stakeState.status === "Fail" && <Warning/>}
            </Typography>
          </Link>
          { (setApprovalForAllState.status === "Mining" || stakeState.status === "Mining") && <LinearProgress  sx={{margin: 2}}/>}
        </Box>
      </Modal>
      <Modal open={showUnstakeModal} onClose={onUnstakeModalClose} keepMounted aria-labelledby='unstake-title' aria-describedby='unstake-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h4" fontWeight='bold' p={3}>{unstakeState.status === "Mining" ? "Unstaking Froggies" : "Froggies Unstaked"}</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onUnstakeModalClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' p={3}>
            <Grid item>
              { unstakeState.status === "Success" && <img src={hi} style={{height: 100, width: 100}} alt='hi'/> }
              { unstakeState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { unstakeState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Grid>
          </Grid>
          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${unstakeState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
            <Typography id='modal-description' color='primary' variant="h6" p={3}>
              Unstake Froggies {unstakeState.status === "Success" && <Check/>} {unstakeState.status === "Fail" && <Warning/>}
            </Typography>
          </Link>
          { unstakeState.status === "Mining" && <LinearProgress  sx={{margin: 2}}/>}
        </Box>
      </Modal>
      <Modal open={showClaimModal} onClose={onClaimModalClose} keepMounted aria-labelledby='claim-title' aria-describedby='claim-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h4" fontWeight='bold' p={3}>{claimState.status === "Mining" ? "Claiming $RIBBIT" : "$RIBBIT Claimed"}</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onClaimModalClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' p={3}>
            <Grid item>
              { claimState.status === "Success" && <img src={hype} style={{height: 100, width: 100}} alt='hype'/> }
              { claimState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { claimState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Grid>
          </Grid>
          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${claimState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
            <Typography id='modal-description' variant="h6" color='primary' p={3}>
              Claim $RIBBIT {claimState.status === "Success" && <Check/>} {claimState.status === "Fail" && <Warning/>}
            </Typography>
          </Link>
          { claimState.status === "Mining" && <LinearProgress sx={{margin: 2}}/>}
        </Box>
      </Modal>
    </Grid>
  );
}

export default App;
