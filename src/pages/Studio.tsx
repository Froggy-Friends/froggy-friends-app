import { CheckCircle, Close, ExpandMore, HourglassBottom, Info, Launch, Warning } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardMedia, Container, Grid, IconButton, LinearProgress, Link, Modal, Paper, Skeleton, Snackbar, Stack, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { Fragment, useEffect, useState } from "react";
import { Owned } from '../models/Owned';
import useDebounce from "../hooks/useDebounce";
import axios from "axios";
import { RibbitItem } from "../models/RibbitItem";
import { History } from "../models/History";
import { Froggy } from "../models/Froggy";
import { usePair, useUnpair } from "../client";
import { createStyles, makeStyles } from "@mui/styles";
import mergeImages from 'merge-images';
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import hi from '../images/hi.png';
import banner from '../images/friends.png';
import { formatDistanceStrict } from "date-fns";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    banner: {
      backgroundImage: `url(${banner})`, 
      backgroundSize: 'cover',
      [theme.breakpoints.up('xl')]: {
        backgroundPositionY: -800
      }
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 700,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
      borderRadius: 5,
      padding: theme.spacing(3),
      minHeight: 500, 
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        height: '100%',
        width: '100%'
      }
    }
  })
);

export default function Studio() {
  const classes = useStyles();
  const theme = useTheme();
  const { account } = useEthers();
  const [search, setSearch] = useState('');
  const [frogs, setFrogs] = useState<Froggy[]>([]);
  const [friends, setFriends] = useState<RibbitItem[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loadingFrogs, setLoadingFrogs] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [selectedFrog, setSelectedFrog] = useState<Froggy>();
  const [selectedFriend, setSelectedFriend] = useState<RibbitItem>();
  const debouncedSearch = useDebounce(search, 500);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showUnpairingModal, setShowUnpairingModal] = useState(false);
  const [preview, setPreview] = useState<string>();
  const [isPairingProcessing, setIsPairingProcessing] = useState<boolean>(false);
  const [isUnpairProcessing, setIsUnpairProcessing] = useState<boolean>(false);
  const { pair, pairState } = usePair();
  const { unpair, unpairState } = useUnpair();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function loadAccountData(address: string) {
      try {
        setLoadingFrogs(true);
        setLoadingFriends(true);
        setFrogs([]);
        setFriends([]);
        setHistory([]);
        const owned = (await axios.get<Owned>(`${process.env.REACT_APP_API}/owned/unstaked/${address}`)).data;
        const friends = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/owned/friends/${account}`)).data;
        const history = (await axios.get<History[]>(`${process.env.REACT_APP_API}/history/${account}`)).data;
        setFrogs(owned.froggies.filter(frog => !frog.isStaked));
        setFriends(friends);
        setHistory(history);
        setLoadingFrogs(false);
        setLoadingFriends(false);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
        setLoadingFrogs(false);
        setLoadingFriends(false);
      }
    }

    if (account) {
      loadAccountData(account);
    }
  }, [account])

  useEffect(() => {
    async function layerImages(sources: any[]) {
      const b64 = await mergeImages(sources, { crossOrigin: 'anonymous'})
      setPreview(b64);
    }

    // only show prevew of existing paired frog
    if (selectedFrog && selectedFrog.isPaired) {
      layerImages([selectedFrog.image]);
      return;
    }

    // show preview of unpaired frog and friend
    if (selectedFrog && selectedFriend) {
      layerImages([selectedFrog.image, selectedFriend.imageTransparent]);
      return;
    }

    // switch frog in preview
    if (selectedFrog) {
      layerImages([selectedFrog.image]);
      return;
    }
  }, [selectedFrog, selectedFriend]);

  useEffect(() => {
    if (pairState.status === "Exception" || pairState.status === "Fail") {
      console.log("pair error: ", pairState.errorMessage);
      if (pairState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(pairState.errorMessage.replace(/^execution reverted:/i, ''));
        setShowAlert(true);
      }
    } else if (pairState.status === 'Mining') {
      setIsPairingProcessing(true);
    }
  }, [pairState])

  useEffect(() => {
      if (unpairState.status === "Exception" || unpairState.status === "Fail") {
          console.log("pair error: ", unpairState.errorMessage);
          if (unpairState.errorMessage?.includes("execution reverted")) {
            setAlertMessage(unpairState.errorMessage.replace(/^execution reverted:/i, ''));
            setShowAlert(true);
          }
      } else if (unpairState.status === 'Mining') {
        setIsUnpairProcessing(true);
      }
  }, [unpairState])

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const onFrogClick = (frog: Froggy) => {
    setSelectedFrog(frog);
  }

  const onFriendClick = (friend: RibbitItem) => {
    setSelectedFriend(friend);
  }

  const onPairClick = (frog: Froggy) => {
    setShowPairingModal(true);
  }

  const onUnpairClick = (frog: Froggy) => {
    setShowUnpairingModal(true);
  }

  const onPair = async (frog: Froggy, friendId: number) => {
    const proof = (await axios.post(`${process.env.REACT_APP_API}/stake`, [frog.edition])).data;
    await pair(frog.edition, proof[0], friendId);
}

  const onUnpair = async (frog: Froggy) => {
    await unpair(frog.edition);
  }

  const onPairingComplete = () => {
    setShowPairingModal(false);
    setSelectedFrog(undefined);
    setSelectedFriend(undefined);
    setIsPairingProcessing(false);
  }

  const onUnpairComplete = () => {
    setShowUnpairingModal(false);
    setSelectedFrog(undefined);
    setSelectedFriend(undefined);
    setIsUnpairProcessing(false);
  }

  const getDate = (dateUtc: string) => {
    const date = new Date(dateUtc);
    const result = formatDistanceStrict(date, Date.now(), {
      addSuffix: true
    })
    return result;
  }

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Typography variant='h3' pb={5}>Froggy Studio</Typography>
        <Grid id='panel' container spacing={theme.spacing(8)}>
          <Grid id='selections' item xl={4} lg={4} md={6} sm={12}>
            <Stack pb={5}>
              <Accordion elevation={0} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>} sx={{p: 0}}>
                  <Stack>
                  <Typography color='secondary' variant='h4'>Unstaked Frogs</Typography>
                  <Typography color='secondary' variant='subtitle1'>Select a frog to get started</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{p: 0}}>
                  {
                    !loadingFrogs && !frogs.length &&
                    <Typography color='secondary' variant='body1'>
                      No frogs in your wallet but you can purchase them on <Link href="https://opensea.io/collection/froggyfriendsnft" target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>Opensea</Link>
                    </Typography>
                  }
                  <Grid className="scrollable" container pb={5} maxHeight={300} overflow='scroll'>
                    {
                      frogs.map(frog => {
                        return <Grid key={frog.edition} item p={1} xl={3}>
                          <Card onClick={() => onFrogClick(frog)}>
                            <CardMedia component='img' src={frog.image} height={100} alt=''/>
                          </Card>
                        </Grid>
                      })
                    }
                  </Grid>
                  {
                    loadingFrogs && 
                    <Grid className="scrollable" container pb={5} maxHeight={300} overflow='scroll'>
                      {
                        new Array(10).fill('').map((item, index) => {
                          return <Grid key={index} item p={1} xl={2.4}>
                            <Skeleton variant='rectangular' animation='wave' height={100}/>  
                          </Grid>
                        })
                      }
                    </Grid>
                  }
                </AccordionDetails>
              </Accordion>
            </Stack>
            <Stack pb={5}>
              <Accordion elevation={0} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>} sx={{p: 0}}>
                  <Stack>
                  <Typography color='secondary' variant='h4'>Owned Friends</Typography>
                  <Typography color='secondary' variant='subtitle1'>Select a friend to pair</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{p: 0}}>
                  {
                    !loadingFriends && !friends.length &&
                    <Typography color='secondary' variant='body1'>
                      No friends in your wallet but you can purchase them on <Link href="https://opensea.io/collection/ribbit-items" target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>Opensea</Link>
                    </Typography>
                  }
                  <Grid className="scrollable" container pb={5} maxHeight={300} overflow='scroll'>
                    {
                      friends.map(friend => {
                        return <Grid key={friend.id} item p={1} xl={3}>
                          <Card onClick={() => onFriendClick(friend)}>
                            <CardMedia component='img' src={friend.image} height={100} alt=''/>
                          </Card>
                        </Grid>
                      })
                    }
                  </Grid>
                  {
                    loadingFriends && 
                    <Grid className="scrollable" container pb={5} maxHeight={300} overflow='scroll'>
                      {
                        new Array(10).fill('').map((item, index) => {
                          return <Grid key={index} item p={1} xl={2.4}>
                            <Skeleton variant='rectangular' animation='wave' height={100}/>  
                          </Grid>
                        })
                      }
                    </Grid>
                  }
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Grid>
          <Grid id='preview' item xl={4} lg={4} md={6} sm={12} mt={3}>
            <Paper elevation={0} sx={{ minHeight: 500}}>
              {
                selectedFrog &&
                <Stack spacing={4}>
                <Typography color='secondary' variant='h4'>Preview {selectedFrog.name}</Typography>
                <Grid container direction='column' justifyContent='space-between'>
                  <Grid item xl={3} lg={3} md={3} sm={6} pb={3}>
                    <img src={preview} alt='' width='100%'/>
                    {
                      selectedFrog && selectedFrog.isPaired &&
                      <Stack spacing={4} pt={2}>
                          <Stack direction='row' spacing={1} alignItems='center'>
                            <Info color="secondary"/>
                            <Typography>Friend preview unavailable for paired frogs</Typography>
                        </Stack>
                        <Grid id='buttons' container>
                            <Button variant='contained' sx={{height: 50}} onClick={() => onUnpairClick(selectedFrog)}>
                                <Typography>Unpair Friend</Typography>
                            </Button>
                        </Grid>
                      </Stack>
                  }
                  {
                    selectedFrog && selectedFriend && !selectedFrog.isPaired &&
                    <Grid id='buttons' container pt={5}>
                        <Button variant='contained' sx={{height: 50}} onClick={() => onPairClick(selectedFrog)}>
                            <Typography>Pair Friend</Typography>
                        </Button>
                    </Grid>
                  }
                  </Grid>
                </Grid>
              </Stack>
              }
            </Paper>
          </Grid>
          <Grid id='history' item xl={4} lg={4} md={6} sm={12} mt={3}>
            {
              history && history.length > 0 &&
              <Fragment>
                <Typography color='secondary' variant='h4' pb={5}>Activity Log</Typography>
                <Stack>
                  {
                    history.map(activity => {
                      return (
                        <Stack key={activity.id} direction='row' spacing={4} pb={2}>
                          { activity.isPairing && <Typography>Pairing</Typography>}
                          { activity.isUnpairing && <Typography>Unpairing</Typography>}
                          <Typography>Frog #{activity.frogId}</Typography>
                          { activity.isPairing && <Typography>Friend #{activity.friendId}</Typography>}
                          <Typography>{getDate(activity.date)}</Typography>
                          { activity.isPairing && <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${activity.pairTx}`} target='_blank' sx={{cursor: 'pointer'}}><Launch/></Link>}
                          { activity.isUnpairing && <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${activity.unpairTx}`} target='_blank' sx={{cursor: 'pointer'}}><Launch/></Link>}
                        </Stack>
                      )
                    })
                  }
                </Stack>
              </Fragment>
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
      <Modal open={showPairingModal}>
        <Stack className={classes.modal}>
            <Stack direction="row" justifyContent="space-between" pb={8}>
                <Typography id='modal-title' variant="h4">Pair a Friend</Typography>
                <IconButton className="cta" size={isSm ? 'small' : 'medium'} color='inherit' onClick={onPairingComplete}>
                    <Close fontSize={isSm ? 'small' : 'medium'}/>
                </IconButton>
            </Stack>
            {
                selectedFriend && !isPairingProcessing &&
                <Stack direction='row' pt={3} spacing={1} alignItems='center'>
                    <Info color="secondary"/>
                    <Typography>Pairing will burn your friend item and apply a staking boost.</Typography>
                </Stack>
            }
            <Stack alignItems='center'>
              { isPairingProcessing && pairState.status === "Success" && <img src={hype} style={{height: 100, width: 100}} alt='hype'/> }
              { isPairingProcessing && pairState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { isPairingProcessing && pairState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Stack>
            {
                isPairingProcessing && pairState.status === 'Success' && 
                <Stack>
                  <Typography>Your frog and friend are paired now and your metadata will update shortly on opensea.</Typography>
                </Stack>
            }
            {
                isPairingProcessing && pairState && pairState.transaction &&
                <Stack direction='row' spacing={1} alignItems='center'>
                  {pairState.status === "Success" && <CheckCircle/>} 
                  {pairState.status === "Fail" && <Warning/>} 
                  {pairState.status === 'Mining' && <HourglassBottom/>}
                  <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${pairState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>
                      <Typography id='pair-tx' variant="h6">
                      Pair friend transaction
                      </Typography>
                  </Link>
                </Stack>
            }
            {
                selectedFrog && selectedFriend && !isPairingProcessing &&
                <Stack pb={3}>
                    <Button variant='contained' disabled={!selectedFriend} onClick={() => onPair(selectedFrog, selectedFriend.id)} sx={{width: 140, height: 45, alignSelf: 'center'}}>
                        <Typography>Confirm</Typography>
                    </Button>
                </Stack>
            }
            {
                selectedFrog && isPairingProcessing && pairState.status === 'Success' &&
                <Stack>
                    <Button variant='contained' onClick={onPairingComplete} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                        <Typography>Done</Typography>
                    </Button>
                </Stack>
            }
            {
                pairState.status === "Mining" && <LinearProgress  sx={{margin: 2}}/>
            }
        </Stack>
      </Modal>
      <Modal open={showUnpairingModal}>
        <Stack className={classes.modal}>
            <Stack direction="row" justifyContent="space-between" pb={8}>
                <Typography id='modal-title' variant="h4">Unpair Friend</Typography>
                <IconButton className="cta" size={isSm ? 'small' : 'medium'} color='inherit' onClick={onUnpairComplete}>
                    <Close fontSize={isSm ? 'small' : 'medium'}/>
                </IconButton>
            </Stack>
            {
                selectedFrog && !isUnpairProcessing && 
                <Stack direction='row' pt={3} spacing={1} alignItems='center'>
                  <Info color="secondary"/>
                  <Typography>Unpairing will remove your staking boost and friend</Typography>
                </Stack>
            }
            <Stack alignItems='center'>
              { isUnpairProcessing && unpairState.status === "Success" && <img src={hi} style={{height: 100, width: 100}} alt='hype'/> }
              { isUnpairProcessing && unpairState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { isUnpairProcessing && unpairState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Stack>
            {
                isUnpairProcessing && unpairState.status === 'Success' && 
                <Stack>
                  <Typography>Your friend is unpaired now and your metadata will update shortly on opensea.</Typography>
                </Stack>
            }
            {
                isUnpairProcessing && unpairState && unpairState.transaction &&
                <Stack direction='row' spacing={1} alignItems='center'>
                  {unpairState.status === "Success" && <CheckCircle/>} 
                  {unpairState.status === "Fail" && <Warning/>} 
                  {unpairState.status === 'Mining' && <HourglassBottom/>}
                  <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${unpairState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>
                      <Typography id='modal-description' variant="h6">
                      Unpair Friend
                      </Typography>
                  </Link>
                </Stack>
            }
            
            {
                selectedFrog && !isUnpairProcessing &&
                <Stack pb={3}>
                    <Button variant='contained' onClick={() => onUnpair(selectedFrog)} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                        <Typography>Confirm</Typography>
                    </Button>
                </Stack>
            }
            {
                selectedFrog && isUnpairProcessing && unpairState.status === 'Success' &&
                <Stack>
                    <Button variant='contained' onClick={onUnpairComplete} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                        <Typography>Done</Typography>
                    </Button>
                </Stack>
            }
            {
                unpairState.status === "Mining" && <LinearProgress  sx={{margin: 2}}/>
            }
        </Stack>
      </Modal>
    </Grid>

  )
}