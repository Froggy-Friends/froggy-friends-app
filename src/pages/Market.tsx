import { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Typography, Tab, Tabs, ToggleButton, ToggleButtonGroup, Button, Card, CardContent, CardMedia, CardHeader, LinearProgress, Modal, Box, IconButton, Link, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import { RibbitItem } from '../models/RibbitItem';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { commify, formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import { useApproveSpender, useCollabBuy, useSpendingApproved } from '../client';
import { marketplaceUrl } from '../data';
import { useAppDispatch, } from '../redux/hooks';
import { add } from '../redux/cartSlice';
import { Check, Close, OpenInNew, Warning } from '@mui/icons-material';
import axios from 'axios';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ribbit from '../images/ribbit.gif';
import biz from '../images/biz.png';
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import discord from '../images/discord.png';
import twitter from '../images/twitter.png';
import chest from '../images/chest.png';

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
      minHeight: '130%',
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6)
      }
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: '#cfdcae',
      color: theme.palette.background.default,
      border: '0px',
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    }
  })
);


export default function Market() {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState<RibbitItem[]>([]);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { account } = useEthers();
  const { collabBuy, collabBuyState } = useCollabBuy();
  const { approveSpender, approveSpenderState } = useApproveSpender();
  const isSpendingApproved = useSpendingApproved(account ?? '');
  const ribbitBalance: BigNumber | undefined = useTokenBalance(process.env.REACT_APP_RIBBIT_CONTRACT, account);

  async function getItems() {
    try {
      setLoadingItems(true);
      const response = await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/contract`);
      let items = response.data;
      setItems(items);
      setLoadingItems(false);
    } catch (error) {
      setLoadingItems(false);
      setAlertMessage("Failed to get items");
      setShowAlert(true);
    }
  }

  async function getItemsBackground() {
    try {
      const response = await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/contract`);
      let items = response.data;
      setItems(items);
    } catch (error) {
      console.log("fetch items in background error: ", error);
    }
  }
  
  useEffect(() => {
    if (approveSpenderState.status === "Exception" || approveSpenderState.status === "Fail") {
      if (approveSpenderState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(approveSpenderState.errorMessage.replace(/^execution reverted:/i, ''));
      } else {
        setAlertMessage(approveSpenderState.errorMessage);
      }

      setShowAlert(true);
    } else if (approveSpenderState.status === "Mining") {
      setShowPurchaseModal(true);
    }
  }, [approveSpenderState])

  useEffect(() => {
    if (collabBuyState.status === "Exception" || collabBuyState.status === "Fail") {
      if (collabBuyState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(collabBuyState.errorMessage.replace(/^execution reverted:/i, ''));
      } else {
        setAlertMessage(collabBuyState.errorMessage);
      }

      setShowAlert(true);
    } else if (collabBuyState.status === "Mining") {
      setShowPurchaseModal(true);
    }
  }, [collabBuyState])

  useEffect(() => {
    getItems();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      getItemsBackground();
    }, 30000);
    return () => clearInterval(interval);
  }, [])

  const onFilterToggle = (event: React.MouseEvent<HTMLElement>, filter: boolean) => {
    if (filter === null) return;
    setShowAll(filter);
  };

  const filterItems = (category: string) => {
    return items.filter(item => {
      // category must match
      if (item.category !== category) {
        return false;
      }

      // if show available filter on check if item is not for sale or sold out
      if (!showAll && (!item.isOnSale || item.minted === item.supply)) {
        return false;
      }

      return true;
    });
  }

  const getItemTitle = (item: RibbitItem) => {
    if (item.minted === item.supply) {
      return "Sold Out!";
    }

    if (!item.isOnSale) {
      return "Off Market";
    }

    return `${item.supply - item.minted} / ${item.supply} Available`;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onBuyItem = (item: RibbitItem) => {
    dispatch(add(item));
  }

  const onBuyCollabItem = async (item: RibbitItem) => {
    // buy collab item directly
    try {
      // check ribbit item is granted approval to spend ribbit
      if (!isSpendingApproved) {
        // request unlimited spending approval
        await approveSpender(process.env.REACT_APP_RIBBIT_ITEM_CONTRACT, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      }

      // buy bundle items
      await collabBuy(item.id, 1, item.collabId);
    } catch (error) {
      setAlertMessage("Buy collab item error");
      setShowAlert(true);
    }
  }

  const onPurchaseModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowPurchaseModal(false);
    }
  }

  const isItemDisabled = (item: RibbitItem) => {
    if (!item.isOnSale) {
      return true;
    }

    if (item.minted === item.supply) {
      return true;
    }

    if (!account) {
      return true;
    }

    return false;
  }

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const onLoadingItemsClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setLoadingItems(false);
    }
  }

  const formatBalance = (balance: BigNumber | undefined) => {
    if (!balance) {
      return 0;
    }
    const etherFormat = formatEther(balance);
    const number = +etherFormat;
    return commify(number.toFixed(2));
  }

  return (
    <Grid id="market" className={classes.market} container direction="column" justifyContent="start" pt={15}>
      <Grid id='filters-and-items-link' container direction={isSmallMobile ? 'column' : 'row'} justifyContent='space-between' alignItems={isSmallMobile ? 'start' : 'center'}>
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
        <Grid id='balance' item display='flex' justifyContent='center' alignItems='center' bgcolor='#000000d1' borderRadius={2} p={1} ml={2} pl={2} pr={2}>
          <img src={chest} style={{height: 25, width: 25}} alt='chest'/>
          <Typography variant='h6' color='secondary' pl={2}>{formatBalance(ribbitBalance)} $RIBBIT</Typography>
        </Grid>
        <Grid id='item-link' p={2} zIndex={0}>
          <Button className='transparent' size='medium' endIcon={<OpenInNew sx={{padding: 1}}/>}>
            <Link href='https://opensea.io/account/ribbit-items' variant='subtitle1' color='inherit' underline='none' target='_blank' p={0.5}>Purchased Items</Link>
          </Button>
        </Grid>
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
            <Tab label="NFTs" {...a11yProps('nfts')} />
            <Tab label="Raffles" {...a11yProps('raffles')} />
            <Tab label="Allowlists" {...a11yProps('allowlists')} />
            <Tab label="Merch" {...a11yProps('merch')} />
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
                    return <Grid key={index} item xl={2.5} lg={2.5} md={3.5} sm={5} xs={12} minHeight={450}>
                            <Card className={isItemDisabled(lily) ? "disabled" : ""}>
                              <CardHeader title="Golden Lily Pad" titleTypographyProps={{variant: 'h6', color: 'secondary'}}/>
                              <CardMedia component='img' image={lily.image} alt='Golden Lily Pad'/>
                              <CardContent>
                                <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(lily)}</Typography>
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
                Pairing a Friend with your Froggy applies the boost and burns the item. <br/>
                Collab Friends are available to purchase if you own the collab NFT.
              </Typography>
            </Grid>
            <Grid id='genesis-friends-title' item xl={12}>
              <Typography variant='h6' color='secondary' fontWeight='bold' pb={2}>Genesis Friends</Typography>
            </Grid>
            <Grid id='genesis-friends' container item pb={3} xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
              {
                filterItems('friends').map((friend, index) => { 
                  return <Grid key={index} item p={2} minHeight={450} xl={2} lg={2} md={3} sm={4} xs={12}>
                          <Card className={isItemDisabled(friend) ? "disabled" : ""}>
                            <CardHeader title={`${friend.name}`} titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}/>
                            <CardMedia component='img' image={friend.previewImage} alt='Genesis Friend'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(friend)}</Typography>
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
            {
              filterItems('collabs').length > 0 &&
              <Grid id='collab-friends-title' item xl={12}>
                <Typography variant='h6' color='secondary' fontWeight='bold' pb={2}>Collab Friends</Typography>
              </Grid>
            }
            <Grid id="collab-friends" container item pb={3} xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
              {
                filterItems('collabs').map((friend, index) => { 
                  return <Grid key={index} item p={2} minHeight={450} xl={2} lg={2} md={3} sm={4} xs={12}>
                          <Card className={isItemDisabled(friend) ? "disabled" : ""}>
                            <CardHeader title={`${friend.name}`} titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}/>
                            <CardMedia component='img' image={friend.previewImage} alt='Collab Friend'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(friend)}</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(friend.price)}</Typography>
                              </Grid>
                              <Button variant='contained' color='success' onClick={() => onBuyCollabItem(friend)} disabled={isItemDisabled(friend)}>
                                Buy Now
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
            </Grid>
          </TabPanel>
          <TabPanel id='nfts-panel' value={value} index={2}>
            {
              filterItems('nfts').length > 0 &&
              <Fragment>
                <Grid item xl={12}>
                  <Typography variant='subtitle1' color='secondary' pb={1}>
                    Purchase community owned NFTs with $RIBBIT.
                  </Typography>
                </Grid>
                <Grid id='nfts' container item xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
                  {
                    filterItems('nfts').map((nft, index) => {
                      return <Grid key={index} item xl={2} lg={2} md={3} sm={4} xs={12} p={2} minHeight={450}>
                              <Card className={isItemDisabled(nft) ? "disabled" : ""}>
                                <CardHeader titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}
                                  title={
                                    <Grid item display='flex' justifyContent='center'>
                                      <Typography>{nft.name}</Typography>
                                      <Grid item display={nft.twitter ? "flex" : "none"} pl={2}>
                                        <Link href={nft.twitter} target='_blank'>
                                          <img src={twitter} style={{height: 20, width: 20}} alt='twitter'/>
                                        </Link>
                                      </Grid>
                                      <Grid item display={nft.discord ? "flex" : "none"} pl={1}>
                                        <Link href={nft.discord} target="_blank">
                                          <img src={discord} style={{height: 20, width: 20}} alt='discord'/>
                                        </Link>
                                      </Grid>
                                    </Grid>
                                  }
                                />
                                <CardMedia component='img' image={nft.image} alt='NFT'/>
                                <CardContent>
                                  <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(nft)}</Typography>
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
                </Grid>
              </Fragment>
            }
            {
              filterItems('nfts').length === 0 &&
              <Grid container direction="column" alignItems="center">
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>NFTs Coming Soon</Typography>
                <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
              </Grid>
            }
          </TabPanel>
          <TabPanel id='raffles-panel' value={value} index={3}>
              {
                filterItems('raffles').length > 0 &&
                <Fragment>
                  <Grid item xl={12}>
                    <Typography variant='subtitle1' color='secondary' pb={1}>
                      Purchase raffle tickets for community owned NFTs with $RIBBIT.
                      <br/>Each ticket is a 10% chance of winning a random community owned NFT.
                    </Typography>
                  </Grid>
                  <Grid id='raffles' container item xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      filterItems('raffles').map((raffle, index) => {
                        return <Grid key={index} item xl={2} lg={2} md={3} sm={4} xs={12} p={2} minHeight={450}>
                                <Card className={isItemDisabled(raffle) ? "disabled" : ""}>
                                  <CardHeader title={raffle.name} titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}/>
                                  <CardMedia component='img' image={raffle.image} alt='Raffle'/>
                                  <CardContent>
                                    <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(raffle)}</Typography>
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
                  </Grid>
                </Fragment>
              }
              {
                filterItems('raffles').length === 0 && 
                <Grid container direction="column" alignItems="center">
                  <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Raffles Coming Soon</Typography>
                  <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
                </Grid>
              }
          </TabPanel>
          <TabPanel id='allowlists-panel' value={value} index={4}>
            {
              filterItems('allowlists').length > 0 &&
              <Fragment>
                <Grid item xl={12}>
                <Typography variant='subtitle1' color='secondary' pb={1}>
                  Purchase instant allowlist spots gifted to our community.<br/>
                  NFA, DYOR. Allowlists listed are not endorsements of projects. 
                </Typography>
                </Grid>
                <Grid id='allowlists' container item xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
                    {
                      filterItems('allowlists').map((allowlist, index) => {
                        return <Grid key={index} item xl={2.5} lg={2.5} md={3.5} sm={5} xs={12} p={2} minHeight={500}>
                          <Card className={isItemDisabled(allowlist) ? "disabled" : ""}>
                            <CardHeader titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}
                              title={
                                <Grid item display='flex' justifyContent='center'>
                                  <Typography>{allowlist.name}</Typography>
                                  <Grid item display={allowlist.twitter ? "flex" : "none"} pl={2}>
                                    <Link href={allowlist.twitter} target='_blank'>
                                      <img src={twitter} style={{height: 20, width: 20}} alt='twitter'/>
                                    </Link>
                                  </Grid>
                                  <Grid item display={allowlist.discord ? "flex" : "none"} pl={1}>
                                    <Link href={allowlist.discord} target="_blank">
                                      <img src={discord} style={{height: 20, width: 20}} alt='discord'/>
                                    </Link>
                                  </Grid>
                                </Grid>
                              }
                            />
                            <CardMedia component='img' image={allowlist.image} alt='Allowlist'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{allowlist.description}</Typography>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(allowlist)}</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(allowlist.price)}</Typography>
                              </Grid>
                              <Button variant='contained' color='success' onClick={() => onBuyItem(allowlist)} disabled={isItemDisabled(allowlist)}>
                                <AddShoppingCartIcon/>
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      })
                    }
                </Grid>
              </Fragment>
            }
            {
              filterItems('allowlists').length === 0 && 
              <Grid container direction="column" alignItems="center">
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Allowlists Coming Soon</Typography>
                <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
              </Grid>
            }
          </TabPanel>
          <TabPanel id='merch-panel' value={value} index={5}>
            {
              filterItems('merch').length > 0 &&
              <Fragment>
                <Grid item xl={12}>
                <Typography variant='subtitle1' color='secondary' pb={1}>
                  Purchase marketplace exclusive Froggy Friends merch.
                </Typography>
              </Grid>
              <Grid id='merch' container item xl={9} lg={12} md={12} sm={12} xs={12} ml={-2}>
                  {
                    filterItems('merch').map((merch, index) => {
                      return <Grid key={index} item xl={3} lg={3} md={4} sm={5} xs={12} p={2} minHeight={450}>
                        <Card className={isItemDisabled(merch) ? "disabled" : ""}>
                          <CardHeader title={merch.name} titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}/>
                          <CardMedia component='img' image={merch.image} alt='Merch'/>
                          <CardContent>
                            <Typography variant='subtitle1' color='secondary' pb={1}>{getItemTitle(merch)}</Typography>
                            <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                              <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                              <Typography>{commify(merch.price)}</Typography>
                            </Grid>
                            <Button variant='contained' color='success' onClick={() => onBuyItem(merch)} disabled={isItemDisabled(merch)}>
                              <AddShoppingCartIcon/>
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    })
                  }
                </Grid>
              </Fragment>
            }
            {
              filterItems('merch').length === 0 && 
              <Grid container direction="column" alignItems="center">
                <Typography variant='h4' color='secondary' fontWeight='bold' pb={5}>Merch Coming Soon</Typography>
                <img src={biz} alt="Coming Soon" style={{height: 200, width: 200}}/>
              </Grid>
            }
          </TabPanel>
        </Grid>
      </Grid>
      <Modal open={showPurchaseModal} onClose={onPurchaseModalClose} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            {
              !isSpendingApproved && 
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <Typography id='modal-title' variant="h4" p={3}>Granting Permissions...</Typography>
              </Grid>
            }
            {
              isSpendingApproved && 
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                { collabBuyState.status === "None" && <Typography id='modal-title' variant="h4" p={3}>Sign Purchase</Typography>}
                { collabBuyState.status === "PendingSignature" && <Typography id='modal-title' variant="h4" p={3}>Sign Purchase</Typography>}
                { collabBuyState.status === "Mining" && <Typography id='modal-title' variant="h4" p={3}>Purchase Pending</Typography>}
                { collabBuyState.status === "Success" && <Typography id='modal-title' variant="h4" p={3}>Ribbit Items Purchased!</Typography>}
                { collabBuyState.status === "Fail" && <Typography id='modal-title' variant="h4" p={3}>Purchase Failed</Typography>}
                { collabBuyState.status === "Exception" && <Typography id='modal-title' variant="h4" p={3}>Purchase Failed</Typography>}
              </Grid>
            }
            <Grid item textAlign='center' xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onPurchaseModalClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' p={3}>
            <Grid item>
              { collabBuyState.status === "Success" && <img src={hype} style={{height: 100, width: 100}} alt='hype'/> }
              { collabBuyState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { collabBuyState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Grid>
          </Grid>
          {
            !isSpendingApproved && 
            <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${approveSpenderState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
              <Typography id='modal-description' variant="h6" p={3}>
                Grant Ribbit Prime Permissions {approveSpenderState.status === "Success" && <Check/>} {approveSpenderState.status === "Fail" && <Warning/>}
              </Typography>
            </Link>
          }
          {
            isSpendingApproved && 
            <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${collabBuyState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
              <Typography id='modal-description' variant="h6" p={3}>
                Purchase transaction {collabBuyState.status === "Success" && <Check/>} {collabBuyState.status === "Fail" && <Warning/>}
              </Typography>
            </Link>
          }
          { (approveSpenderState.status === "Mining" || collabBuyState.status === "Mining") && <LinearProgress  sx={{margin: 2}}/>}
        </Box>
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
      <Modal open={loadingItems} onClose={onLoadingItemsClose} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h4" p={3}>Loading Ribbit Items</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onLoadingItemsClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' pb={3}>
            <Grid item>
              <img src={please} style={{height: 100, width: 100}} alt='please'/>
            </Grid>
          </Grid>
          <LinearProgress variant='indeterminate' color='info'/>
        </Box>
      </Modal>
    </Grid>
  )
}