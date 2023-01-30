import { CheckCircle, Close, ExpandMore, HourglassBottom, Info, Launch, Warning } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardMedia, Divider, Grid, IconButton, LinearProgress, Link, Modal, Paper, Skeleton, Snackbar, Stack, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEthers } from "@usedapp/core"
import { Fragment, useEffect, useState } from "react"
import { Froggy } from "../models/Froggy"
import { Owned } from "../models/Owned"
import { RibbitItem } from "../models/RibbitItem"
import { History } from "../models/History";
import axios from "axios"
import { CompatibleFrogTraits } from "../models/CompatibleFrogTraits"
import { Trait } from "../models/Trait"
import { format } from "date-fns";
import { createStyles, makeStyles } from "@mui/styles";
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import { communityWallet, useUpgradeTrait } from "../client"
import { ethers } from "ethers"

declare var window: any;

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

export default function TraitStudio() {
  const { account } = useEthers();
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [frogs, setFrogs] = useState<Froggy[]>([]);
  const [traits, setTraits] = useState<RibbitItem[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loadingFrogs, setLoadingFrogs] = useState(false);
  const [selectedFrog, setSelectedFrog] = useState<Froggy>();
  const [selectedTrait, setSelectedTrait] = useState<Trait>();
  const [ownedCompatibleTraits, setOwnedCompatibleTraits] = useState<Trait[]>([]);
  const [compatibleTraits, setCompatibleTraits] = useState<CompatibleFrogTraits>();
  const [preview, setPreview] = useState<string>();
  const [isCombinationTaken, setIsCombinationTaken] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgradeProcessing, setIsUpgradeProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const { upgrade, upgradeState } = useUpgradeTrait();

  useEffect(() => {
    if (account) {
      loadAccountData(account);
    }
  }, [account]);

  useEffect(() => {
    if (upgradeState.status === "Exception" || upgradeState.status === "Fail") {
      if (upgradeState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(upgradeState.errorMessage.replace(/^execution reverted:/i, ''));
        setShowAlert(true);
      }
    } else if (upgradeState.status === 'Mining') {
      setIsUpgradeProcessing(true);

      // save activity for account, frog and trait id
      if (selectedFrog && selectedTrait && upgradeState.transaction) {
        onTransactionPending(selectedFrog, selectedTrait, upgradeState.transaction.hash);
      }
    }
  }, [upgradeState])

  async function loadAccountData(address: string) {
    try {
      setFrogs([]);
      setTraits([]);
      setOwnedCompatibleTraits([]);
      setHistory([]);
      setLoadingFrogs(true);
      const froggies = (await axios.get<Owned>(`${process.env.REACT_APP_API}/frog/owned/${address}`)).data.froggies;
      const traits = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/traits/${account}`)).data;
      const history = (await axios.get<History[]>(`${process.env.REACT_APP_API}/history/traits/${account}`)).data;
      setFrogs(froggies);
      setTraits(traits);
      setHistory(history);
      setLoadingFrogs(false);
    } catch (error) {
      setAlertMessage("Issue fetching froggies owned");
      setShowAlert(true);
      setLoadingFrogs(false);
    }
  }

  const onTransactionPending = async (frog: Froggy, trait: Trait, tx: string) => {
    try {
      let data = {
        account: account,
        transaction: tx,
        frogId: frog.edition,
        traitId: trait.id
      };
      
      // prompt admin signature
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const message = JSON.stringify(data);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const request = {...data, message: message, signature: signature};
      const historyResponse = await axios.post(`${process.env.REACT_APP_API}/history/traits`, request);
      const upgradeResponse = await axios.post(`${process.env.REACT_APP_API}/upgrades/pending`, request);

      if (historyResponse.status !== 200 || upgradeResponse.status !== 200) {
        setAlertMessage("Error saving trait upgrade activity");
        setShowAlert(true);
      } else {
        setAlertMessage("Trait upgrade processing");
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage("Error saving trait upgrade activity");
      setShowAlert(true);
    }
  }

  const onFrogClick = async (frog: Froggy) => {
    setSelectedFrog(frog);
    setSelectedTrait(undefined);
    setPreview(frog.cid2d);
    setCompatibleTraits(undefined);
    setIsCombinationTaken(false);

    try {
      // get trait preview
      const compatibleTraits = (await axios.get<CompatibleFrogTraits>(`${process.env.REACT_APP_API}/frog/compatible/${frog.edition}`)).data;
      const compatibleTraitsOwned = compatibleTraits.all.filter(trait => traits.some(t => t.traitId === trait.id));
      setCompatibleTraits(compatibleTraits);
      setOwnedCompatibleTraits(compatibleTraitsOwned);
    } catch (error) {
      setAlertMessage("Error getting compatible traits for selected frog");
      setShowAlert(true);
    }
  }

  const onTraitClick = async (frog: Froggy, trait: Trait) => {
    setSelectedTrait(trait);
    setPreview('');
    setLoadingPreview(true);
    setIsCombinationTaken(false);

    try {
      const apiUrl = process.env.REACT_APP_API;
      const frogId = frog.edition;
      const preview = (await axios.get<string>(`${apiUrl}/frog/preview/${frogId}/trait/${trait.id}`)).data;
      const isComboTaken = (await axios.get<boolean>(`${apiUrl}/frog/exists/${frogId}/${trait.id}`)).data;
      const isUpgradeTaken = (await axios.get<boolean>(`${apiUrl}/upgrades/pending/${frogId}/${trait.id}`)).data;
      setPreview(preview);
      setIsCombinationTaken(isComboTaken || isUpgradeTaken);
      setLoadingPreview(false);
    } catch (error) {
      setLoadingPreview(false);
      setAlertMessage("Error getting preview");
      setShowAlert(true);
    }
  }

  const onUpgradeClick = (frog: Froggy, trait: Trait) => {
    setShowUpgradeModal(true);
  }

  const getBorderColor = (tokenId: number): string => {
    return selectedFrog?.edition === tokenId ? theme.palette.primary.main : "transparent";
  }

  const getBorderWidth = (tokenId: number): string => {
    return selectedFrog?.edition === tokenId ? '4px solid' : '0px';
  }

  const getTraitBorderColor = (id: number): string => {
    return selectedTrait?.id === id ? theme.palette.primary.main : "transparent";
  }

  const getTraitBorder = (id: number): string => {
    return selectedTrait?.id === id ? '4px solid' : '0px';
  }

  const isTraitOwned = (trait: Trait): boolean => {
    return ownedCompatibleTraits.some(t => t.id === trait.id);
  }

  const getDate = (dateUtc: string) => {
    const date = new Date(dateUtc);
    const result = format(date, 'MMM dd');
    return result;
  }

  const onUpgradeComplete = () => {
    setShowUpgradeModal(false);
    setSelectedFrog(undefined);
    setSelectedTrait(undefined);
    setIsUpgradeProcessing(false);
    if (account) {
      loadAccountData(account);
    }
  }

  const onUpgrade = async (selectedFrog: Froggy, selectedTrait: Trait) => {
    try {
      // check if frog and trait combination is reserved
      const apiUrl = process.env.REACT_APP_API;
      const frogId = selectedFrog.edition;
      const traitId = selectedTrait.id;
      const isComboTaken = (await axios.get<boolean>(`${apiUrl}/frog/exists/${frogId}/${traitId}`)).data;
      const isUpgradeTaken = (await axios.get<boolean>(`${apiUrl}/upgrades/pending/${frogId}/${traitId}`)).data;
      setIsCombinationTaken(isComboTaken || isUpgradeTaken);

      if (isComboTaken) {
        setAlertMessage("Combination of traits already taken");
        setShowAlert(true);
        return;
      }

      // burn trait item
      const traitItem = traits.find(trait => trait.traitId === traitId);

      if (!traitItem) {
        setAlertMessage("Selected trait not owned");
        setShowAlert(true);
      } else {
        await upgrade(account, communityWallet, traitItem.id, 1, []);
      }
    } catch (error) {
      setAlertMessage("Error processing trait upgrade");
      setShowAlert(true);
    }
  }

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  return (
    <Fragment>
      <Grid id='panel' container spacing={theme.spacing(isSm ? 1 : 8)}>
        <Grid id='selections' item xl={4} lg={4} md={6} sm={12}>
          <Stack pb={5}>
            <Accordion elevation={0} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore/>} sx={{p: 0}}>
                <Stack>
                <Typography color='secondary' variant='h5'>Owned Frogs</Typography>
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
                <Grid className="scrollable" container pb={5} ml={-1} maxHeight={300} overflow='scroll'>
                  {
                    frogs.map(frog => {
                      return <Grid key={frog.edition} item p={1} xl={3}>
                        <Card sx={{border: getBorderWidth(frog.edition), borderColor: getBorderColor(frog.edition), cursor: 'pointer'}} onClick={() => onFrogClick(frog)}>
                          <CardMedia component='img' src={frog.cid2d} height={100} alt=''/>
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
            {
            compatibleTraits &&
            <Grid id='compatible-traits' item mt={3}>
              {
                selectedFrog &&
                <Stack spacing={3}>
                  <Stack>
                    <Typography variant='h5'>Compatible Traits</Typography>
                    <Typography variant='subtitle1'>Owned traits have a green button you can click to preview</Typography>
                  </Stack>
                  {
                    compatibleTraits.all.length === 0 && <Typography>No traits compatible for {selectedFrog.name} please select a different froggy.</Typography>
                  }
                  {
                    compatibleTraits && compatibleTraits.background.length > 0 &&
                    <Stack spacing={1}>
                      <Typography variant='h6'>Background</Typography>
                      <Stack direction='row'>
                      {
                        compatibleTraits.background.map(bg => {
                          return (
                            <Grid key={bg.id} item pr={1}>
                              <Card>
                                <CardMedia component='img' src={bg.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                              </Card>
                              <Button 
                              variant="contained" 
                              color="primary" 
                              sx={{mt: 2, ":disabled": { color: 'white', bgcolor: '#3C3C3C'}}} 
                              disabled={!isTraitOwned(bg)}
                              onClick={() => onTraitClick(selectedFrog, bg)}>
                                {bg.name}
                              </Button>
                            </Grid>
                          )
                        })
                      }
                      </Stack>
                    </Stack>
                  }
                  {
                    compatibleTraits && compatibleTraits.body.length > 0 &&
                    <Stack spacing={1}>
                      <Typography variant='h6'>Body</Typography>
                      <Stack direction='row'>
                      {
                        compatibleTraits.body.map(body => {
                          return (
                            <Grid key={body.id} item pr={1}>
                              <Card>
                                <CardMedia component='img' src={body.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                              </Card>
                              <Button 
                              variant="contained" 
                              color="primary" 
                              sx={{mt: 2, ":disabled": { color: 'white', bgcolor: '#3C3C3C'}}} 
                              disabled={!isTraitOwned(body)}
                              onClick={() => onTraitClick(selectedFrog, body)}>
                                {body.name}
                              </Button>
                            </Grid>
                          )
                        })
                      }
                      </Stack>
                    </Stack>
                  }
                  { compatibleTraits && compatibleTraits.eyes.length > 0 && <Divider sx={{height: 2}}/> }
                  {
                    compatibleTraits && compatibleTraits.eyes.length > 0 &&
                    <Stack spacing={1}>
                      <Typography variant='h6'>Eyes</Typography>
                      <Stack direction='row'>
                      {
                        compatibleTraits.eyes.map(eye => {
                          return (
                            <Grid key={eye.id} item pr={1}>
                              <Card>
                                <CardMedia component='img' src={eye.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                              </Card>
                              <Button 
                              variant="contained" 
                              color="primary" 
                              sx={{mt: 2, ":disabled": { color: 'white', bgcolor: '#3C3C3C'}}} 
                              disabled={!isTraitOwned(eye)}
                              onClick={() => onTraitClick(selectedFrog, eye)}>
                                {eye.name}
                              </Button>
                            </Grid>
                          )
                        })
                      }
                      </Stack>
                    </Stack>
                  }
                  { compatibleTraits && compatibleTraits.mouth.length > 0 && <Divider sx={{height: 2}}/>}
                  {
                    compatibleTraits && compatibleTraits.mouth.length > 0 &&
                    <Stack spacing={1}>
                      <Typography variant='h6'>Mouth</Typography>
                      <Stack direction='row'>
                      {
                        compatibleTraits.mouth.map(mouth => {
                          return (
                            <Grid key={mouth.id} item pr={1}>
                              <Card>
                                <CardMedia component='img' src={mouth.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                              </Card>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{mt: 2, ":disabled": { color: 'white', bgcolor: '#3C3C3C'}}} 
                                disabled={!isTraitOwned(mouth)}
                                onClick={() => onTraitClick(selectedFrog, mouth)}>
                                {mouth.name}
                              </Button>
                            </Grid>
                          )
                        })
                      }
                      </Stack>
                    </Stack>
                  }
                  { compatibleTraits && compatibleTraits.shirt.length > 0 && <Divider sx={{height: 2}}/>}
                  {
                    compatibleTraits && compatibleTraits.shirt.length > 0 &&
                    <Stack spacing={1}>
                      <Typography variant='h6'>Shirt</Typography>
                      <Stack direction='row'>
                      {
                        compatibleTraits.shirt.map(shirt => {
                          return (
                            <Grid key={shirt.id} item pr={1}>
                              <Card>
                                <CardMedia component='img' src={shirt.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                              </Card>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{mt: 2, ":disabled": { color: 'white', bgcolor: '#3C3C3C'}}} 
                                disabled={!isTraitOwned(shirt)}
                                onClick={() => onTraitClick(selectedFrog, shirt)}>
                                {shirt.name}
                                </Button>
                            </Grid>
                          )
                        })
                      }
                      </Stack>
                    </Stack>
                  }
                  { compatibleTraits && compatibleTraits.hat.length > 0 && <Divider sx={{height: 2}}/>}
                  {
                    compatibleTraits && compatibleTraits.hat.length > 0 &&
                    <Stack spacing={1}>
                      <Typography variant='h6'>Hat</Typography>
                      <Stack direction='row'>
                      {
                        compatibleTraits.hat.map(hat => {
                          return (
                            <Grid key={hat.id} item pr={1}>
                              <Card>
                                <CardMedia component='img' src={hat.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                              </Card>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{mt: 2, ":disabled": { color: 'white', bgcolor: '#3C3C3C'}}} 
                                disabled={!isTraitOwned(hat)}
                                onClick={() => onTraitClick(selectedFrog, hat)}>
                                {hat.name}
                              </Button>
                            </Grid>
                          )
                        })
                      }
                      </Stack>
                    </Stack>
                  }
                </Stack>
              }
            </Grid>
          }
          </Stack>
        </Grid>
        <Grid id='preview' item xl={4} lg={4} md={6} sm={12} mt={3}>
          <Paper elevation={0} sx={{ minHeight: 500}}>
            {
              selectedFrog &&
              <Stack spacing={4}>
              <Typography color='secondary' variant='h5'>Preview {selectedFrog.name}</Typography>
              <Grid container direction='column' justifyContent='space-between'>
                <Grid item xl={3} lg={3} md={3} sm={6} pb={3}>
                  {
                    preview && <img src={preview} alt='' width='100%'/>
                  }
                  {
                    loadingPreview && <Skeleton variant='rectangular' animation='wave' height={500}/>  
                  }
                  {
                    selectedFrog.isTraitUpgraded &&
                    <Stack spacing={4} pt={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Info color="secondary"/>
                          <Typography>Trait preview unavailable for upgraded frogs</Typography>
                      </Stack>
                    </Stack>
                  }
                  {
                    isCombinationTaken &&
                    <Stack spacing={4} pt={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Info color="secondary"/>
                          <Typography>Trait combination is already taken</Typography>
                      </Stack>
                    </Stack>
                  }
                  {
                  selectedTrait && !selectedFrog.isTraitUpgraded && preview &&
                  <Grid id='buttons' container justifyContent='center' pt={5}>
                      <Button variant='contained' sx={{height: 50}} disabled={isCombinationTaken} onClick={() => onUpgradeClick(selectedFrog, selectedTrait)}>
                          <Typography>Upgrade Frog</Typography>
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
                      <Stack key={activity.id} direction='row' spacing={isSm ? 2 : 4} pb={2}>
                        { activity.isTraitUpgrade && <Typography>Trait Upgrade</Typography>}
                        <Typography>Frog #{activity.frogId}</Typography>
                        { activity.isTraitUpgrade && <Typography>Trait #{activity.traitId}</Typography>}
                        <Typography>{getDate(activity.date)}</Typography>
                        { activity.isTraitUpgrade && <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${activity.upgradeTx}`} target='_blank' sx={{cursor: 'pointer'}}><Launch/></Link>}
                      </Stack>
                    )
                  })
                }
              </Stack>
            </Fragment>
          }
        </Grid>
      </Grid>
      <Modal open={showUpgradeModal}>
        <Stack className={classes.modal}>
            <Stack direction="row" justifyContent="space-between" pb={8}>
                <Typography id='modal-title' variant="h4">Froggy Trait Upgrade</Typography>
                <IconButton className="cta" size={isSm ? 'small' : 'medium'} color='inherit' onClick={onUpgradeComplete}>
                    <Close fontSize={isSm ? 'small' : 'medium'}/>
                </IconButton>
            </Stack>
            {
                selectedFrog && selectedTrait && !isUpgradeProcessing &&
                <Stack direction='row' pt={3} spacing={1} alignItems='center'>
                    <Warning color="warning"/>
                    <Typography>
                      Upgrading will burn your trait item and apply a trait upgrade on your froggy.
                      You will not be able to downgrade and retrieve your trait.
                      Would you like to proceed?
                    </Typography>
                </Stack>
            }
            <Stack alignItems='center'>
              { isUpgradeProcessing && upgradeState.status === "Success" && <img src={hype} style={{height: 100, width: 100}} alt='hype'/> }
              { isUpgradeProcessing && upgradeState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { isUpgradeProcessing && upgradeState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Stack>
            {
                isUpgradeProcessing && upgradeState.status === 'Success' && 
                <Stack>
                  <Typography>Your froggy trait is upgraded and your metadata will update shortly on opensea.</Typography>
                </Stack>
            }
            {
                isUpgradeProcessing && upgradeState && upgradeState.transaction &&
                <Stack direction='row' spacing={1} alignItems='center'>
                  {upgradeState.status === "Success" && <CheckCircle/>} 
                  {upgradeState.status === "Fail" && <Warning/>} 
                  {upgradeState.status === 'Mining' && <HourglassBottom/>}
                  <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${upgradeState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>
                      <Typography id='pair-tx' variant="h6">
                      Upgrade trait transaction
                      </Typography>
                  </Link>
                </Stack>
            }
            {
                selectedFrog && selectedTrait && !isUpgradeProcessing &&
                <Stack pb={3}>
                    <Button variant='contained' disabled={!selectedFrog || !selectedTrait} onClick={() => onUpgrade(selectedFrog, selectedTrait)} sx={{width: 140, height: 45, alignSelf: 'center'}}>
                        <Typography>Confirm</Typography>
                    </Button>
                </Stack>
            }
            {
                selectedFrog && isUpgradeProcessing && upgradeState.status === 'Success' &&
                <Stack>
                    <Button variant='contained' onClick={onUpgradeComplete} sx={{width: 140, height: 44, alignSelf: 'center'}}>
                        <Typography>Done</Typography>
                    </Button>
                </Stack>
            }
            {
                upgradeState.status === "Mining" && <LinearProgress  sx={{margin: 2}}/>
            }
        </Stack>
      </Modal>
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
    </Fragment>
  )
}