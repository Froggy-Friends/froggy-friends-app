import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Typography, Tab, Tabs, ToggleButton, ToggleButtonGroup, Button, Card, CardContent, CardMedia, CardHeader, useTheme, List, ListItemText, ListItem, Fade, IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';
import { RibbitItem } from '../models/RibbitItem';
import { commify } from '@ethersproject/units';
import { Friend } from '../models/Friend';
import { collabFriendsData, friendsData, goldenLilyPadsData, nftData, raffleData, marketplaceUrl } from '../data';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { add, remove, cartItems, cartOpen } from '../redux/cartSlice';
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
    <Grid className="scrollable" id={id} hidden={value !== index} role="tabpanel" aria-labelledby={`vertical-tab-${index}`} sx={{maxHeight: 750, overflowY: 'scroll'}} {...other}>
      {value === index && (
        <Grid p={3} pt={5}>
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
    },
    panel: {
      maxHeight: 800, 
      overflowY: 'scroll'
    },
    cart: {
      padding: theme.spacing(1),
      [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(7)
      },
    },
    cartIcon: {
      height: 80,
      width: 80
    }
  })
);


export default function Market() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector(cartOpen);
  const items = useAppSelector(cartItems);
  const [value, setValue] = useState(0);
  const [activeFilter, setActiveFilter] = useState(true);
  const [friends, setFriends] = useState<Friend[]>(friendsData.filter(friend => friend.isActive));
  const [collabFriends, setCollabFriends] = useState<Friend[]>(collabFriendsData.filter(friend => friend.isActive));
  const [goldenLilyPads, setGoldenLilyPads] = useState<RibbitItem[]>(goldenLilyPadsData.filter(lily => lily.isActive));
  const [nfts, setNfts] = useState<RibbitItem[]>(nftData.filter(nft => nft.isActive));
  const [raffles, setRaffles] = useState<RibbitItem[]>(raffleData.filter(raffle => raffle.isActive));
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (items) {
      const total = items.reduce((acc, item) => { return acc + item.price}, 0);
      setTotal(total);
    }
  }, [items]);

  const onFilterToggle = (event: React.MouseEvent<HTMLElement>, isActiveFilter: boolean) => {
    if (isActiveFilter === null) return;
    setActiveFilter(isActiveFilter);
    if (isActiveFilter) {
      setFriends(friendsData.filter(friend => friend.isActive));
      setCollabFriends(collabFriendsData.filter(friend => friend.isActive));
      setGoldenLilyPads(goldenLilyPadsData.filter(lily => lily.isActive));
      setNfts(nftData.filter(nft => nft.isActive));
      setRaffles(raffleData.filter(raffle => raffle.isActive));
    } else {
      setGoldenLilyPads(goldenLilyPadsData);
      setFriends(friendsData);
      setCollabFriends(collabFriendsData);
      setNfts(nftData);
      setRaffles(raffleData);
      // TODO: allowlists, merch and costumes
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onBuyItem = (item: RibbitItem) => {
    dispatch(add(item));
  }

  const onRemoveItem = (item: RibbitItem) => {
    dispatch(remove(item));
  }

  return (
    <Grid id="market" className={classes.market} container direction="column" justifyContent="start" pt={15}>
      <Grid id="filters" item alignItems="center" p={2}>
        <ToggleButtonGroup
          color="primary"
          value={activeFilter}
          exclusive
          onChange={onFilterToggle}
          sx={{bgcolor: "#000000d1"}}
        >
          <ToggleButton value={true}>Avl</ToggleButton>
          <ToggleButton value={false}>All</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid id="items-and-cart" container item justifyContent='space-between' p={2} minHeight={855}>
        <Grid id="items" bgcolor="#000000d1" item xl={9} lg={9} md={12} sm={12} xs={12}>
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
            <Typography variant='h6' color='secondary' pb={1}>
              There will only be 5 Golden Lily Pads for sale with each one costing <strong>200,000</strong> $RIBBIT.
            </Typography>
            <Grid id="golden-lilies" container pt={3} pb={3}>
              <Grid item pr={10} xl={4} lg={3} md={3} sm={12} xs={12}>
                <Typography variant='h6' color='secondary'>
                  Golden Lily Pads are loaded with these perks: 
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText>
                      <Typography variant='h6' color='secondary'>&bull; Golden embroidery hoodie</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant='h6' color='secondary'>&bull; Guaranteed WL spots</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant='h6' color='secondary'>&bull; Complimentary bottle service at IRL events</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant='h6' color='secondary'>&bull; Complimentary bud service at IRL events</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant='h6' color='secondary'>&bull; Complimentary food at IRL events</Typography>
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xl={8} lg={9} md={9} sm={9} xs={9}>
                {
                  goldenLilyPads.map((lily, index) => {
                    return <Grid key={index} item xl={4} lg={3} md={5} sm={8} xs={12} p={2} minHeight={300}>
                            <Card className={lily.isActive ? "" : "disabled"}>
                              <CardHeader title="Golden Lily Pad"/>
                              <CardMedia component='img' image={lily.image} alt='Froggy'/>
                              <CardContent>
                                <Typography variant='h6' color='secondary' pb={1}>{`5 / ${lily.supply} Available`}</Typography>
                                <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                  <Typography>{commify(lily.price)}</Typography>
                                </Grid>
                                <Button variant='contained' color='success' onClick={() => onBuyItem(lily)} disabled={!lily.isActive}>
                                  <AddShoppingCartIcon/>
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid> 
                  })
                }
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel id='friends-panel' value={value} index={1}>
            <Typography variant='h6' color='secondary' pb={5}>
              Friends offer $RIBBIT staking boosts and will be pairable with your Froggy. <br/>
              Pairing a Friend with your Froggy applies the boost and burns the item.
            </Typography>
            <Grid id="friends" container direction='column' pb={3}>
              <Typography variant='h5' color='secondary' fontWeight='bold' pb={2}>Genesis Friends</Typography>
              <Grid container item xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                {
                  friends.map((friend, index) => { 
                    return <Grid key={index} item p={2} minHeight={300} xl={2} lg={2} md={2} sm={2} xs={2}>
                            <Card className={friend.isActive ? "" : "disabled"}>
                              <CardHeader title={`${friend.name}`}/>
                              <CardMedia component='img' image={friend.image} alt='Froggy'/>
                              <CardContent>
                                <Typography variant='h6' color='secondary' pb={1}>{`1 / ${friend.supply} Avl`}</Typography>
                                <Typography variant='h6' color='secondary' pb={1}>{friend.boost}% Boost</Typography>
                                <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                  <Typography>{commify(friend.price)}</Typography>
                                </Grid>
                                {/* TODO: Add amount slider with friend.limit max */}
                                <Button variant='contained' color='success' onClick={() => onBuyItem(friend)} disabled={!friend.isActive}>
                                  <AddShoppingCartIcon/>
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid> 
                  })
                }
              </Grid>
            </Grid>
            <Grid id="collab-friends" container direction="column" pt={3} pb={3}>
              <Typography variant='h5' color='secondary' fontWeight='bold' pb={2}>Collab Friends</Typography>
                <Grid container item xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                  {
                    collabFriends.map((friend, index) => { 
                      return <Grid key={index} item p={2} minHeight={300} xl={2} lg={2} md={2} sm={2} xs={2}>
                              <Card className={friend.isActive ? "" : "disabled"}>
                                <CardHeader title={`${friend.name}`}/>
                                <CardMedia component='img' image={friend.image} alt='Froggy'/>
                                <CardContent>
                                  <Typography variant='h6' color='secondary' pb={1}>{`1 / ${friend.supply} Avl`}</Typography>
                                  <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                    <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                    <Typography>{friend.price}</Typography>
                                  </Grid>
                                  <Button variant='contained' color='success' onClick={() => onBuyItem(friend)} disabled={!friend.isActive}>
                                    <AddShoppingCartIcon/>
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid> 
                    })
                  }
                </Grid>
            </Grid>
          </TabPanel>
          <TabPanel id='allowlists-panel' value={value} index={2}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Allowlists Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='nfts-panel' value={value} index={3}>
            <Typography variant='h6' color='secondary' pb={1}>
              Purchase community owned NFTs with $RIBBIT.
            </Typography>
            <Grid id="nfts" container direction='column' pt={3} pb={3}>
              <Grid container item xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                {
                  nfts.map((nft, index) => {
                    return <Grid key={index} item xl={2} lg={2} md={2} sm={2} xs={2} p={2} minHeight={300}>
                            <Card className={nft.isActive ? "" : "disabled"}>
                              <CardHeader title={nft.name}/>
                              <CardMedia component='img' image={nft.image} alt='Froggy'/>
                              <CardContent>
                                <Typography variant='h6' color='secondary' pb={1}>{`1 / ${nft.supply} Available`}</Typography>
                                <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                  <Typography>{commify(nft.price)}</Typography>
                                </Grid>
                                <Button variant='contained' color='success' onClick={() => onBuyItem(nft)} disabled={!nft.isActive}>
                                  <AddShoppingCartIcon/>
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid> 
                  })
                }
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel id='raffles-panel' value={value} index={4}>
            <Typography variant='h6' color='secondary' pb={1}>
              Purchase raffle tickets for community owned NFTs with $RIBBIT.
            </Typography>
            <Grid id="nfts" container direction='column' pt={3} pb={3}>
              <Grid container item xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                {
                  raffles.map((raffle, index) => {
                    return <Grid key={index} item xl={2} lg={2} md={2} sm={2} xs={2} p={2} minHeight={300}>
                            <Card className={raffle.isActive ? "" : "disabled"}>
                              <CardHeader title={raffle.name}/>
                              <CardMedia component='img' image={raffle.image} alt='Froggy'/>
                              <CardContent>
                                <Typography variant='h6' color='secondary' pb={1}>{`200 / ${raffle.supply} Available`}</Typography>
                                <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                  <Typography>{commify(raffle.price)}</Typography>
                                </Grid>
                                <Button variant='contained' color='success' onClick={() => onBuyItem(raffle)} disabled={!raffle.isActive}>
                                  <AddShoppingCartIcon/>
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid> 
                  })
                }
              </Grid>
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
        <Fade id='cart' in={isCartOpen}>
          <Grid container item direction="column" bgcolor="#000000d1" p={2} xl={3}>
            <Grid id='title' container item xl={1}>
              <Typography variant='h4' color='secondary' pb={2} pl={2}>Ribbit Cart</Typography>
            </Grid>
            <Grid id='cart-items' item xl={9} maxHeight={600} sx={{overflowY: 'scroll', "::-webkit-scrollbar": { backgroundColor: 'transparent'}}}>
              {
                items.map((item, index) => {
                  return <Grid key={index} item p={2} xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <CardMedia component="img" sx={{width: 50, p: theme.spacing(1)}} image={item.image} alt={item.name}/>
                      <Typography variant='h6' color='secondary' p={1}>{item.name}</Typography>
                      <Grid item display='flex' justifyContent='center' p={1}>
                        <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                        <Typography>{commify(item.price)}</Typography>
                      </Grid>
                      <IconButton size='small' color='primary' sx={{p: theme.spacing(1)}} onClick={() => onRemoveItem(item)} disabled={!item.isActive}>
                        <CancelIcon/>
                      </IconButton>
                    </Card>  
                  </Grid>
                })
              }
            </Grid>
            <Grid id='total' container item xl={2} alignItems='end'>
              <Grid id="cart-total" item xl={12} lg={12}>
                <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Typography variant='h5' color='secondary' p={1}>Total</Typography>
                  <Grid item display='flex' justifyContent='center' alignItems='center' p={1}>
                    <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                    <Typography>{commify(total)}</Typography>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      </Grid>
    </Grid>
  )
}