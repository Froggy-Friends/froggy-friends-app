import { CheckCircle, Close, ExpandMore, HourglassBottom, Info, Launch, Warning } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardMedia, Chip, Divider, Grid, IconButton, LinearProgress, Link, Modal, Paper, Skeleton, Stack, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEthers } from "@usedapp/core"
import { Fragment, useEffect, useState } from "react"
import { Froggy } from "../models/Froggy"
import { Owned } from "../models/Owned"
import { RibbitItem } from "../models/RibbitItem"
import { History } from "../models/History";
import axios from "axios"
import { CompatibleFrogTraits } from "../models/CompatibleFrogTraits"
import { Trait } from "../models/Trait"
import { formatDistanceStrict } from "date-fns";
import { createStyles, makeStyles } from "@mui/styles";
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import hi from '../images/hi.png';
import { communityWallet, useUpgradeTrait } from "../client"
import { ethers } from "ethers"
import { TraitPreview } from "../models/TraitPreview"

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
  const [loadingTraits, setLoadingTraits] = useState(false);
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
    async function loadAccountData(address: string) {
      try {
        setFrogs([]);
        setTraits([]);
        setOwnedCompatibleTraits([]);
        setHistory([]);
        setLoadingFrogs(true);
        setLoadingTraits(true);
        const froggies = (await axios.get<Owned>(`${process.env.REACT_APP_API}/frog/owned/${address}`)).data.froggies;
        const traits = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/traits/${account}`)).data;
        const history = (await axios.get<History[]>(`${process.env.REACT_APP_API}/history/traits/${account}`)).data;
        setFrogs(froggies);
        setTraits(traits);
        setHistory(history);
        setLoadingFrogs(false);
        setLoadingTraits(false);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
        setLoadingFrogs(false);
        setLoadingTraits(false);
      }
    }

    if (account) {
      loadAccountData(account);
    }
  }, [account]);

  useEffect(() => {
    if (upgradeState.status === "Exception" || upgradeState.status === "Fail") {
      console.log("upgrade error: ", upgradeState.errorMessage);
      if (upgradeState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(upgradeState.errorMessage.replace(/^execution reverted:/i, ''));
        setShowAlert(true);
      }
    } else if (upgradeState.status === 'Mining') {
      setIsUpgradeProcessing(true);
    }
  }, [upgradeState])

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
      console.log("error getting compatible traits for selected frog...");
    }
  }

  const onTraitClick = async (trait: Trait) => {
    setSelectedTrait(trait);
    setPreview('');
    setLoadingPreview(true);

    try {
      const traitPreview = (await axios.get<TraitPreview>(`${process.env.REACT_APP_API}/frog/preview/${selectedFrog?.edition}/trait/${trait.id}`)).data;
      setPreview(traitPreview.preview);
      setIsCombinationTaken(traitPreview.isCombinationTaken);
      setLoadingPreview(false);
    } catch (error) {
      console.log("error getting preview for selected frog and trait combo");
      setLoadingPreview(false);
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
    const result = formatDistanceStrict(date, Date.now(), {
      addSuffix: true
    })
    return result;
  }

  const onUpgradeComplete = () => {
    setShowUpgradeModal(false);
    setSelectedFrog(undefined);
    setSelectedTrait(undefined);
    setIsUpgradeProcessing(false);
  }

  const onUpgrade = async (selectedFrog: Froggy, selectedTrait: Trait) => {
    // prompt owner signature
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const message = JSON.stringify({ account: account, frogId: selectedFrog.edition, traitId: selectedTrait.id });
    // const signer = provider.getSigner();
    // const signature = await signer.signMessage(message);
    // const address = await signer.getAddress();
    // store history pending state
    // await axios.post(
    //   `${process.env.REACT_APP_API}/history/frog/${selectedFrog.edition}/trait/${selectedTrait.id}`, 
    //   { 
    //     message: message,
    //     signature: signature,
    //     address: address
    //   }
    // );
    // burn trait item
    // console.log("selected trait: ", selectedTrait);
    // const traitItem = traits.find(trait => trait.traitId === selectedTrait.id);
    // if (account && traitItem) {
    //   console.log("trait item to burn: ", traitItem);
    //   await upgrade(account, communityWallet, traitItem.id, 1, []);
    // }
  }

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
                              onClick={() => onTraitClick(bg)}>
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
                              onClick={() => onTraitClick(body)}>
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
                              onClick={() => onTraitClick(eye)}>
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
                                onClick={() => onTraitClick(mouth)}>
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
                                onClick={() => onTraitClick(shirt)}>
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
                                onClick={() => onTraitClick(hat)}>
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
    </Fragment>
  )
}