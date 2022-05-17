import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography, Box, Tab, Tabs, ToggleButton, ToggleButtonGroup, Paper, Button, Card, CardContent, CardMedia, CardHeader, useMediaQuery, useTheme } from "@mui/material";
import market from "../images/market.png";
import { useState } from 'react';
import { Friend } from '../models/Friend';
import { collabFriendsData, friendsData } from '../data';
import ribbit from '../images/ribbit.gif';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
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

  const onFilterToggle = (event: React.MouseEvent<HTMLElement>, isActiveFilter: boolean) => {
    if (isActiveFilter === null) return;
    setActiveFilter(isActiveFilter);
    if (isActiveFilter) {
      setFriends(friendsData.filter(friend => friend.isActive));
      setCollabFriends(collabFriendsData.filter(friend => friend.isActive));
    } else {
      setFriends(friendsData);
      setCollabFriends(collabFriendsData);
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
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={8}>
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
                <Tab label="Friends" {...a11yProps(0)} />
                <Tab label="Golden Lily" {...a11yProps(1)} />
                <Tab label="Froggy King" {...a11yProps(2)} />
                <Tab label="Vito's Art" {...a11yProps(3)} />
                <Tab label="Allowlists" {...a11yProps(4)} />
                <Tab label="NFTs" {...a11yProps(5)} />
                <Tab label="Merch" {...a11yProps(6)} />
                <Tab label="Costumes" {...a11yProps(7)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={2}>Friends</Typography>
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
              <TabPanel value={value} index={1}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Golden Lily Pad</Typography>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Froggy King</Typography>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Vito's Art</Typography>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Allowlists</Typography>
              </TabPanel>
              <TabPanel value={value} index={5}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>NFTs</Typography>
              </TabPanel>
              <TabPanel value={value} index={6}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Merch</Typography>
              </TabPanel>
              <TabPanel value={value} index={7}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Costumes</Typography>
              </TabPanel>
            </Box>
            {/* TODO: Horizontal tabs on mobile */}
          </Grid>
        </Grid>
      </Container>
      <Grid id="cart" className={classes.cart} container justifyContent="end" position="absolute">
        <ShoppingCartIcon color='primary' sx={{ height: isDesktop ? 80 : 60, width: isDesktop ? 80 : 60}}/>
      </Grid>
    </Grid>
  )
}