import React, { useEffect, useState, ChangeEvent } from 'react';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Typography, Checkbox, Modal, Box, IconButton, Snackbar, useMediaQuery, useTheme, TextField, SnackbarContent, Paper, Container, Switch, Select, MenuItem, SelectChangeEvent, Skeleton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { RibbitItem } from '../models/RibbitItem';
import { useEthers } from '@usedapp/core';
import { Close, ExpandMore, FilterList, Refresh, Search } from '@mui/icons-material';
import axios from 'axios';
import market from '../images/market.png';
import Item from '../components/Item';
import useDebounce from '../hooks/useDebounce';
const { REACT_APP_RIBBIT_ITEM_CONTRACT } = process.env;

type SortCriteria = 'low-high' | 'high-low';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    market: {
      backgroundColor: theme.palette.background.default
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
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isDown425 = useMediaQuery(theme.breakpoints.down(425));
  const [sort, setSort] = useState<SortCriteria>('low-high');
  const [items, setItems] = useState<RibbitItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [filteredItems, setFilteredItems] = useState<RibbitItem[]>([]);
  const [filterAvailable, setFilterAvailable] = useState<boolean>(true);
  const [filterCommunity, setFilterCommunity] = useState<boolean>(false);
  const [filterOwned, setFilterOwned] = useState<boolean>(false);
  const [filterGLP, setFilterGLP] = useState<boolean>(true);
  const [filterFriends, setFilterFriends] = useState<boolean>(true);
  const [filterCollabFriends, setFilterCollabFriends] = useState<boolean>(true);
  const [filterAllowlists, setFilterAllowlists] = useState<boolean>(true);
  const [filterNfts, setFilterNfts] = useState<boolean>(true);
  const [filterRaffles, setFilterRaffles] = useState<boolean>(true);
  const [filterMerch, setFilterMerch] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [itemOwners, setItemOwners] = useState<string[]>([]);
  const [itemName, setItemName] = useState<string>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { account } = useEthers();
  

  useEffect(() => {
    getItems();
    if (account) {
      getOwnedNfts();
    }
  }, [account])

  useEffect(() => {
    const filtered = filterItems(items, debouncedSearch);
    const filteredAndSorted = sortItems(filtered, sort);
    setFilteredItems(filteredAndSorted);
  }, [
    filterAvailable, 
    filterCommunity, 
    filterOwned,
    filterGLP,
    filterFriends,
    filterCollabFriends,
    filterAllowlists,
    filterNfts,
    filterRaffles,
    filterMerch,
    debouncedSearch,
    sort
  ])

  async function getItems() {
    try {
      setLoadingItems(true);
      const response = await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items/contract`);
      let items = response.data;
      setItems(items);
      setLoadingItems(false);
      const filtered = filterItems(items, debouncedSearch);
      const filteredAndSorted = sortItems(filtered, sort);
      setFilteredItems(filteredAndSorted);
    } catch (error) {
      setLoadingItems(false);
      setAlertMessage("Failed to get items");
      setShowAlert(true);
    }
  }

  async function getOwnedNfts() {
    try {
      const url = `${process.env.REACT_APP_API}/owned/nfts/`;
      const body = { account: account, contract: REACT_APP_RIBBIT_ITEM_CONTRACT };
      const nfts = (await axios.post(url, body)).data;
      setOwnedNfts(nfts);
    } catch (error) {
      console.log("get owned nfts error: ", error);
      setOwnedNfts([]);
    }
  }

  const onItemRefresh = () => {
    setItems([]);
    getItems();
  }

  const filterItems = (items: RibbitItem[], debouncedSearch: string): RibbitItem[] => {
    return items.filter(item => {
      if (debouncedSearch && item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) === false) {
        return false;
      }
      if (filterAvailable && (!item.isOnSale || item.minted === item.supply)) return false;
      if (filterCommunity && !item.community) return false;
      if (filterOwned && !ownedNfts.find((nft: any) => +nft.tokenId == item.id)) return false;
      if (!filterGLP && item.category == 'lilies') return false;
      if (!filterFriends && item.category == 'friends') return false;
      if (!filterCollabFriends && item.category == 'collabs') return false;
      if (!filterAllowlists && item.category == 'allowlists') return false;
      if (!filterNfts && item.category == 'nfts') return false;
      if (!filterRaffles && item.category == 'raffles') return false;
      if (!filterMerch && item.category == 'merch') return false;
      return true;
    });
  }

  const sortItems = (items: RibbitItem[], criteria: SortCriteria): RibbitItem[] => {
    return items.sort((a,b) => {
      if (criteria === 'low-high') {
        return a.price - b.price;
      } else if (criteria === 'high-low') {
        return b.price - a.price;
      }

      return -1;
    })
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

  const onSortSelect = (event: SelectChangeEvent) => {
    setSort(event.target.value as SortCriteria);
  }

  const availableFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterAvailable(event.target.checked);
  };

  const communityFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterCommunity(event.target.checked);
  };

  const ownedFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterOwned(event.target.checked);
  };

  const glpFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterGLP(event.target.checked);
  }
  const friendsFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterFriends(event.target.checked);
  }
  const collabFriendsFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterCollabFriends(event.target.checked);
  }
  const allowlistsFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterAllowlists(event.target.checked);
  }
  const nftsFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterNfts(event.target.checked);
  }
  const rafflesFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterRaffles(event.target.checked);
  }
  const merchFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterMerch(event.target.checked);
  }

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Grid id="market" className={classes.market} container direction="column" justifyContent="start">
      <Paper elevation={3}>
        <Grid id='banner' container sx={{backgroundImage: `url(${market})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 600}}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Grid container>
          {
            !isSm && 
            <Grid id='left-panel' container item direction='column' xl={2} lg={2} md={2} sm={12} xs={12}>
              <Grid id='filter-title' container pb={5} alignItems='center'>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='h5' fontWeight='bold'>Filter</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><FilterList/></Grid>
              </Grid>
              <Grid id='available' container pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Available</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Switch checked={filterAvailable} onChange={availableFilterChanged}/></Grid>
              </Grid>
              <Grid id='community' container pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Community</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Switch checked={filterCommunity} onChange={communityFilterChanged}/></Grid>
              </Grid>
              <Grid id='owned' container pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Owned</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Switch checked={filterOwned} disabled={ownedNfts.length === 0} onChange={ownedFilterChanged}/></Grid>
              </Grid>
              <Grid id='categories-title' container pt={5} pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='h6' fontWeight='bold'>Categories</Typography></Grid>
              </Grid>
              <Grid id='glp' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Golden Lily Pad</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterGLP} onChange={glpFilterChanged}/></Grid>
              </Grid>
              <Grid id='friends' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Friends</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterFriends} onChange={friendsFilterChanged}/></Grid>
              </Grid>
              <Grid id='collab-friends' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Collab Friends</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterCollabFriends} onChange={collabFriendsFilterChanged}/></Grid>
              </Grid>
              <Grid id='allowlist' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Allowlists</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterAllowlists} onChange={allowlistsFilterChanged}/></Grid>
              </Grid>
              <Grid id='nfts' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>NFTs</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterNfts} onChange={nftsFilterChanged}/></Grid>
              </Grid>
              <Grid id='raffles' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Raffles</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterRaffles} onChange={rafflesFilterChanged}/></Grid>
              </Grid>
              <Grid id='merch' container alignItems='center' pb={3}>
                <Grid id='filter' item xl={6} lg={6} md={6}><Typography variant='body1'>Merch</Typography></Grid>
                <Grid id='filter-icon' item xl={6} lg={6} md={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterMerch} onChange={merchFilterChanged}/></Grid>
              </Grid>
            </Grid>
          }
          {
            isSm &&
            <Accordion sx={{width: '100%', mb: 5}}>
              <AccordionSummary expandIcon={<ExpandMore/>}>
                <Typography variant='h6' fontWeight='bold'>All Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid id='left-panel' container item direction='column' sm={12} xs={12}>
                  <Grid id='filter-title' container pb={5} alignItems='center'>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='h5' fontWeight='bold'>Filter</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><FilterList/></Grid>
                  </Grid>
                  <Grid id='available' container pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Available</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Switch checked={filterAvailable} onChange={availableFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='community' container pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Community</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Switch checked={filterCommunity} onChange={communityFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='owned' container pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Owned</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Switch checked={filterOwned} onChange={ownedFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='categories-title' container pt={5} pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='h6' fontWeight='bold'>Categories</Typography></Grid>
                  </Grid>
                  <Grid id='glp' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Golden Lily Pad</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterGLP} onChange={glpFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='friends' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Friends</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterFriends} onChange={friendsFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='collab-friends' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Collab Friends</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterCollabFriends} onChange={collabFriendsFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='allowlist' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Allowlists</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterAllowlists} onChange={allowlistsFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='nfts' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>NFTs</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterNfts} onChange={nftsFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='raffles' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Raffles</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterRaffles} onChange={rafflesFilterChanged}/></Grid>
                  </Grid>
                  <Grid id='merch' container alignItems='center' pb={3}>
                    <Grid id='filter' item sm={3} xs={6}><Typography variant='body1'>Merch</Typography></Grid>
                    <Grid id='filter-icon' item sm={3} xs={6} display='flex' justifyContent='center'><Checkbox color='primary' checked={filterMerch} onChange={merchFilterChanged}/></Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          }
          <Grid id='search-and-items' container item direction='column' xl={10} lg={10} md={10} sm={12} xs={12}>
            <Grid id='controls' container item justifyContent='end' alignItems='center' pb={5}>
              <Grid id='refresh' container item xl={1} lg={1} md={2} sm={3} xs={12} pb={2}>
                <IconButton onClick={onItemRefresh}>
                  <Refresh fontSize='large'/>
                </IconButton>
              </Grid>
              <Grid id='sort' item xl={2} lg={2} md={3} sm={4} xs={12} pb={2}>
                <Select value={sort} onChange={onSortSelect}>
                  <MenuItem value='low-high' color='secondary'>Price: Low to High</MenuItem>
                  <MenuItem value='high-low'>Price: High to Low</MenuItem>
                </Select>
              </Grid>
              <Grid id='search' item xl={4} lg={4} md={5} sm={5} xs={12} pb={2}>
                <TextField placeholder='Search items by name' fullWidth 
                  InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}
                  value={search} onChange={onSearch}
                />
              </Grid>
            </Grid>
            <Grid id='items' container item>
              {
                !items.length && 
                new Array(20).fill('').map((item, index) => {
                  return <Grid key={index} item xl={2.4} lg={2.4} md={3} sm={6} xs={isDown425 ? 12 : 6} pl={2} pb={2}>
                    <Skeleton variant='rectangular' animation='wave' height={300}/>  
                  </Grid>
                })
              }
              {
                filteredItems.length > 0 &&
                filteredItems.map((item: RibbitItem) => {
                  return <Grid key={item.name} item xl={2.4} lg={2.4} md={3} sm={4} xs={isDown425 ? 12 : 6} pl={2} pb={2}>
                    <Item item={item} selected={false}/>
                  </Grid>
                })
              }
              {
                loadingItems === false && filteredItems.length === 0 &&
                <Typography variant='h6' pl={isXs ? 2 : 5}>No items found matching the selected filters try removing filters to see results.</Typography>
              }
          </Grid>
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={showAlert} autoHideDuration={5000} message={alertMessage} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={onAlertClose}>
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