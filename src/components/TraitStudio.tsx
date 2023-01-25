import { ExpandMore, Info } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardMedia, Chip, Grid, Link, Paper, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEthers } from "@usedapp/core"
import { Fragment, useEffect, useState } from "react"
import { Froggy } from "../models/Froggy"
import { Owned } from "../models/Owned"
import { RibbitItem } from "../models/RibbitItem"
import axios from "axios"
import { CompatibleFrogTraits } from "../models/CompatibleFrogTraits"
import { Trait } from "../models/Trait"

export default function TraitStudio() {
  const { account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [frogs, setFrogs] = useState<Froggy[]>([]);
  const [traits, setTraits] = useState<RibbitItem[]>([]);
  const [loadingFrogs, setLoadingFrogs] = useState(false);
  const [loadingTraits, setLoadingTraits] = useState(false);
  const [selectedFrog, setSelectedFrog] = useState<Froggy>();
  const [selectedTrait, setSelectedTrait] = useState<Trait>();
  const [ownedCompatibleTraits, setOwnedCompatibleTraits] = useState<Trait[]>([]);
  const [isTraitCompatible, setIsTraitCompatible] = useState<boolean>(false);
  const [compatibleTraits, setCompatibleTraits] = useState<CompatibleFrogTraits>();
  const [preview, setPreview] = useState<string>();
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);

  useEffect(() => {
    async function loadAccountData(address: string) {
      try {
        setFrogs([]);
        setTraits([]);
        setOwnedCompatibleTraits([]);
        setLoadingFrogs(true);
        setLoadingTraits(true);
        const froggies = (await axios.get<Owned>(`${process.env.REACT_APP_API}/frog/owned/${address}`)).data.froggies;
        const traits = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/traits/${account}`)).data;
        setFrogs(froggies);
        setTraits(traits);
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
    async function loadCompatibleTraits(selectedFrog: Froggy) {
      try {
        // get trait preview
        setCompatibleTraits(undefined);
        const compatibleTraits = (await axios.get<CompatibleFrogTraits>(`${process.env.REACT_APP_API}/frog/compatible/${selectedFrog.edition}`)).data;
        setCompatibleTraits(compatibleTraits);
        const compatibleTraitsOwned = compatibleTraits.all.filter(trait => traits.some(t => t.traitId === trait.id));
        setOwnedCompatibleTraits(compatibleTraitsOwned);
        // clear selected trait when none compatible
        if (!compatibleTraitsOwned.length) {
          setSelectedTrait(undefined);
        }
      } catch (error) {
        setCompatibleTraits(undefined);
      }
    }

    if (selectedFrog) {
      setPreview(selectedFrog.cid2d);
      loadCompatibleTraits(selectedFrog);
    }
  }, [selectedFrog]);

  useEffect(() => {
    async function loadPreview(selectedFrog: Froggy, selectedTrait: Trait) {
      try {
        setPreview('');
        setLoadingPreview(true);
        const image = (await axios.get<string>(`${process.env.REACT_APP_API}/frog/preview/${selectedFrog.edition}/trait/${selectedTrait.id}`)).data;
        setPreview(image);
        setLoadingPreview(false); 
      } catch (error) {
        setLoadingPreview(false); 
      }
    }

    if (selectedFrog && selectedTrait) {
      loadPreview(selectedFrog, selectedTrait);
    }

  }, [selectedFrog, selectedTrait])

  const isUpgradeDisabled = (): boolean => {
    // check trait compatibility

    
    return false;
  }

  const onFrogClick = (frog: Froggy) => {
    setSelectedFrog(frog);
  }

  const onTraitClick = (trait: Trait) => {
    setSelectedTrait(trait);
  }

  const onUpgradeClick = (frog: Froggy) => {
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
          </Stack>
          <Stack pb={5}>
            {
              ownedCompatibleTraits.length > 0 &&
              <Accordion elevation={0} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>} sx={{p: 0}}>
                  <Stack>
                  <Typography color='secondary' variant='h5'>Owned Traits</Typography>
                  <Typography color='secondary' variant='subtitle1'>Select a trait to upgrade</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{p: 0}}>
                  {
                    !loadingTraits && !traits.length &&
                    <Typography color='secondary' variant='body1'>
                      No traits in your wallet but you can purchase them on <Link href="https://opensea.io/collection/ribbit-items" target='_blank' sx={{cursor: 'pointer', textDecoration: 'none'}}>Opensea</Link>
                    </Typography>
                  }
                  <Grid className="scrollable" container pb={5} ml={-1} maxHeight={300} overflow='scroll'>
                    {
                      ownedCompatibleTraits.map(trait => {
                        return <Grid key={trait.id} item p={1} xl={3}>
                          <Card sx={{border: getTraitBorder(trait.id), borderColor: getTraitBorderColor(trait.id), cursor: 'pointer'}} onClick={() => onTraitClick(trait)}>
                            <CardMedia component='img' src={trait.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                          </Card>
                        </Grid>
                      })
                    }
                  </Grid>
                  {
                    loadingTraits && 
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
                    selectedFrog && selectedFrog.isTraitUpgraded &&
                    <Stack spacing={4} pt={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Info color="secondary"/>
                          <Typography>Trait preview unavailable for upgraded frogs</Typography>
                      </Stack>
                    </Stack>
                  }
                  {
                  selectedFrog && selectedTrait && !selectedFrog.isTraitUpgraded && isTraitCompatible && preview &&
                  <Grid id='buttons' container justifyContent='center' pt={5}>
                      <Button variant='contained' sx={{height: 50}} onClick={() => onUpgradeClick(selectedFrog)}>
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
        {
          compatibleTraits &&
          <Grid id='compatible-traits' item xl={4} lg={4} md={6} sm={12} mt={3}>
            {
              selectedFrog &&
              <Stack spacing={2}>
                <Typography variant='h5'>Froggy #{selectedFrog.edition} trait compatibility</Typography>
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
                          <Grid key={bg.id} item pr={1} xl={3}>
                            <Card>
                              <CardMedia component='img' src={bg.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                            </Card>
                            <Chip label={bg.name} sx={{mt: 2, display: 'flex'}}/>
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
                          <Grid key={body.id} item pr={1} xl={3}>
                            <Card>
                              <CardMedia component='img' src={body.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                            </Card>
                            <Chip label={body.name} sx={{mt: 2, display: 'flex'}}/>
                          </Grid>
                        )
                      })
                    }
                    </Stack>
                  </Stack>
                }
                {
                  compatibleTraits && compatibleTraits.eyes.length > 0 &&
                  <Stack spacing={1}>
                    <Typography variant='h6'>Eyes</Typography>
                    <Stack direction='row'>
                    {
                      compatibleTraits.eyes.map(eye => {
                        return (
                          <Grid key={eye.id} item pr={1} xl={3}>
                            <Card>
                              <CardMedia component='img' src={eye.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                            </Card>
                            <Chip label={eye.name} sx={{mt: 2, display: 'flex'}}/>
                          </Grid>
                        )
                      })
                    }
                    </Stack>
                  </Stack>
                }
                {
                  compatibleTraits && compatibleTraits.mouth.length > 0 &&
                  <Stack spacing={1}>
                    <Typography variant='h6'>Mouth</Typography>
                    <Stack direction='row'>
                    {
                      compatibleTraits.mouth.map(mouth => {
                        return (
                          <Grid key={mouth.id} item pr={1} xl={3}>
                            <Card>
                              <CardMedia component='img' src={mouth.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                            </Card>
                            <Chip label={mouth.name} sx={{mt: 2, display: 'flex'}}/>
                          </Grid>
                        )
                      })
                    }
                    </Stack>
                  </Stack>
                }
                {
                  compatibleTraits && compatibleTraits.shirt.length > 0 &&
                  <Stack spacing={1}>
                    <Typography variant='h6'>Shirt</Typography>
                    <Stack direction='row'>
                    {
                      compatibleTraits.shirt.map(shirt => {
                        return (
                          <Grid key={shirt.id} item pr={1} xl={3}>
                            <Card>
                              <CardMedia component='img' src={shirt.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                            </Card>
                            <Chip label={shirt.name} sx={{mt: 2, display: 'flex'}}/>
                          </Grid>
                        )
                      })
                    }
                    </Stack>
                  </Stack>
                }
                {
                  compatibleTraits && compatibleTraits.hat.length > 0 &&
                  <Stack spacing={1}>
                    <Typography variant='h6'>Hat</Typography>
                    <Stack direction='row'>
                    {
                      compatibleTraits.hat.map(hat => {
                        return (
                          <Grid key={hat.id} item pr={1} xl={3}>
                            <Card>
                              <CardMedia component='img' src={hat.imageTransparent} height={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                            </Card>
                            <Chip label={hat.name} sx={{mt: 2, display: 'flex'}}/>
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
      </Grid>
    </Fragment>
  )
}