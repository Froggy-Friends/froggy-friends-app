import { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography, Box, Tab, Tabs, ToggleButton, ToggleButtonGroup, Button, Card, CardContent, CardMedia, CardHeader, useMediaQuery, useTheme, Fab } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { RibbitItem } from '../models/RibbitItem';
import { commify } from '@ethersproject/units';
import { Friend } from '../models/Friend';
import { collabFriendsData, friendsData, froggyKingData, goldenLilyPadsData, nftData, raffleData } from '../data';
import market from "../images/market.png";
import ribbit from '../images/ribbit.gif';
import biz from '../images/biz.png';
import dragon from '../images/dragon.png';

interface TabPanelProps {
  id: string;
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, id, ...other } = props;

  return (
    <div
      id={id}
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pl: 5, pt: 5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
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
    friend: {
      flexBasis: "20%",
      maxWidth: "20%",
      [theme.breakpoints.down('lg')]: {
        flexBasis: "50%",
        maxWidth: "50%",
      },
      [theme.breakpoints.down('md')]: {
        flexBasis: "50%",
        maxWidth: "50%",
      },
      [theme.breakpoints.down('sm')]: {
        flexBasis: "100%",
        maxWidth: "100%",
      }
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
  const isBigScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [value, setValue] = useState(0);
  const [activeFilter, setActiveFilter] = useState(true);
  const [friends, setFriends] = useState<Friend[]>(friendsData.filter(friend => friend.isActive));
  const [collabFriends, setCollabFriends] = useState<Friend[]>(collabFriendsData.filter(friend => friend.isActive));
  const [goldenLilyPads, setGoldenLilyPads] = useState<RibbitItem[]>(goldenLilyPadsData.filter(lily => lily.isActive));
  const [froggyKing, setFroggyKing] = useState<RibbitItem[]>(froggyKingData.filter(king => king.isActive));
  const [nfts, setNfts] = useState<RibbitItem[]>(nftData.filter(nft => nft.isActive));
  const [raffles, setRaffles] = useState<RibbitItem[]>(raffleData.filter(raffle => raffle.isActive));

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
      setFriends(friendsData);
      setCollabFriends(collabFriendsData);
      setGoldenLilyPads(goldenLilyPadsData);
      setNfts(nftData);
      setRaffles(raffleData);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onBuyItem = (itemId: number) => {

  }

  return (
    <Grid id="market" className={classes.market} container direction="column" pb={30}>
      <Grid container direction='column' textAlign='center' pt={10}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
          <Typography variant='h2' color='secondary' fontWeight='bold'>$RIBBIT Marketplace</Typography>
        </Grid>
      </Grid>
      <Container maxWidth='xl' disableGutters={isBigScreen}>
        <Grid container>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid id="filters" container alignItems="center" pb={1}>
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
            <Box id="market-container" sx={{ flexGrow: 1, bgcolor: '#00000099', display: 'flex', minHeight: 800 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                indicatorColor='primary'
                value={value}
                onChange={handleChange}
                aria-label="$RIBBIT Marketplace"
                sx={{ borderRight: 5, borderColor: 'divider' }}
              >
                <Tab label="Froggy King" {...a11yProps('froggy-king')} />
                <Tab label="Golden Lily" {...a11yProps('golden-lily')} />
                <Tab label="Friends" {...a11yProps('friends')} />
                <Tab label="Vito's Art" {...a11yProps('vitos-art')} />
                <Tab label="Allowlists" {...a11yProps('allowlists')} />
                <Tab label="NFTs" {...a11yProps('nfts')} />
                <Tab label="Raffles" {...a11yProps('raffles')} />
                <Tab label="Merch" {...a11yProps('merch')} />
                <Tab label="Costumes" {...a11yProps('costumes')} />
              </Tabs>
              <TabPanel id='froggy-king-panel' value={value} index={0}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Froggy King</Typography>
                <Typography variant='h6' color='secondary' pb={1}>
                  The one who climbs to the mountain top of the $RIBBIT leaderboard and reaches 1,000,000 $RIBBIT can become the 'Froggy King' by purchasing
                  the 1 of 1 Golden Dragon Friend.
                </Typography>
                <Grid container direction='column' pt={3} pb={3}>
                  <Grid container justifyContent="center" xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      froggyKing.map(king => {
                        return <Grid item xl={4} lg={4} md={4} sm={4} xs={4} p={2} minHeight={300}>
                                <Card className={king.isActive ? "" : "disabled"}>
                                  <CardHeader title={king.name}/>
                                  <CardMedia component='img' image={king.image} alt='Froggy King'/>
                                  <CardContent>
                                    <Typography variant='h6' color='secondary' pb={1}>{`1 / ${king.supply} Available`}</Typography>
                                    <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                      <Typography>{commify(king.price)}</Typography>
                                    </Grid>
                                    <Button variant='contained' color='success' onClick={() => onBuyItem(king.id)} disabled={!king.isActive}>
                                      <Typography variant='h6' color='secondary'>Buy</Typography>
                                    </Button>
                                  </CardContent>
                                </Card>
                              </Grid>
                      })
                    }
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel id='golden-lily-pad-panel' value={value} index={1}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Golden Lily Pad</Typography>
                <Typography variant='h6' color='secondary' pb={1}>
                  There will only be 5 Golden Lily Pads for sale and each one will cost 200,000 $RIBBIT. <br/>
                  Golden Lily Pads are loaded with perks that include: Golden Embroidery Hoodie, Guaranteed WL Spots,
                  Complimentary Bottle Service At IRL Events, Complimentary Bud Service At IRL Events, Complimentary Food At IRL Events.
                </Typography>
                <Grid id="golden-lilies" container direction='column' pt={3} pb={3}>
                  <Grid container justifyContent="center" xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      goldenLilyPads.map(lily => {
                        return <Grid item xl={4} lg={4} md={4} sm={4} xs={4} p={2} minHeight={300}>
                                <Card className={lily.isActive ? "" : "disabled"}>
                                  <CardHeader title="Golden Lily Pad"/>
                                  <CardMedia component='img' image={lily.image} alt='Froggy'/>
                                  <CardContent>
                                    <Typography variant='h6' color='secondary' pb={1}>{`5 / ${lily.supply} Available`}</Typography>
                                    <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                      <Typography>{commify(lily.price)}</Typography>
                                    </Grid>
                                    <Button variant='contained' color='success' onClick={() => onBuyItem(lily.id)} disabled={!lily.isActive}>
                                      <Typography variant='h6' color='secondary'>Buy</Typography>
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
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Friends</Typography>
                <Typography variant='h6' color='secondary' pb={5}>
                  Friends offer $RIBBIT staking boosts and will be pairable with your Froggy. <br/>
                  Pairing a Friend with your Froggy applies the boost and burns the item.
                </Typography>
                <Grid id="friends" container direction='column' pb={3}>
                  <Typography variant='h5' color='secondary' fontWeight='bold' pb={2}>Genesis Friends</Typography>
                  <Grid container xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      friends.map(friend => { 
                        return <Grid className={classes.friend} key={friend.id} item p={2} minHeight={300}>
                                <Card className={friend.isActive ? "" : "disabled"}>
                                  <CardHeader title={`${friend.name}`}/>
                                  <CardMedia component='img' image={friend.image} alt='Froggy'/>
                                  <CardContent>
                                    <Typography variant='h6' color='secondary' pb={1}>{`10 / ${friend.supply} Avl`}</Typography>
                                    <Typography variant='h6' color='secondary' pb={1}>{friend.boost}% Boost</Typography>
                                    <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                      <Typography>{friend.price}</Typography>
                                    </Grid>
                                    {/* TODO: Add amount slider with friend.limit max */}
                                    <Button variant='contained' color='success' onClick={() => onBuyItem(friend.id)} disabled={!friend.isActive}>
                                      <Typography variant='h6' color='secondary'>Buy</Typography>
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
                    <Grid container xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                      {
                        collabFriends.map(friend => { 
                          return <Grid className={classes.friend} key={friend.id} item p={2} minHeight={300}>
                                  <Card className={friend.isActive ? "" : "disabled"}>
                                    <CardHeader title={`${friend.name}`}/>
                                    <CardMedia component='img' image={friend.image} alt='Froggy'/>
                                    <CardContent>
                                      <Typography variant='h6' color='secondary' pb={1}>{`1 / ${friend.supply} Avl`}</Typography>
                                      <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                        <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                        <Typography>{friend.price}</Typography>
                                      </Grid>
                                      <Button variant='contained' color='success' onClick={() => onBuyItem(friend.id)} disabled={!friend.isActive}>
                                        <Typography variant='h6' color='secondary'>Buy</Typography>
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
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Vito's Art Coming Soon</Typography>
                <Grid container justifyContent="center" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid item>
                      <img src={biz} />
                    </Grid>
                </Grid>
              </TabPanel>
              <TabPanel id='allowlists-panel' value={value} index={4}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Allowlists Coming Soon</Typography>
                <Grid container justifyContent="center" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid item>
                      <img src={biz} />
                    </Grid>
                </Grid>
              </TabPanel>
              <TabPanel id='nfts-panel' value={value} index={5}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>NFTs</Typography>
                <Typography variant='h6' color='secondary' pb={1}>
                  Purchase community owned NFTs with $RIBBIT.
                </Typography>
                <Grid id="nfts" container direction='column' pt={3} pb={3}>
                  <Grid container xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      nfts.map(nft => {
                        return <Grid item xl={3} lg={3} md={3} sm={3} xs={3} p={2} minHeight={300}>
                                <Card className={nft.isActive ? "" : "disabled"}>
                                  <CardHeader title={nft.name}/>
                                  <CardMedia component='img' image={nft.image} alt='Froggy'/>
                                  <CardContent>
                                    <Typography variant='h6' color='secondary' pb={1}>{`1 / ${nft.supply} Available`}</Typography>
                                    <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                      <Typography>{commify(nft.price)}</Typography>
                                    </Grid>
                                    <Button variant='contained' color='success' onClick={() => onBuyItem(nft.id)} disabled={!nft.isActive}>
                                      <Typography variant='h6' color='secondary'>Buy</Typography>
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
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Raffles</Typography>
                <Typography variant='h6' color='secondary' pb={1}>
                  Purchase raffle tickets for community owned NFTs with $RIBBIT.
                </Typography>
                <Grid id="nfts" container direction='column' pt={3} pb={3}>
                  <Grid container xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      raffles.map(raffle => {
                        return <Grid item xl={3} lg={3} md={3} sm={3} xs={3} p={2} minHeight={300}>
                                <Card className={raffle.isActive ? "" : "disabled"}>
                                  <CardHeader title={raffle.name}/>
                                  <CardMedia component='img' image={raffle.image} alt='Froggy'/>
                                  <CardContent>
                                    <Typography variant='h6' color='secondary' pb={1}>{`200 / ${raffle.supply} Available`}</Typography>
                                    <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                      <Typography>{commify(raffle.price)}</Typography>
                                    </Grid>
                                    <Button variant='contained' color='success' onClick={() => onBuyItem(raffle.id)} disabled={!raffle.isActive}>
                                      <Typography variant='h6' color='secondary'>Buy</Typography>
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
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Merch</Typography>
              </TabPanel>
              <TabPanel id='costumes-panel' value={value} index={8}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Costumes Coming Soon</Typography>
                <Grid container justifyContent="center" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid item>
                      <img src={biz} />
                    </Grid>
                </Grid>
              </TabPanel>
            </Box>
            {/* TODO: Horizontal tabs on mobile */}
          </Grid>
        </Grid>
      </Container>
      <Grid id="cart" container justifyContent="end" position="absolute" p={5}>
        <Fab>
          <ShoppingCartIcon fontSize='large'/>
        </Fab>
        
      </Grid>
    </Grid>
  )
}