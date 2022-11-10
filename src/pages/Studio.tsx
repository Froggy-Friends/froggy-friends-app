import { CheckCircle, Close, ExpandMore, HourglassBottom, Info, Search, Warning } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardMedia, Container, Grid, IconButton, LinearProgress, Link, Modal, Paper, Snackbar, Stack, TextField, Theme, Typography, useTheme } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Owned } from '../models/Owned';
import useDebounce from "../hooks/useDebounce";
import axios from "axios";
import { RibbitItem } from "../models/RibbitItem";
import { Froggy } from "../models/Froggy";
import { usePair, useUnpair } from "../client";
import { createStyles, makeStyles } from "@mui/styles";

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
  const [frogs, setFrogs] = useState<Owned>({froggies:[], totalRibbit: 0, allowance: 0, isStakingApproved: false});
  const [friends, setFriends] = useState<RibbitItem[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [selectedFrog, setSelectedFrog] = useState<Froggy>();
  const debouncedSearch = useDebounce(search, 500);
  const [showUnpairingModal, setShowUnpairingModal] = useState(false);
  const { pair, pairState } = usePair();
  const { unpair, unpairState } = useUnpair();

  useEffect(() => {
    async function getFroggiesOwned(address: string) {
      try {
        const frogs = (await axios.get(`${process.env.REACT_APP_API}/owned/${address}`)).data;
        const friends = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/owned/friends/${account}`)).data;
        setFrogs(frogs);
        setFriends(friends);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
      }
    }

    if (account) {
      getFroggiesOwned(account);
    }
  }, [account])

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

  const onUnpairClick = (frog: Froggy) => {
    setShowUnpairingModal(true);
  }

  const onUnpair = async (frog: Froggy) => {
    await unpair(frog.edition);
  }

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={10}>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Typography color='secondary' variant='h3' pb={5}>Froggy Studio</Typography>

        <Grid id='panel' container spacing={theme.spacing(8)}>
          <Grid id='selections' item xl={4}>
            <Stack>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                  <Stack>
                  <Typography color='secondary' variant='h5'>Owned Frogs</Typography>
                  <Typography color='secondary' variant='subtitle1'>Select a frog to get started</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField placeholder='Search items by name' fullWidth sx={{pb: 5}}
                    InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}
                    value={search} onChange={onSearch}
                  />
                  <Grid container spacing={2} pb={5} maxHeight={300} overflow='scroll'>
                  {
                    frogs.froggies.map(frog => {
                      return <Grid key={frog.edition} item spacing={2} xl={3}>
                        <Card onClick={() => onFrogClick(frog)}>
                          <CardMedia component='img' src={frog.image} height={100} alt=''/>
                          <CardContent sx={{padding: 2}}>
                            <Typography variant="body1">#{frog.edition}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    })
                  }
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Grid>
          <Grid id='preview' item xl={8}>
            <Paper sx={{padding: 2}}>
              <Stack minHeight={500} spacing={4}>
                <Typography color='secondary' variant='h5'>Preview</Typography>
                <img src={selectedFrog?.image} alt='' height={400} width={400}/>
                {
                  selectedFrog && selectedFrog.isPaired &&
                  <Grid id='buttons' container>
                      <Button variant='contained' sx={{height: 50}} onClick={() => onUnpairClick(selectedFrog)}>
                          <Typography>Unpair Friend</Typography>
                      </Button>
                  </Grid>
                }
              </Stack>
            </Paper>
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