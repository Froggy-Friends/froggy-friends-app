import { ExpandMore, Info } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardMedia, Grid, Link, Paper, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEthers } from "@usedapp/core"
import { Fragment, useEffect, useState } from "react"
import { Froggy } from "../models/Froggy"
import { Owned } from "../models/Owned"
import { RibbitItem } from "../models/RibbitItem"
import mergeImages from 'merge-images';
import axios from "axios"

export default function TraitUpgrade() {
  const { account } = useEthers();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [frogs, setFrogs] = useState<Froggy[]>([]);
  const [traits, setTraits] = useState<RibbitItem[]>([]);
  const [loadingFrogs, setLoadingFrogs] = useState(false);
  const [loadingTraits, setLoadingTraits] = useState(false);
  const [selectedFrog, setSelectedFrog] = useState<Froggy>();
  const [selectedTrait, setSelectedTrait] = useState<RibbitItem>();
  const [preview, setPreview] = useState<string>();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);

  useEffect(() => {
    async function loadAccountData(address: string) {
      try {
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
    async function getTraitPreview(selectedFrog: Froggy, selectedTrait: RibbitItem) {
      try {
        // get trait preview
        console.log("get image preview...");
        const image = (await axios.get<string>(`${process.env.REACT_APP_API}/frog/preview/${selectedFrog.edition}/trait/${selectedTrait.traitId}`)).data;
        setPreview(image);
      } catch (error) {
        console.log("get trait preview error: ", error);
      }
    }

    if (selectedFrog && selectedTrait) {
      getTraitPreview(selectedFrog, selectedTrait);
    }
  }, [selectedFrog, selectedTrait]);

  const onFrogClick = (frog: Froggy) => {
    setSelectedFrog(frog);
  }

  const onTraitClick = (trait: RibbitItem) => {
    setSelectedTrait(trait);
  }

  const onUpgradeClick = (frog: Froggy) => {
    setShowUpgradeModal(true);
  }

  return (
    <Fragment>
      <Grid id='panel' container spacing={theme.spacing(isSm ? 1 : 8)}>
        <Grid id='selections' item xl={4} lg={4} md={6} sm={12}>
          <Stack pb={5}>
            <Accordion elevation={0} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore/>} sx={{p: 0}}>
                <Stack>
                <Typography color='secondary' variant='h4'>Owned Frogs</Typography>
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
            <Accordion elevation={0} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore/>} sx={{p: 0}}>
                <Stack>
                <Typography color='secondary' variant='h4'>Owned Traits</Typography>
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
                <Grid className="scrollable" container pb={5} maxHeight={300} overflow='scroll'>
                  {
                    traits.map(trait => {
                      return <Grid key={trait.id} item p={1} xl={3}>
                        <Card onClick={() => onTraitClick(trait)}>
                          <CardMedia component='img' src={trait.image} height={100} alt=''/>
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
                    selectedFrog && selectedFrog.isTraitUpgraded &&
                    <Stack spacing={4} pt={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Info color="secondary"/>
                          <Typography>Trait preview unavailable for upgraded frogs</Typography>
                      </Stack>
                    </Stack>
                }
                {
                  selectedFrog && selectedTrait && !selectedFrog.isTraitUpgraded &&
                  <Grid id='buttons' container pt={5}>
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
        {/* <Grid id='history' item xl={4} lg={4} md={6} sm={12} mt={3}>
          {
            history && history.length > 0 &&
            <Fragment>
              <Typography color='secondary' variant='h4' pb={5}>Activity Log</Typography>
              <Stack>
                {
                  history.map(activity => {
                    return (
                      <Stack key={activity.id} direction='row' spacing={isSm ? 2 : 4} pb={2}>
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
        </Grid> */}
      </Grid>
    </Fragment>
  )
}