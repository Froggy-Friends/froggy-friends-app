import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles, createStyles } from '@mui/styles';
import { ArrowBack, Check, Close, ConfirmationNumber, Search, Warning } from "@mui/icons-material";
import {  Button, Chip, Container, Grid, IconButton, Link, Snackbar, SnackbarContent, Stack, TextField, Typography, useMediaQuery, useTheme, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Skeleton, Modal, Box, LinearProgress, Theme } from "@mui/material";
import { RibbitItem } from "../models/RibbitItem";
import { useAppDispatch } from "../redux/hooks";
import { add } from '../redux/cartSlice';
import axios from "axios";
import ribbitToken from '../images/ribbit.gif';
import twitter from '../images/twitter.svg';
import discord from '../images/discord.svg';
import opensea from '../images/opensea.svg';
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';
import useDebounce from '../hooks/useDebounce';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { useEthers } from "@usedapp/core";
import { useApproveSpender, useCollabBuy, useSpendingApproved } from "../client";
import { kFormatter } from "../utils";
import { Trait } from "../models/Trait";
const {REACT_APP_RIBBIT_ITEM_CONTRACT} = process.env;

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    itemImage: {
        height: 370,
        width: 370,
        [theme.breakpoints.down('xl')]: {
            height: 320,
            width: 320,
        },
        [theme.breakpoints.down('md')]: {
            height: 250,
            width: 250,
        }
    },
    row: {
      padding: 0,
      border: 0,
      '& td, th': {
        padding: '1rem 0',
        border: 0
      },

      '& th, h5': {
        fontWeight: 'bold'
      }
    },
    modal: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.secondary.main,
        borderRadius: 5,
        padding: theme.spacing(3),
        minHeight: 500, 
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
          height: '100%',
          width: '100%'
        }
      }
  })
);

export default function ItemDetails() {
    const classes = useStyles();
    const theme = useTheme();
    const { account } = useEthers();
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useAppDispatch();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const [item, setItem] = useState<RibbitItem>();
    const [alertMessage, setAlertMessage] = useState<any>(undefined);
    const [showAlert, setShowAlert] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showRaffleTickets, setShowRaffleTickets] = useState(false);
    const [itemOwners, setItemOwners] = useState<string[]>([]);
    const [filteredItemOwners, setFilteredItemOwners] = useState<string[]>([]);
    const [tickets, setTickets] = useState('');
    const [search, setSearch] = useState('');
    const [raffleTickets, setRaffleTickets] = useState<string[]>([]); // all purchased raffle tickets
    const [compatibleTraits, setCompatibleTraits] = useState<Trait[]>([]);
    const debouncedSearch = useDebounce(search, 500);
    const debouncedTickets = useDebounce(tickets, 500);
    const isSpendingApproved = useSpendingApproved(`${account}`);
    const { collabBuy, collabBuyState } = useCollabBuy();
    const { approveSpender, approveSpenderState } = useApproveSpender();

    useEffect(() => {
        getItem(`${params.id}`);
        scroll();
    }, [params]);

    useEffect(() => {
        const filtered = filterItems(itemOwners, debouncedSearch);
        setFilteredItemOwners(filtered);
   }, [debouncedSearch])

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
        async function getCompatibleTraits(traitId: number) {
            try {
                const response = await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/compatible/${traitId}`);
                console.log("comp traits: ", response.data);
                setCompatibleTraits(response.data);
            } catch (error) {
                console.log("get compatible traits error: ", error);
                setCompatibleTraits([]);
            }
        }

        if (item && item.isTrait && item.traitId) {
            getCompatibleTraits(item.traitId);
        }
    }, [item]);

    async function getItem(id: string) {
        try {
          const response = await axios.get<RibbitItem>(`${process.env.REACT_APP_API}/items/${id}/details`);
          let item = response.data;
          item.endDate = +item.endDate; // string value breaks getEndDate() function must cast to number
          setItem(item);
          getItemOwners(item.id, item.name);
        } catch (error) {
          setAlertMessage("Failed to get items");
          setShowAlert(true);
        }
    }

    const getItemOwners = async (id: number, name: string) => {
        const response = await axios.get<string[]>(`${process.env.REACT_APP_API}/items/${id}/owners`);
        setItemOwners(response.data);
        const filtered = filterItems(response.data, debouncedSearch);
        setFilteredItemOwners(filtered);
    }

    const filterItems = (owners: string[], debouncedSearch: string): string[] => {
        return owners.filter(owner => {
          if (debouncedSearch && owner.toLowerCase().includes(debouncedSearch.toLowerCase()) === false) {
            return false;
          }
          
          return true;
        });
    }

    const getAvailable = (item: RibbitItem) => {
        return `${item.supply - item.minted} / ${item.supply} Available`;
    }

    const getEndDate = (item: RibbitItem) => {
        if (item.endDate <= 0) return '';

        const endDate = new Date(item.endDate);
        const result = formatDistanceToNow(endDate, { addSuffix: true, includeSeconds: true});
        return `Raffle close ${result}`;
    }

    const getAddToCartDisabled = (item: RibbitItem) => {
        return item.category === 'raffles' && +debouncedTickets < 1;
    }

    const scroll = () => {
        const itemDetails = document.querySelector('#item-details');
        itemDetails?.scrollIntoView({ behavior: 'smooth'});
    }

    const onItemDetailsClose = () => {
        navigate(-1);
    }

    const onPurchaseModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason !== 'backdropClick') {
          setShowPurchaseModal(false);
        }
    }

    const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowAlert(false);
    };

    const onBuyItem = (item: RibbitItem) => {
        const itemWithAmount: RibbitItem = {
            ...item, 
            amount: item.category === 'raffles' ? +debouncedTickets : 1
        };
        dispatch(add(itemWithAmount));
        setAlertMessage('Added item to your cart!');
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

    const onTicketsEntered = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTickets(event.target.value.replace(/\D/,''));
    };

    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      };
    
    const onRaffleTicketsClicked = async (event: any) => {
        // load raffle tickets
        const tickets = (await axios.get<string[]>(`${process.env.REACT_APP_API}/items/${item?.id}/tickets`)).data;
        setRaffleTickets(tickets);
        setShowRaffleTickets(true);
    }

    const onRaffleTicketsClosed = (event: any) => {
        setRaffleTickets([]);
        setShowRaffleTickets(false);
    }

    return (
        <Grid id='item-details' container direction='column' bgcolor={theme.palette.background.default} pt={20} pb={20}>
            <Container maxWidth='lg'>
                <Grid id='top-row' container justifyContent='space-between' pb={10}>
                    <Grid id='image' container item justifyContent='center' xl={4} lg={4} md={4} sm={4} xs={12} pb={isXs ? 5 : 0}>
                        {
                            item ? (
                                <img className={classes.itemImage} src={item.image} alt='' style={{borderRadius: 5}}/>
                            ) : (
                                <Skeleton variant='rectangular' animation='wave' height={400}/>
                            )
                        }
                    </Grid>
                    <Grid id='info' container item direction='column' justifyContent='space-between' xl={7} lg={7} md={7} sm={7} xs={12}>
                        <Grid id='title-and-exit' container justifyContent='space-between' alignItems='center' pb={3}>
                            {
                                item ? (
                                    <Typography variant='h5' fontWeight='bold'>{item.name}</Typography>
                                ) : (
                                    <Skeleton variant='text' animation='wave' height={35} width={200}/>
                                )
                            }
                            
                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                <IconButton className="cta" size={isXs ? 'medium' : 'large'} onClick={onItemDetailsClose}>   
                                    <ArrowBack/>
                                </IconButton>
                            </Paper>
                        </Grid>
                        {
                            item && item.isOnSale && item.minted !== item.supply &&
                            <Grid id='available' container pb={3}>
                                {
                                    !isBefore(new Date(+item.endDate), new Date()) && <Typography pr={isXs ? 3 : 5}>{getAvailable(item)}</Typography>
                                }
                                {
                                    item.category === 'raffles' && <Typography>{getEndDate(item)}</Typography>
                                }
                            </Grid>
                        }
                        <Grid id='price-and-socials' container pb={3}> 
                            <Grid id='price' item xl={2} lg={2} md={2} sm={3} xs={4}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Price</Typography>
                                    <Typography display='flex' alignItems='center'> 
                                        <img src={ribbitToken} alt='' style={{height: 30, width: 30}}/>
                                        {kFormatter(item?.price || 0)}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid id='socials' item xl={2} lg={2} md={2} sm={2} xs={2}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Socials</Typography>
                                    <Stack direction='row' spacing={2}>
                                        {
                                            item?.twitter &&
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href={item.twitter} target='_blank'>
                                                    <img src={twitter} alt='' style={{height: 20, width: 20}}/>
                                                </IconButton>
                                            </Paper>
                                        }
                                        {
                                            item?.discord && 
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href={item.discord} target='_blank'>
                                                    <img src={discord} alt='' style={{height: 20, width: 20}}/>
                                                </IconButton>
                                            </Paper>
                                        }
                                        <Paper elevation={3} sx={{borderRadius: 25}}>
                                            <IconButton className="cta" href={`https://opensea.io/assets/ethereum/${REACT_APP_RIBBIT_ITEM_CONTRACT}/${item?.id}`} target='_blank'>
                                                <img src={opensea} alt='' style={{height: 20, width: 20}}/>
                                            </IconButton>
                                        </Paper>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack spacing={1} pb={5}>
                            <Typography fontWeight='bold'>Description</Typography>
                            <Typography>{item?.description}</Typography>
                        </Stack>
                        {
                            item && !item.collabId && item.isOnSale && item.minted !== item.supply &&
                            <Grid id='buttons' container alignItems='end'>
                                <Button variant='contained' sx={{height: 50}} onClick={() => onBuyItem(item)} disabled={getAddToCartDisabled(item)}>
                                    <Typography>Add to cart</Typography>
                                </Button>
                                {
                                    item.category === 'raffles' && !isBefore(new Date(+item.endDate), new Date()) &&
                                    <TextField placeholder="Number of tickets" value={tickets} onChange={onTicketsEntered} sx={{pl: 5, width: 230}}/>
                                }
                            </Grid>
                        }
                        {
                            item && item.isCollabFriend &&
                            <Grid id='buttons' container alignItems='end'>
                                <Button variant='contained' sx={{height: 50}} onClick={() => onBuyCollabItem(item)}>
                                    <Typography>Buy Now</Typography>
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </Grid>
                <Grid id='bottom-row' container justifyContent='space-between'>
                    <Grid id='tags' item xl={4} lg={4} md={4} sm={12} xs={12} pb={10}>
                        <Stack spacing={1} alignItems={isXs ? 'center' : 'left'}>
                            <Typography fontWeight='bold'>Tags</Typography>
                            {
                                item && 
                                <Grid container justifyContent={isXs ? 'center' : 'left'} spacing={2}>
                                    <Grid item ml={-2}><Chip label={item.category}/></Grid>
                                    <Grid item><Chip label={item.isOnSale && item.minted !== item.supply ? 'On Sale' : 'Off Sale'}/></Grid>
                                    { item.isBoost && <Grid item><Chip label={`${item.percent}% Boost`}/></Grid>}
                                    { item.isCommunity && <Grid item><Chip label='Community'/></Grid>}
                                    <Grid item><Chip label={item.rarity}/></Grid>
                                </Grid>
                            }
                        </Stack>
                    </Grid>
                    {
                        compatibleTraits.length > 0 &&
                        <Grid id='compatible-traits' item xl={7} lg={7} md={12} sm={12} xs={12}>
                            <Typography fontWeight='bold' display='flex' justifyContent={isXs ? 'center' : 'left'} pb={3}>Compatible Traits</Typography>
                            <Grid container justifyContent={isXs ? 'center' : 'start'} spacing={2}>
                                {
                                    compatibleTraits.map((trait, index) => (
                                        <Grid key={index} item display='flex' flexDirection='column' alignItems='center' spacing={2} pb={5} xl={4}>
                                            <img src={trait.imageTransparent} alt='' width={200} style={{borderRadius: 5, backgroundColor: '#93d0aa'}}/>
                                            <Typography p={3}>{trait.name}</Typography>
                                            <Chip label={trait.layer}/>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Grid>
                    }
                    {
                        itemOwners.length > 0 && 
                        <Grid id='owners' item xl={7} lg={7} md={7} sm={12} xs={12}>
                            <Stack spacing={3}>
                                <Stack direction={isXs ? 'column' : 'row'} justifyContent='space-between'>
                                    <Typography fontWeight='bold' pb={3}>Item Owners</Typography>
                                    <Stack direction='row' alignItems='center' spacing={3}>
                                        {
                                            item?.category === 'raffles' &&
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" onClick={onRaffleTicketsClicked}>
                                                    <ConfirmationNumber/>
                                                </IconButton>
                                            </Paper>
                                        }
                                        <TextField placeholder='Search by wallet' value={search} onChange={onSearch} InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}/>
                                    </Stack>
                                </Stack>
                                <TableContainer component={Paper} elevation={0} sx={{height: isXs ? 500 : 350}}>
                                    <Table stickyHeader aria-label="simple table">
                                        <TableBody>
                                        {filteredItemOwners.map((owner, index) => (
                                            <TableRow key={index} className={classes.row}>
                                            <TableCell>
                                                <Typography variant='h6' color='secondary'>{owner}</Typography>
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                            </Stack>
                        </Grid>
                    }
                </Grid>
            </Container>
            <Snackbar open={showAlert}  autoHideDuration={5000} message={alertMessage} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={onAlertClose}>
                <SnackbarContent message={alertMessage} action={
                    <IconButton size='small' aria-label='close' color='inherit' onClick={onAlertClose}><Close fontSize='small' /></IconButton>
                }/>
            </Snackbar>
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
            <Modal open={showRaffleTickets} onClose={onRaffleTicketsClosed} keepMounted>
                <Box className={classes.modal}>
                    <Stack spacing={3}>
                        <Stack direction='row' justifyContent='space-between' spacing={2}>
                            <Typography variant='h4'>{item?.name} Tickets</Typography>
                            <IconButton className="cta" size={isXs ? 'large' : 'medium'} color='inherit' onClick={onRaffleTicketsClosed}>
                                <Close fontSize={isXs ? 'large' : 'medium'}/>
                            </IconButton>
                        </Stack>
                        <Typography variant='subtitle1'>{raffleTickets.length} total tickets</Typography>
                        <TableContainer component={Paper} elevation={0} sx={{height: isXs ? 500 : 350}}>
                            <Table stickyHeader aria-label="simple table">
                                <TableBody>
                                {raffleTickets.map((ticket, index) => (
                                    <TableRow key={index} className={classes.row}>
                                    <TableCell>
                                        <Typography color='secondary'>{ticket}</Typography>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Box>
            </Modal>
        </Grid>

    )
}