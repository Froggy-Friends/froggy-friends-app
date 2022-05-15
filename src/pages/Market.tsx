import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography, Box, Tab, Tabs, ToggleButton, ToggleButtonGroup, Paper, Button, Card, CardContent, CardMedia } from "@mui/material";
import market from "../images/market.png";
import { useState } from 'react';
import { Friend } from '../models/Friend';
import { friendsData } from '../data';
import ribbit from '../images/ribbit.gif';

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
        <Box sx={{ p: 3 }}>
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
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.1)), url(${market})`,
      backgroundPosition: "center",
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '100%'
    },
    friend: {
      flexBasis: "20%",
      maxWidth: "20%",
      [theme.breakpoints.down('lg')]: {
        flexBasis: "33%",
        maxWidth: "33%",
      },
      [theme.breakpoints.down('md')]: {
        flexBasis: "50%",
        maxWidth: "50%",
      },
      [theme.breakpoints.down('sm')]: {
        flexBasis: "100%",
        maxWidth: "100%",
      }
    }
  })
);


export default function Market() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [filter, setFilter] = useState('active');
  const [friends, setFriends] = useState<Friend[]>(friendsData);

  const onFilterToggle = (event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onBuyItem = (itemId: number) => {

  }

  return (
    <Grid id="market" className={classes.market} container direction="column" pb={30}>
      <Container maxWidth="xl">
        <Grid container direction='column' textAlign='center' pt={10}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={8}>
            <Typography variant='h2' color='secondary' fontWeight='bold'>$RIBBIT Marketplace</Typography>
          </Grid>
        </Grid>
        <Grid container pb={10}>
          <Grid id="left" xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid container alignItems="center" pb={1}>
              <Typography variant='h4' color='secondary' pr={1}>$RIBBIT Items</Typography>
              <ToggleButtonGroup
                color="primary"
                value={filter}
                exclusive
                onChange={onFilterToggle}
              >
                <ToggleButton value="active">Active</ToggleButton>
                <ToggleButton value="inactive">Inactive</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Box sx={{ flexGrow: 1, bgcolor: '#0000008a', display: 'flex', minHeight: 800 }}>
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
                <Tab label="Epic" {...a11yProps(1)} />
                <Tab label="Vito's Art" {...a11yProps(2)} />
                <Tab label="Allowlists" {...a11yProps(3)} />
                <Tab label="NFTs" {...a11yProps(4)} />
                <Tab label="Merch" {...a11yProps(5)} />
                <Tab label="Costumes" {...a11yProps(6)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={2}>Friends</Typography>
                <Typography variant='body1' color='secondary'>
                  Friends offer $RIBBIT staking boosts and will be pairable with your Froggy. <br/>
                  Pairing a Friend with your Froggy applies the boost and burns the item.
                </Typography>
                <Grid id="friends" container direction='column' pt={3} pb={3}>
                  <Typography variant='h6' color='secondary' fontWeight='bold' pb={2}>Genesis Friends</Typography>
                  <Grid container xl={12} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      friends.map(friend => {
                        return <Grid className={classes.friend} key={friend.id} item p={2} minHeight={300}>
                                <Card>
                                  <CardMedia component='img' image={friend.image} alt='Froggy'/>
                                  <CardContent>
                                    <Typography variant='h5' pb={1}>{friend.name}</Typography>
                                    <Typography pb={1}>10 / {friend.supply} Remain</Typography>
                                    <Grid item display='flex' justifyContent='center' pb={2}>
                                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                      <Typography>{friend.price}</Typography>
                                    </Grid>
                                    {/* Add amount slider with friend.limit as max */}
                                    <Button variant='contained' color='success' onClick={() => onBuyItem(friend.id)}>
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
                <Typography variant='h4' color='secondary' fontWeight='bold'>Epic</Typography>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Vito's Art</Typography>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Allowlists</Typography>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>NFTs</Typography>
              </TabPanel>
              <TabPanel value={value} index={5}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Merch</Typography>
              </TabPanel>
              <TabPanel value={value} index={6}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Costumes</Typography>
              </TabPanel>
            </Box>
            {/* TODO: Horizontal tabs on mobile */}
          </Grid>
          <Grid id="right"  xl={2} lg={2} md={4} sm={4} xs={4}>

          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
}