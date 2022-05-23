import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography, Box, Tab, Tabs, ToggleButton, ToggleButtonGroup, Button, Card, CardContent, CardMedia, CardHeader, useMediaQuery, useTheme, List, ListItemText, ListItem, Fade } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { RibbitItem } from '../models/RibbitItem';
import { commify } from '@ethersproject/units';
import { Friend } from '../models/Friend';
import { collabFriendsData, friendsData, froggyKingData, goldenLilyPadsData, nftData, raffleData } from '../data';
import market from "../images/market.png";
import ribbit from '../images/ribbit.gif';
import biz from '../images/biz.png';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { add, cartItems, cartOpen } from '../redux/cartSlice';

interface TabPanelProps {
  id: string;
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, id, ...other } = props;

  return (
    <Grid id={id} hidden={value !== index} role="tabpanel" aria-labelledby={`vertical-tab-${index}`} {...other}>
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
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0, 0, 0, 0)), url(${market})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '100%'
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
  const isBigScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const [value, setValue] = useState(0);
  const [activeFilter, setActiveFilter] = useState(true);
  const [friends, setFriends] = useState<Friend[]>(friendsData.filter(friend => friend.isActive));
  const [collabFriends, setCollabFriends] = useState<Friend[]>(collabFriendsData.filter(friend => friend.isActive));
  const [goldenLilyPads, setGoldenLilyPads] = useState<RibbitItem[]>(goldenLilyPadsData.filter(lily => lily.isActive));
  const [froggyKing, setFroggyKing] = useState<RibbitItem[]>(froggyKingData.filter(king => king.isActive));
  const [nfts, setNfts] = useState<RibbitItem[]>(nftData.filter(nft => nft.isActive));
  const [raffles, setRaffles] = useState<RibbitItem[]>(raffleData.filter(raffle => raffle.isActive));
  console.log("is cart open: ", isCartOpen);

  const onFilterToggle = (event: React.MouseEvent<HTMLElement>, isActiveFilter: boolean) => {
    if (isActiveFilter === null) return;
    setActiveFilter(isActiveFilter);
    if (isActiveFilter) {
      setFroggyKing(froggyKingData.filter(king => king.isActive));
      setFriends(friendsData.filter(friend => friend.isActive));
      setCollabFriends(collabFriendsData.filter(friend => friend.isActive));
      setGoldenLilyPads(goldenLilyPadsData.filter(lily => lily.isActive));
      setNfts(nftData.filter(nft => nft.isActive));
      setRaffles(raffleData.filter(raffle => raffle.isActive));
    } else {
      setFroggyKing(froggyKingData);
      setGoldenLilyPads(goldenLilyPadsData);
      setFriends(friendsData);
      setCollabFriends(collabFriendsData);
      setNfts(nftData);
      setRaffles(raffleData);
      // TODO: add vitos art, allowlists, merch and costumes
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onBuyItem = (item: RibbitItem) => {
    dispatch(add(item));
  }

  return (
    <Grid id="market" className={classes.market} container justifyContent="center" pt={15} pb={30}>
      <Grid container direction="column" item p={2} xl={10} lg={10} md={12} sm={12} xs={12}>
        <Grid id="filters" item alignItems="center" pb={1}>
          <ToggleButtonGroup
            color="primary"
            value={activeFilter}
            exclusive
            onChange={onFilterToggle}
          >
            <ToggleButton value={true}>Avl</ToggleButton>
            <ToggleButton value={false}>All</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid id="items" item bgcolor="#00000099" minHeight={800}>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            indicatorColor='primary'
            value={value}
            onChange={handleChange}
            aria-label="$RIBBIT Marketplace"
            sx={{ borderRight: 5, borderColor: 'divider' }}
          >
            <Tab label="Froggy King" {...a11yProps('froggy-king')} />
            <Tab label="Golden Lily Pad" {...a11yProps('golden-lily')} />
            <Tab label="Friends" {...a11yProps('friends')} />
            <Tab label="Vito's Art" {...a11yProps('vitos-art')} />
            <Tab label="Allowlists" {...a11yProps('allowlists')} />
            <Tab label="NFTs" {...a11yProps('nfts')} />
            <Tab label="Raffles" {...a11yProps('raffles')} />
            <Tab label="Merch" {...a11yProps('merch')} />
            <Tab label="Costumes" {...a11yProps('costumes')} />
          </Tabs>
          <TabPanel id='froggy-king-panel' value={value} index={0}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Froggy King Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='golden-lily-pad-panel' value={value} index={1}>
            <Typography variant='h6' color='secondary' pb={1}>
              There will only be 5 Golden Lily Pads for sale with each one costing <strong>200,000</strong> $RIBBIT.
            </Typography>
            <Grid id="golden-lilies" container pt={3} pb={3}>
              <Grid item pr={10} xl={4} lg={3} md={3} sm={12} xs={12}>
                <Typography variant='h6' color='secondary'>
                  Golden Lily Pads are loaded with perks that include: 
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
          <TabPanel id='friends-panel' value={value} index={2}>
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
          <TabPanel id='vitos-art-panel' value={value} index={3}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Vito's Art Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='allowlists-panel' value={value} index={4}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Allowlists Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='nfts-panel' value={value} index={5}>
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
          <TabPanel id='raffles-panel' value={value} index={6}>
            <Typography variant='h6' color='secondary' pb={1}>
              Purchase raffle tickets for community owned NFTs with $RIBBIT.
            </Typography>
            <Grid id="nfts" container direction='column' pt={3} pb={3}>
              <Grid container item xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                {
                  raffles.map((raffle, index) => {
                    return <Grid key={index} item xl={3} lg={3} md={3} sm={3} xs={3} p={2} minHeight={300}>
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
          <TabPanel id='merch-panel' value={value} index={7}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Merch Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
          <TabPanel id='costumes-panel' value={value} index={8}>
            <Grid container direction="column" alignItems="center">
              <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Costumes Coming Soon</Typography>
              <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
      <Fade in={isCartOpen}>
        <Grid container item p={2} xl={2} lg={2}>
            <Grid id="cart-container" container item bgcolor="#00000099" minHeight={800} mt={7}>
              <Typography variant='h4' color='secondary' p={2}>Ribbit Cart</Typography>
              {
                items.map(item => {
                  return <Grid container item p={2} xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Typography variant='h6' color='secondary'>{item.name}</Typography>
                  </Grid>
                })
              }
            </Grid>
        </Grid>
      </Fade>
    </Grid>
  )
}