import { CheckCircle, Close, ExpandMore, HourglassBottom, Info, Search, Warning } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardMedia, Container, Grid, IconButton, LinearProgress, Link, MenuItem, Modal, Paper, Select, Skeleton, Snackbar, Stack, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Owned } from '../models/Owned';
import useDebounce from "../hooks/useDebounce";
import axios from "axios";
import { RibbitItem } from "../models/RibbitItem";
import { Froggy } from "../models/Froggy";
import { usePair, useUnpair } from "../client";
import { createStyles, makeStyles } from "@mui/styles";
import mergeImages from 'merge-images';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 700,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
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
  const { pair, pairState } = usePair();
  const { unpair, unpairState } = useUnpair();
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between(500, 900));

  useEffect(() => {
    async function getFroggiesOwned(address: string) {
      try {
        setLoadingFrogs(true);
        setLoadingFriends(true);
        setFrogs([]);
        setFriends([]);
        const owned = (await axios.get<Owned>(`${process.env.REACT_APP_API}/owned/${address}`)).data;
        const friends = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/owned/friends/${account}`)).data;
        setFrogs(owned.froggies.filter(frog => !frog.isStaked));
        setFriends(friends);
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
      getFroggiesOwned(account);
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
    }
  }, [pairState])

  useEffect(() => {
      if (unpairState.status === "Exception" || unpairState.status === "Fail") {
          console.log("pair error: ", unpairState.errorMessage);
          if (unpairState.errorMessage?.includes("execution reverted")) {
            setAlertMessage(unpairState.errorMessage.replace(/^execution reverted:/i, ''));
            setShowAlert(true);
          }
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
  }

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={10}>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Typography color='secondary' variant='h3' pb={5}>Froggy Studio Beta</Typography>

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
                  <TextField placeholder='Search frog ID' fullWidth sx={{pb: 5}}
                    InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}
                    value={search} onChange={onSearch}
                  />
                  <Grid className="scrollable" container spacing={2} pb={5} maxHeight={300} overflow='scroll'>
                    {
                      frogs.map(frog => {
                        return <Grid key={frog.edition} item xl={3}>
                          <Card onClick={() => onFrogClick(frog)}>
                            <CardMedia component='img' src={frog.image} height={100} alt=''/>
                          </Card>
                        </Grid>
                      })
                    }
                  </Grid>
                  {
                    loadingFrogs && 
                    <Grid className="scrollable" container spacing={2} pb={5} maxHeight={300} overflow='scroll'>
                      {
                        new Array(10).fill('').map((item, index) => {
                          return <Grid key={index} item xl={2.4}>
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
                  <Grid className="scrollable" container spacing={2} pb={5} maxHeight={300} overflow='scroll'>
                    {
                      friends.map(friend => {
                        return <Grid key={friend.id} item xl={3}>
                          <Card onClick={() => onFriendClick(friend)}>
                            <CardMedia component='img' src={friend.image} height={100} alt=''/>
                          </Card>
                        </Grid>
                      })
                    }
                  </Grid>
                  {
                    loadingFriends && 
                    <Grid className="scrollable" container spacing={2} pb={5} maxHeight={300} overflow='scroll'>
                      {
                        new Array(10).fill('').map((item, index) => {
                          return <Grid key={index} item xl={2.4}>
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
          {
            selectedFrog &&
            <Grid id='preview' item xl={8} lg={8} md={6} sm={12} mt={3}>
              <Paper elevation={0} sx={{ minHeight: 500}}>
                <Stack spacing={4}>
                  <Typography color='secondary' variant='h4'>Preview</Typography>
                  <Grid container direction={isMd ? 'column' : 'row'} justifyContent='space-between'>
                    <Grid item xl={6} lg={6} md={6} sm={6} pb={3}>
                      <img src={preview} alt='' width={isTablet ? '50%' : '100%'}/>
                    </Grid>
                    <Grid item xl={5} lg={5} md={5} sm={5}>
                      <Stack>
                        <Typography variant='h5' fontWeight='bold' pb={5}>{selectedFrog.name}</Typography>
                        <Grid container>
                            {
                                selectedFrog.attributes.map((trait) => {
                                    return (
                                        <Grid key={trait.trait_type} item xl={4} lg={4} md={4} sm={6} xs={6} pb={3}>
                                            <Typography fontWeight='bold'>{trait.trait_type}</Typography>
                                            <Typography>{trait.value}</Typography>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                      </Stack>
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
              </Paper>
            </Grid>
          }
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
          <Box className={classes.modal} minHeight={500}>
              <Stack p={5}>
                  <Stack direction="row" justifyContent="space-between" pb={8}>
                      <Typography id='modal-title' variant="h4">Pairing a Friend</Typography>
                      <IconButton className="cta" size='medium' color='inherit' onClick={() => setShowPairingModal(false)}>
                          <Close fontSize='medium'/>
                      </IconButton>
                  </Stack>
                  {
                      selectedFriend && 
                      <Stack direction='row' pt={3} spacing={1} alignItems='center'>
                          <Info color="secondary"/>
                          <Typography>Pairing will burn your friend item</Typography>
                      </Stack>
                  }
                  {
                      pairState && pairState.transaction &&
                      <Stack pt={3}>
                          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${pairState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>
                              <Typography id='modal-description' variant="h6">
                              {pairState.status === "Success" && <CheckCircle/>} 
                              {pairState.status === "Fail" && <Warning/>} 
                              {pairState.status === 'Mining' && <HourglassBottom/>}
                              Pair friend transaction
                              </Typography>
                          </Link>
                      </Stack>
                  }
                  {
                      selectedFrog && selectedFriend && pairState.status !== 'Success' && pairState.status !== 'Mining' &&
                      <Stack pt={10}>
                          <Button variant='contained' disabled={!selectedFriend} onClick={() => onPair(selectedFrog, selectedFriend.id)} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                              <Typography>Confirm</Typography>
                          </Button>
                      </Stack>
                  }
                  {
                      selectedFrog && pairState.status === 'Success' &&
                      <Stack pt={10}>
                        <Typography pb={5}>Your frog and friend are paired now. Your metadata will refresh shortly.</Typography>
                          <Button variant='contained' onClick={onPairingComplete} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                              <Typography>Done</Typography>
                          </Button>
                      </Stack>
                  }
                  {
                      pairState.status === "Mining" && <LinearProgress  sx={{margin: 2}}/>
                  }
              </Stack>
          </Box>
      </Modal>
      <Modal open={showUnpairingModal}>
          <Box className={classes.modal} minHeight={500}>
              <Stack p={5}>
                  <Stack direction="row" justifyContent="space-between" pb={8}>
                      <Typography id='modal-title' variant="h4">Unpairing Friend</Typography>
                      <IconButton className="cta" size='medium' color='inherit' onClick={() => setShowUnpairingModal(false)}>
                          <Close fontSize='medium'/>
                      </IconButton>
                  </Stack>
                  <Stack direction='row' pt={3} spacing={1} alignItems='center'>
                      <Info color="secondary"/>
                      <Typography>Unpairing will remove your staking boost and friend</Typography>
                  </Stack>
                  
                  {
                      unpairState && unpairState.transaction &&
                      <Stack pt={3}>
                          <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${unpairState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>
                              <Typography id='modal-description' variant="h6">
                              {unpairState.status === "Success" && <CheckCircle/>} 
                              {unpairState.status === "Fail" && <Warning/>} 
                              {unpairState.status === 'Mining' && <HourglassBottom/>}
                              Unpair Friend
                              </Typography>
                          </Link>
                      </Stack>
                  }
                  
                  {
                      selectedFrog && unpairState.status !== 'Success' && unpairState.status !== 'Mining' &&
                      <Stack pt={10}>
                          <Button variant='contained' onClick={() => onUnpair(selectedFrog)} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                              <Typography>Confirm</Typography>
                          </Button>
                      </Stack>
                  }
                  {
                      selectedFrog && unpairState.status === 'Success' &&
                      <Stack pt={10}>
                          <Button variant='contained' onClick={() => setShowUnpairingModal(false)} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                              <Typography>Done</Typography>
                          </Button>
                      </Stack>
                  }
                  {
                      unpairState.status === "Mining" && <LinearProgress  sx={{margin: 2}}/>
                  }
              </Stack>
          </Box>
      </Modal>
    </Grid>

  )
}