import { useEthers, useTokenBalance } from '@usedapp/core';
import { makeStyles, createStyles } from '@mui/styles';
import { Box, Grid, IconButton, LinearProgress, Modal, Snackbar, Theme, useMediaQuery, useTheme, Card, CardContent, CardMedia, Container, ButtonGroup, Paper, Skeleton, Stack, Chip } from "@mui/material";
import { Button, Link, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { Check, Close, Launch, Warning } from '@mui/icons-material';
import { useSetApprovalForAll, useStake, useUnstake, useClaim, useCheckStakingBalance, useStakingStarted, useFroggiesStaked } from '../client';
import { formatEther, commify } from '@ethersproject/units';
import { Froggy } from '../models/Froggy';
import axios from 'axios';
import ribbit from '../images/ribbit.gif';
import think from '../images/think.png';
import chest from '../images/chest.png';
import rain from '../images/rain.png';
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import hi from '../images/hi.png';
import banner from '../images/pond.png';
import logo from '../images/logo.png';
import biz from '../images/biz.png'
import { useNavigate } from 'react-router-dom';

interface Owned {
  froggies: Froggy[];
  totalRibbit: number;
  allowance: number;
  isStakingApproved: boolean;
}

const formatBalance = (balance: any) => {
  const etherFormat = formatEther(balance);
  const number = +etherFormat;
  return commify(number.toFixed(0));
}

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: theme.palette.background.default
    },
    banner: {
      backgroundImage: `url(${banner})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
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
    }
  })
);


export default function Staking() {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelow320 = useMediaQuery(theme.breakpoints.down(321));
  const [froggiesToStake, setFroggiesToStake] = useState<number[]>([]);
  const [froggiesToUnstake, setFroggiesToUnstake] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showClaimModal, setShowClamModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState<Owned>({froggies:[], totalRibbit: 0, allowance: 0, isStakingApproved: false});
  const { account } = useEthers();
  const ribbitBalance: any = useTokenBalance(process.env.REACT_APP_RIBBIT_CONTRACT, account) || 0;
  const { setApprovalForAll, setApprovalForAllState } = useSetApprovalForAll();
  const { stake, stakeState } = useStake();
  const { unstake, unstakeState } = useUnstake();
  const { claim, claimState } = useClaim();
  const stakingBalance = useCheckStakingBalance(account ?? '');
  const stakingStarted = useStakingStarted();
  const froggiesStaked = useFroggiesStaked();

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
      setTimeout(() => {
        fetchFroggies();
      }, 5000);
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

  const onSelectFroggy = (froggy: Froggy) => {
    const tokenId = froggy.edition;
    if (froggy.isStaked) {
      // select frog to unstake
      if (froggiesToUnstake.includes(tokenId)) {
        const newFroggiesToUnstake = froggiesToUnstake.filter(token => token !== tokenId);
        setFroggiesToUnstake(newFroggiesToUnstake);
      } else {
        const newFroggiesToUnstake = [...froggiesToUnstake, tokenId];
        setFroggiesToUnstake(newFroggiesToUnstake);
      }
    } else {
      // select frog to stake
      if (froggiesToStake.includes(tokenId)) {
        const newFroggiesToStake = froggiesToStake.filter(token => token !== tokenId);
        setFroggiesToStake(newFroggiesToStake);
      } else {
        const newFroggiesToStake = [...froggiesToStake, tokenId];
        setFroggiesToStake(newFroggiesToStake);
      }
    }
  }

  const getBorderColor = (tokenId: number): string => {
    if (froggiesToStake.includes(tokenId)) {
      return "#5ea14e";
    } else if (froggiesToUnstake.includes(tokenId)) {
      return "#73161D";
    } else {
      return "transparent";
    }
  };

  const getBorderWidth = (tokenId: number): string => {
    if (froggiesToStake.includes(tokenId) || froggiesToUnstake.includes(tokenId)) {
      return '10px solid';
    } else {
      return '0px';
    }
  }

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
    return isNaN(staked) ? '0' : staked.toFixed(2) + '%';
  }

  const onItemClick = (frog: Froggy) => {
    navigate(`/frog/${frog.edition}`);
  }
  
  return (
    <Grid id='app' className={classes.app} container direction='column' pb={30}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 2}}>
        <Grid id='staking' container direction='column' textAlign='center'>
            <Grid container p={isBelow320 ? 0 : 3}>
              <Grid id='stats' container item alignItems='end' xl={9} lg={9} md={9} sm={12} xs={12} pb={3}>
                <Grid id='all-staked' container item direction='column' alignItems='start' xl={2} lg={2} md={3} sm={3} xs={6} pb={4}>
                  <Typography variant='body1' color='secondary' fontWeight='bold' textAlign={isMobile ? 'center' : 'start'} pb={2}>Collection Staked</Typography>
                  <Grid item display='flex' justifyContent={isMobile ? 'center' : 'start'} alignItems='center'>
                    <img src={think} style={{height: 50, width: 50}} alt='Total'/>
                    <Typography variant='h6' color='secondary' pl={2}>{froggiesStakedPercentage()}</Typography>
                  </Grid>
                </Grid>
                <Grid id='balance' container item direction='column' alignItems='start' xl={2} lg={2} md={3} sm={3} xs={6} pb={4}>
                  <Typography variant='body1' color='secondary' fontWeight='bold' textAlign={isMobile ? 'center' : 'start'} pb={2}>Ribbit Balance</Typography>
                  <Grid item display='flex' justifyContent={isMobile ? 'center' : 'start'} alignItems='center'>
                    <img src={chest} style={{height: 50, width: 50}} alt='Balance'/>
                    <Typography variant='h6' color='secondary' pl={2}>{formatBalance(ribbitBalance)}</Typography>
                  </Grid>
                </Grid>
                <Grid id='staked' container item direction='column' alignItems='start' xl={2} lg={2} md={3} sm={3} xs={6} pb={4}>
                  <Typography variant='body1' color='secondary' fontWeight='bold' textAlign={isMobile ? 'center' : 'start'} pb={2}>Ribbit Staked</Typography>
                  <Grid item display='flex' justifyContent={isMobile ? 'center' : 'start'} alignItems='center'>
                    <img src={rain} style={{height: 50, width: 50}} alt='Staked'/>
                    <Typography variant='h6' color='secondary' pl={2}>{formatBalance(stakingBalance)}</Typography>
                  </Grid>
                </Grid>
                <Grid id='ribbit-per-day' container item direction='column' alignItems='start' xl={2} lg={2} md={3} sm={3} xs={6} pb={4}>
                  <Typography variant='body1' color='secondary' fontWeight='bold' textAlign={isMobile ? 'center' : 'start'} pb={2}>Ribbit / Day</Typography>
                  <Grid item display='flex' justifyContent={isMobile ? 'center' : 'start'} alignItems='center'>
                    <img src={ribbit} style={{height: 50, width: 50}} alt='Day'/>
                    <Typography variant='h6' color='secondary'>{owned.totalRibbit}</Typography>
                  </Grid>
                </Grid>
                <Grid id='frogs-owned' container item direction='column' alignItems='start' xl={2} lg={2} md={3} sm={3} xs={6} pb={4}>
                  <Typography variant='body1' color='secondary' fontWeight='bold' textAlign={isMobile ? 'center' : 'start'} pb={2}>Frogs Owned</Typography>
                  <Grid item display='flex' justifyContent={isMobile ? 'center' : 'start'} alignItems='center'>
                    <img src={logo} style={{height: 50, width: 50}} alt='Owned'/>
                    <Typography variant='h6' color='secondary' pl={1}>{owned.froggies.length}</Typography>
                  </Grid>
                </Grid>
                <Grid id='frogs-staked' container item direction='column' alignItems='start' xl={2} lg={2} md={3} sm={3} xs={6} pb={4}>
                  <Typography variant='body1' color='secondary' fontWeight='bold' textAlign={isMobile ? 'center' : 'start'} pb={2}>Frogs Staked</Typography>
                  <Grid item display='flex' justifyContent={isMobile ? 'center' : 'start'} alignItems='center'>
                    <img src={biz} style={{height: 50, width: 50}} alt='Owned'/>
                    <Typography variant='h6' color='secondary' pl={1}>{owned.froggies.reduce((acc, frog) => frog.isStaked ? acc + 1 : 0, 0)}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              {
                owned.froggies.length > 0 && <Grid id='buttons' container item justifyContent={isSm ? 'center' : 'end'} xl={3} lg={3} md={3} sm={12} xs={12} pb={2}>
                  <ButtonGroup sx={{height: isMobile ? 'inherit' : 35, justifyContent: isMobile ? 'center' : 'end'}}>
                    <Button variant='contained' disabled={froggiesToStake.length === 0} onClick={() => onStake()}>
                      Stake {froggiesToStake.length || ''}
                    </Button>
                    <Button variant='contained' disabled={froggiesToUnstake.length === 0} onClick={() => onUnstake()}>
                      Unstake {froggiesToUnstake.length || ''}
                    </Button>
                    <Button variant='contained' onClick={() => onClaim()}>Claim</Button>
                  </ButtonGroup>
                </Grid>
              }
            </Grid>
          <Grid id='froggies' container item xl={12} lg={12} md={12} sm={12} xs={12}>
            {
              loading && 
              new Array(20).fill('').map((item, index) => {
                return <Grid key={index} item xl={2.4} lg={2.4} md={3} sm={6} xs={12} pl={2} pb={2}>
                  <Skeleton variant='rectangular' animation='wave' height={300}/>  
                </Grid>
              })
            }
            {
              !account && <Typography variant='h6' pl={3} pt={5}>Login to view staked frogs</Typography>
            }
            {
              account && owned.froggies.length === 0 && 
              <Stack spacing={1} direction={isMobile ? 'column' : 'row'} alignItems='center' pt={5}>
                <Typography pl={3} display='flex' alignItems='center'>Purchase Froggy Friends on Opensea to begin staking</Typography>
                <Paper elevation={3} sx={{borderRadius: 25, width: 34, height: 34}}>
                  <IconButton className="cta" size='small' href='https://opensea.io/collection/froggyfriendsnft' target='_blank'>
                    <Launch/>
                  </IconButton>
                </Paper>
              </Stack>
            }
            {
              owned.froggies.map((froggy: Froggy) => {
                return <Grid key={froggy.edition} item xl={2} lg={2} md={3} sm={6} xs={12} p={2} minHeight={300}>
                  <Card sx={{height: '100%', border: getBorderWidth(froggy.edition), borderColor: getBorderColor(froggy.edition)}} onClick={() => onSelectFroggy(froggy)}>
                    <CardMedia component='img' image={froggy.image} alt='Froggy'/>
                    <CardContent sx={{bgcolor: theme.palette.common.white, paddingBottom: 0}}>
                      <Typography variant='body1' fontWeight='bold' pb={1} pt={1}>{froggy.name}</Typography>
                      <Grid container item justifyContent='space-between'>
                        {
                          froggy.isStaked ? (
                            <Typography display='flex' alignItems='center'> 
                              <img src={ribbit} style={{height: 30, width: 30}} alt='think'/>
                              {froggy.ribbit} day
                            </Typography>
                          ) : (
                            <Chip label='unstaked'/>
                          )
                        }
                        <Button variant='outlined' color='inherit' onClick={() => onItemClick(froggy)}>
                          <Typography variant='body2'>MORE</Typography>
                        </Button>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              })
            }
          </Grid>
        </Grid>  
      </Container>  
      
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
              <Typography id='modal-description' variant="h6" p={3}>
                Grant Staking Permissions {setApprovalForAllState.status === "Success" && <Check/>} {setApprovalForAllState.status === "Fail" && <Warning/>}
              </Typography>
            </Link>
          }
          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${stakeState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
            <Typography id='modal-description' variant="h6" p={3}>
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
            <Typography id='modal-description' variant="h6" p={3}>
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
            <Typography id='modal-description' variant="h6" p={3}>
              Claim $RIBBIT {claimState.status === "Success" && <Check/>} {claimState.status === "Fail" && <Warning/>}
            </Typography>
          </Link>
          { claimState.status === "Mining" && <LinearProgress sx={{margin: 2}}/>}
        </Box>
      </Modal>
    </Grid>
  );
}
