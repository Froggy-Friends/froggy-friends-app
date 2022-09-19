import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Typography, Tab, Tabs, ToggleButton, ToggleButtonGroup, Button, Card, CardContent, CardMedia, CardHeader, Chip, LinearProgress, Modal, Box, IconButton, Link, Snackbar, useMediaQuery, useTheme, Tooltip, TextField, InputAdornment, SnackbarContent, Paper, Container, Switch, FormControl, Select, MenuItem, SelectChangeEvent, getListItemUtilityClass, Skeleton } from "@mui/material";
import { RibbitItem } from '../models/RibbitItem';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { commify, formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import { useApproveSpender, useCollabBuy, useSpendingApproved } from '../client';
import { useAppDispatch, } from '../redux/hooks';
import { add } from '../redux/cartSlice';
import { AddCircle, Check, CheckBox, Close, FilterList, InfoOutlined, Receipt, Refresh, RemoveCircle, Search, Warning } from '@mui/icons-material';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ribbit from '../images/ribbit.gif';
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import market from '../images/market.png';
import Item from '../components/Item';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    market: {
      backgroundColor: theme.palette.background.default
    },
    cardMedia: {
      position: 'relative',
    },
    community: {
      position: 'absolute',
      top: 0,
      backgroundColor: '#ebca27',
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1)
    },
    cardMediaImage: {
      display: 'block',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      objectFit: 'cover',
      minHeight: 300,
      maxHeight: 300
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: theme.palette.background.default,
      border: '0px',
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    },
    cartAddAlert: {
      backgroundColor: '#5ea14e'
    }
  })
);


export default function Market() {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(4);
  const [sort, setSort] = useState('low-price');
  const [items, setItems] = useState<RibbitItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RibbitItem[]>([]);
  const [filterAvailable, setFilterAvailable] = useState<boolean>(false);
  const [filterCommunity, setFilterCommunity] = useState<boolean>(false);
  const [filterOwned, setFilterOwned] = useState<boolean>(false);
  const [itemAmounts, setItemAmounts] = useState(new Map<number,number>());
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [itemOwners, setItemOwners] = useState<string[]>([]);
  const [itemName, setItemName] = useState<string>('');
  const { account } = useEthers();
  const { collabBuy, collabBuyState } = useCollabBuy();
  const { approveSpender, approveSpenderState } = useApproveSpender();
  const isSpendingApproved = useSpendingApproved(account ?? '');
  const ribbitBalance: BigNumber | undefined = useTokenBalance(process.env.REACT_APP_RIBBIT_CONTRACT, account);
  const maxItemAmounts = 1000;

  useEffect(() => {
    getItems();
  }, [])

  useEffect(() => {
    setFilteredItems(filterItems(items));
  }, [filterAvailable])

  async function getItems() {
    try {
      const response = await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/contract`);
      let items = response.data;
      setItems(items);
      setItemAmounts(new Map(items.map(item => [item.id, 0])));
      setFilteredItems(filterItems(items));
    } catch (error) {
      setAlertMessage("Failed to get items");
      setShowAlert(true);
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

  const onItemRefresh = () => {
    setItems([]);
    getItems();
  }

  const filterItems = (items: RibbitItem[]): RibbitItem[] => {
    return items.filter(item => {
      
      if (filterAvailable && (!item.isOnSale || item.minted === item.supply)) {
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

    if (item.category === 'raffles' && item.endDate) {
      return "Ends in " + formatDistance(new Date(), new Date(item.endDate));
    }

    return `${item.supply - item.minted} / ${item.supply} Available`;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const updateItemAmounts = (key: number, value: number) => {
    setItemAmounts(map => new Map(map.set(key, value)));
  }

  const onRaffleTicketChange = (event: Event, amount: number | number[], item: RibbitItem) => {
    updateItemAmounts(item.id, amount as number);
  }

  const onBuyItem = (item: RibbitItem) => {
    const ribbitItem = {...item};
    ribbitItem.amount = itemAmounts.get(ribbitItem.id) || 1;
    dispatch(add(ribbitItem));
    updateItemAmounts(ribbitItem.id, 0);
    setAlertMessage(`Added ${ribbitItem.amount} item(s) to your cart!`);
    setShowAlert(true);
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

  const onItemOwnersClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setItemOwners([]);
      setItemName('');
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

  const onTicketDecrement = (item: RibbitItem) => {
    const value = itemAmounts.get(item.id) || 0;
    if (value === 0) {
      return;
    }
    updateItemAmounts(item.id, value-1);
  }

  const onTicketIncrement = (item: RibbitItem) => {
    const value = itemAmounts.get(item.id) || 0;
    if (value === maxItemAmounts) {
      return;
    }
    updateItemAmounts(item.id, value+1);
  }

  const onItemAmountsChange = (event: React.ChangeEvent<HTMLInputElement>, item: RibbitItem) => {
    const value = +event.target.value;
    if (isNaN(value) || value > maxItemAmounts) {
      return;
    }
    updateItemAmounts(item.id, value);
  }

  const onItemOwnersClick = async (id: number, name: string) => {
    const response = await axios.get<string[]>(`${process.env.REACT_APP_API}/items/${id}/owners`);
    setItemOwners(response.data);
    setItemName(name);
  }

  const onRaffleTicketsClick = async (id: number, name: string) => {
    const response = await axios.get<string[]>(`${process.env.REACT_APP_API}/items/${id}/tickets`);
    setItemOwners(response.data);
    setItemName(name);
  }

  const onSortSelect = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  }

  const availableFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAvailable(event.target.checked);
  };

  const communityFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCommunity(event.target.checked);
  };

  const ownedFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOwned(event.target.checked);
  };

  return (
    <Grid id="market" className={classes.market} container direction="column" justifyContent="start">
      <Paper elevation={3}>
        <Grid id='banner' container sx={{backgroundImage: `url(${market})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 600}}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Grid container>
          <Grid id='left-panel' container item direction='column' xl={2} lg={2} md={2} sm={12} xs={12}>
            <Grid id='filter-title' container pb={5} alignItems='center'>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='h5' fontWeight='bold'>Filter</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><FilterList/></Grid>
            </Grid>
            <Grid id='available' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Available</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><Switch checked={filterAvailable} onChange={availableFilterChanged}/></Grid>
            </Grid>
            <Grid id='community' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Community</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><Switch checked={filterCommunity} onChange={communityFilterChanged}/></Grid>
            </Grid>
            <Grid id='owned' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Owned</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><Switch checked={filterOwned} onChange={ownedFilterChanged}/></Grid>
            </Grid>
            <Grid id='categories-title' container pt={5} pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='h6' fontWeight='bold'>Categories</Typography></Grid>
            </Grid>
            <Grid id='glp' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Golden Lily Pad</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><CheckBox color='primary'/></Grid>
            </Grid>
            <Grid id='friends' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Friends</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><CheckBox color='primary'/></Grid>
            </Grid>
            <Grid id='allowlist' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Allowlists</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><CheckBox color='primary'/></Grid>
            </Grid>
            <Grid id='nfts' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>NFTs</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><CheckBox color='primary'/></Grid>
            </Grid>
            <Grid id='raffles' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Raffles</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><CheckBox color='primary'/></Grid>
            </Grid>
            <Grid id='merch' container pb={3}>
              <Grid id='filter' item xl={6} lg={6} md={6} sm={6} xs={6}><Typography variant='body1'>Merch</Typography></Grid>
              <Grid id='filter-icon' item xl={6} lg={6} md={6} sm={6} xs={6} display='flex' justifyContent='center'><CheckBox color='primary'/></Grid>
            </Grid>
          </Grid>
          <Grid id='search-and-items' container item direction='column' xl={10} lg={10} md={10} sm={12} xs={12}>
            <Grid id='controls' container item justifyContent='end' pb={5}>
              <Grid id='refresh' container item xl={1} lg={1} md={2} sm={3} xs={12} pb={2}>
                <IconButton sx={{height: 35}} onClick={onItemRefresh}>
                  <Refresh fontSize='large'/>
                </IconButton>
              </Grid>
              <Grid id='sort' item xl={2} lg={2} md={3} sm={4} xs={12} pb={2}>
                <Select value={sort} onChange={onSortSelect}>
                  <MenuItem value='low-price' color='secondary'>Price: Low to High</MenuItem>
                  <MenuItem value='high-price'>Price: High to Low</MenuItem>
                </Select>
              </Grid>
              <Grid id='search' item xl={4} lg={4} md={5} sm={5} xs={12} pb={2}>
                <TextField placeholder='Search items by name' fullWidth 
                  InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}
                />
              </Grid>
            </Grid>
            <Grid id='items' container item>
              {
                filteredItems.length > 0 ? 
                (
                  filteredItems.map((item: RibbitItem) => {
                    return <Grid key={item.name} item xl={2.4} lg={2.4} md={3} sm={6} xs={12} pl={2} pb={2}>
                      <Item item={item} selected={false}/>
                    </Grid>
                  })
                ) : (
                  new Array(20).fill('').map((item, index) => {
                    return <Grid key={index} item xl={2.4} lg={2.4} md={3} sm={6} xs={12} pl={2} pb={2}>
                      <Skeleton variant='rectangular' animation='wave' height={300}/>  
                    </Grid>
                  })
                )
              }
          </Grid>
          </Grid>
        </Grid>
      </Container>
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
                Grant Ribbit Market Permissions {approveSpenderState.status === "Success" && <Check/>} {approveSpenderState.status === "Fail" && <Warning/>}
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
        
      >
        <SnackbarContent 
          message={alertMessage}
          action={
            <IconButton size='small' aria-label='close' color='inherit' onClick={onAlertClose}>
              <Close fontSize='small' />
            </IconButton>
          }
        />
      </Snackbar>
      <Modal open={itemOwners.length > 0} onClose={onItemOwnersClose} keepMounted aria-labelledby='item-owners' aria-describedby='item-owners-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h5" p={3}>{itemName} Owners</Typography>
            </Grid>
            <Grid item display='flex' alignSelf='start' justifyContent='center' p={2} xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onItemOwnersClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid className="scrollable" container p={3} mb={2} maxHeight={350} sx={{overflowY: 'scroll'}}>
            {
              itemOwners.map(owner => {
                return <Typography variant='body1'>{owner}</Typography>
              })
            }
          </Grid>
        </Box>
      </Modal>
    </Grid>
  )
}