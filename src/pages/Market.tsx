import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Typography, Tab, Tabs, ToggleButton, ToggleButtonGroup, Button, Card, CardContent, CardMedia, CardHeader, List, ListItemText, ListItem } from "@mui/material";
import { RibbitItem } from '../models/RibbitItem';
import { commify } from '@ethersproject/units';
import { marketplaceUrl } from '../data';
import { useAppDispatch, } from '../redux/hooks';
import { add } from '../redux/cartSlice';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ribbit from '../images/ribbit.gif';
import biz from '../images/biz.png';

interface TabPanelProps {
  id: string;
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, id, ...other } = props;

  return (
    <Grid 
      className="scrollable" 
      id={id} 
      container
      flexDirection="column"
      p={value === index ? 3 : 0}
      hidden={value !== index} 
      role="tabpanel" 
      aria-labelledby={`vertical-tab-${index}`} 
      sx={{maxHeight: 750, overflowY: 'scroll'}} 
      {...other}
    >
      {value === index && (
        <Grid item>
          {children}
        </Grid>
      )}
    </Grid>
  );
}

function a11yProps(id: string) {
  return {
    id: `${id}-tab`,
    'aria-controls': `${id}-tabpanel`,
  };
}

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    market: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0)), url(${marketplaceUrl})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '130%'
    }
  })
);


export default function Market() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState<RibbitItem[]>([]);

  useEffect(() => {
    async function getItems() {
      try {
        const response = await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/contract`);
        let items = response.data;
        setItems(items);
      } catch (error) {
        console.log("fetch items error: ", error);
      }
    }

    getItems();
  }, [])

  const onFilterToggle = (event: React.MouseEvent<HTMLElement>, filter: boolean) => {
    if (filter === null) return;
    setShowAll(filter);
  };

  const filterItems = (category: string) => {
    // category must match 
    // item must be on sale if show available filter is on (when showAll is false)
    return items.filter(item => item.category === category && (showAll || item.isOnSale));
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onBuyItem = (item: RibbitItem) => {
    dispatch(add(item));
  }

  const isItemDisabled = (item: RibbitItem) => {
    if (!item.isOnSale) {
      return true;
    }

    if (item.minted === item.supply) {
      return true;
    }

    return false;
  }

  return (
    <Grid id="market" className={classes.market} container direction="column" justifyContent="start" pt={15}>
      <Grid id="filters" item alignItems="center" p={2}>
        <ToggleButtonGroup
          color="primary"
          value={showAll}
          exclusive
          onChange={onFilterToggle}
          sx={{bgcolor: "#000000d1"}}
        >
          <ToggleButton value={false}>Avl</ToggleButton>
          <ToggleButton value={true}>All</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid id="items-and-cart" container item justifyContent='space-between' p={2} minHeight={855}>
        <Grid id="items" bgcolor="#000000d1" item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            indicatorColor='primary'
            value={value}
            onChange={handleChange}
            aria-label="$RIBBIT Marketplace"
            sx={{ borderRight: 5, borderColor: 'divider' }}
          >
            <Tab label="Golden Lily Pad" {...a11yProps('golden-lily')} />
            <Tab label="Friends" {...a11yProps('friends')} />
            <Tab label="Allowlists" {...a11yProps('allowlists')} />
            <Tab label="NFTs" {...a11yProps('nfts')} />
            <Tab label="Raffles" {...a11yProps('raffles')} />
            <Tab label="Merch" {...a11yProps('merch')} />
            <Tab label="Costumes" {...a11yProps('costumes')} />
          </Tabs>
          <TabPanel id='golden-lily-pad-panel' value={value} index={0}>
            <Typography variant='subtitle1' color='secondary' pb={1}>
              There will only be 5 Golden Lily Pads for sale with each one costing <strong>200,000 $RIBBIT</strong>.
            </Typography>
            <Typography variant='subtitle1' color='secondary'>
                  Golden Lily Pads are loaded with perks: Golden embroidery hoodie, Guaranteed WL spots, 
                  Complimentary food at IRL events, <br/> Complimentary bottle service at IRL events,
                  Complimentary bud service at IRL events and more to come.
            </Typography>
            <Grid id="golden-lilies" container pt={3} pb={3}>
              <Grid item xl={9} lg={12} md={12} sm={12} xs={12}>
                {
                  filterItems('lilies').map((lily, index) => {
                    return <Grid key={index} item xl={3} lg={3} md={5} sm={8} xs={12} minHeight={300}>
                            <Card className={isItemDisabled(lily) ? "disabled" : ""}>
                              <CardHeader title="Golden Lily Pad"/>
                              <CardMedia component='img' image={lily.image} alt='Froggy'/>
                              <CardContent>
                                <Typography variant='subtitle1' color='secondary' pb={1}>{`${lily.supply - lily.minted} / ${lily.supply} Available`}</Typography>
                                <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                  <Typography>{commify(lily.price)}</Typography>
                                </Grid>
                                <Button variant='contained' color='success' onClick={() => onBuyItem(lily)} disabled={isItemDisabled(lily)}>
                                  <AddShoppingCartIcon/>
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid> 
                  })
                }
                {
                  filterItems('lilies').length === 0 && <Typography variant='h4' color='secondary'>No items available</Typography>
                }
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel id='friends-panel' value={value} index={1}>
            <Grid id='friends-description' item xl={12}>
              <Typography variant='subtitle1' color='secondary' pb={5}>
                Friends offer $RIBBIT staking boosts and will be pairable with your Froggy. <br/>
                Pairing a Friend with your Froggy applies the boost and burns the item.
              </Typography>
            </Grid>
            <Grid id='genesis-friends-title' item xl={12}>
              <Typography variant='h6' color='secondary' fontWeight='bold' pb={2}>Genesis Friends</Typography>
            </Grid>
            <Grid id='genesis-friends' container item pb={3} xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
              {
                filterItems('friends').map((friend, index) => { 
                  return <Grid key={index} item p={2} minHeight={300} xl={2} lg={2} md={3} sm={4} xs={12}>
                          <Card className={isItemDisabled(friend) ? "disabled" : ""}>
                            <CardHeader title={`${friend.name}`} titleTypographyProps={{variant: 'h6', color: 'secondary'}}/>
                            <CardMedia component='img' image={friend.previewImage} alt='Froggy'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{`${friend.supply - friend.minted} / ${friend.supply} Available`}</Typography>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{friend.percentage}% Boost</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(friend.price)}</Typography>
                              </Grid>
                              {/* TODO: Add amount slider with friend.limit max */}
                              <Button variant='contained' color='success' onClick={() => onBuyItem(friend)} disabled={isItemDisabled(friend)}>
                                <AddShoppingCartIcon/>
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
              {
                filterItems('friends').length === 0 && <Typography variant='h4' color='secondary' pl={2}>No items available</Typography>
              }
            </Grid>
            <Grid id='collab-friends-title' item xl={12}>
              <Typography variant='h6' color='secondary' fontWeight='bold' pb={2}>Collab Friends</Typography>
            </Grid>
            <Grid id="collab-friends" container item pb={3} xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
              {
                filterItems('collabs').map((friend, index) => { 
                  return <Grid key={index} item p={2} minHeight={300} xl={2} lg={2} md={3} sm={4} xs={12}>
                          <Card className={isItemDisabled(friend) ? "disabled" : ""}>
                            <CardHeader title={`${friend.name}`} titleTypographyProps={{variant: 'h6', color: 'secondary'}}/>
                            <CardMedia component='img' image={friend.previewImage} alt='Froggy'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{`${friend.supply - friend.minted} / ${friend.supply} Available`}</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(friend.price)}</Typography>
                              </Grid>
                              <Button variant='contained' color='success' onClick={() => onBuyItem(friend)} disabled={isItemDisabled(friend)}>
                                <AddShoppingCartIcon/>
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              },
              {
                filterItems('collabs').length === 0 && <Typography variant='h4' color='secondary' pl={2}>No items available</Typography>
              }
            </Grid>
          </TabPanel>
          <TabPanel id='allowlists-panel' value={value} index={2}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Allowlists Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='nfts-panel' value={value} index={3}>
            <Grid item xl={12}>
              <Typography variant='subtitle1' color='secondary' pb={1}>
                Purchase community owned NFTs with $RIBBIT.
              </Typography>
            </Grid>
            <Grid id='nfts' container item xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
              {
                filterItems('nfts').map((nft, index) => {
                  return <Grid key={index} item xl={2} lg={2} md={3} sm={4} xs={12} p={2} minHeight={300}>
                          <Card className={isItemDisabled(nft) ? "disabled" : ""}>
                            <CardHeader title={nft.name}/>
                            <CardMedia component='img' image={nft.image} alt='Froggy'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{`${nft.supply - nft.minted} / ${nft.supply} Available`}</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(nft.price)}</Typography>
                              </Grid>
                              <Button variant='contained' color='success' onClick={() => onBuyItem(nft)} disabled={isItemDisabled(nft)}>
                                <AddShoppingCartIcon/>
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
              {
                filterItems('nfts').length === 0 && <Typography variant='h4' color='secondary' pl={2}>No items available</Typography>
              }
            </Grid>
          </TabPanel>
          <TabPanel id='raffles-panel' value={value} index={4}>
            <Grid item xl={12}>
              <Typography variant='subtitle1' color='secondary' pb={1}>
                Purchase raffle tickets for community owned NFTs with $RIBBIT.
                <br/>Each ticket is a 10% chance of winning a random community owned NFT.
              </Typography>
            </Grid>
            <Grid id='raffles' container item xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
              {
                filterItems('raffles').map((raffle, index) => {
                  return <Grid key={index} item xl={2} lg={2} md={3} sm={4} xs={12} p={2} minHeight={300}>
                          <Card className={isItemDisabled(raffle) ? "disabled" : ""}>
                            <CardHeader title={raffle.name}/>
                            <CardMedia component='img' image={raffle.image} alt='Froggy'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{`${raffle.supply - raffle.minted} / ${raffle.supply} Available`}</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(raffle.price)}</Typography>
                              </Grid>
                              <Button variant='contained' color='success' onClick={() => onBuyItem(raffle)} disabled={isItemDisabled(raffle)}>
                                <AddShoppingCartIcon/>
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
              {
                filterItems('raffles').length === 0 && <Typography variant='h4' color='secondary' pl={2}>No items available</Typography>
              }
            </Grid>
          </TabPanel>
          <TabPanel id='merch-panel' value={value} index={5}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Merch Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='costumes-panel' value={value} index={6}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Costumes Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  )
}