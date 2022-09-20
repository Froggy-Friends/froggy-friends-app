import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import { ArrowBack, Close, Search } from "@mui/icons-material";
import { createStyles, Button, Chip, Container, Grid, IconButton, Snackbar, SnackbarContent, Stack, TextField, Theme, Typography, useMediaQuery, useTheme, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Skeleton } from "@mui/material";
import { RibbitItem } from "../models/RibbitItem";
import axios from "axios";
import ribbitToken from '../images/ribbit.gif';
import twitter from '../images/twitter.svg';
import discord from '../images/discord.svg';
import opensea from '../images/opensea.svg';
const {REACT_APP_RIBBIT_ITEM_CONTRACT} = process.env;

const useStyles: any = makeStyles(() => 
  createStyles({
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
    }
  })
);

export default function ItemDetails() {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const params = useParams();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const [item, setItem] = useState<RibbitItem>();
    const [alertMessage, setAlertMessage] = useState<any>(undefined);
    const [showAlert, setShowAlert] = useState(false);
    const [itemOwners, setItemOwners] = useState<string[]>([]);

    useEffect(() => {
        getItem(`${params.id}`);
        scroll();
    }, [params]);

    async function getItem(id: string) {
        try {
          const response = await axios.get<RibbitItem>(`${process.env.REACT_APP_API}/items/${id}`);
          let item = response.data;
          setItem(item);

          if (item.category == 'allowlists') {
            getItemOwners(item.id, item.name);
          }
        } catch (error) {
          setAlertMessage("Failed to get items");
          setShowAlert(true);
        }
    }

    const getItemOwners = async (id: number, name: string) => {
        const response = await axios.get<string[]>(`${process.env.REACT_APP_API}/items/${id}/owners`);
        setItemOwners(response.data);
    }

    const scroll = () => {
        const itemDetails = document.querySelector('#item-details');
        itemDetails?.scrollIntoView({ behavior: 'smooth'});
    }

    const kFormatter = (num: number): string => {
        const fixed = ((Math.abs(num)/1000));
        const format = Math.abs(num) > 999 
        ?( Math.sign(num) * fixed).toFixed(0) + 'k' 
        : Math.sign(num) * Math.abs(num) + '';
        return format;
    }

    const onItemDetailsClose = () => {
        navigate(-1);
    }

    const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowAlert(false);
    };

    return (
        <Grid id='item-details' container direction='column' bgcolor={theme.palette.background.default} pt={20} pb={20}>
            <Container maxWidth='lg'>
                <Grid id='top-row' container justifyContent='space-between' pb={10}>
                    <Grid id='image' item xl={4} lg={4} md={4} sm={4} xs={12} pb={isXs ? 5 : 0}>
                        {
                            item ? (
                                <img src={item?.image} width='100%' style={{borderRadius: 5}}/>
                            ) : (
                                <Skeleton variant='rectangular' animation='wave' height={400}/>
                            )
                        }
                    </Grid>
                    <Grid id='info' container item direction='column' justifyContent='space-between' xl={7} lg={7} md={7} sm={7} xs={12}>
                        <Grid id='title-and-exit' container justifyContent='space-between' alignItems='center' pb={5}>
                            {
                                item ? (
                                    <Typography variant='h5' fontWeight='bold'>{item?.name}</Typography>
                                ) : (
                                    <Skeleton variant='text' animation='wave' height={35} width={200}/>
                                )
                            }
                            
                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                <IconButton className="cta" size="large" onClick={onItemDetailsClose}>   
                                    <ArrowBack/>
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid id='price-and-socials' container pb={5}> 
                            <Grid id='price' item xl={2} lg={2} md={2} sm={3} xs={4}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Price</Typography>
                                    <Typography display='flex' alignItems='center'> 
                                        <img src={ribbitToken} style={{height: 30, width: 30}} alt='Ribbit'/>
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
                                                    <img src={twitter} style={{height: 24, width: 24}}/>
                                                </IconButton>
                                            </Paper>
                                        }
                                        {
                                            item?.discord && 
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href={item.discord} target='_blank'>
                                                    <img src={discord} style={{height: 24, width: 24}}/>
                                                </IconButton>
                                            </Paper>
                                        }
                                        <Paper elevation={3} sx={{borderRadius: 25}}>
                                            <IconButton className="cta" href={`https://opensea.io/assets/ethereum/${REACT_APP_RIBBIT_ITEM_CONTRACT}/${item?.id}`} target='_blank'>
                                                <img src={opensea} style={{height: 24, width: 24}}/>
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
                        <Grid id='buttons' container>
                            <Button variant='contained' sx={{height: 50}}>
                                <Typography>Add to cart</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid id='bottom-row' container justifyContent='space-between'>
                    <Grid id='tags' item xl={4} lg={4} md={4} sm={12} xs={12} pb={5}>
                        <Stack spacing={1}>
                            <Typography fontWeight='bold'>Tags</Typography>
                            <Grid container spacing={2}>
                                <Grid item ml={-2}><Chip label='Allowlist'/></Grid>
                                <Grid item><Chip label='Allowlist'/></Grid>
                                <Grid item><Chip label='Allowlist'/></Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                    {
                        itemOwners.length > 0 && 
                        <Grid id='owners' item xl={7} lg={7} md={7} sm={12} xs={12}>
                            <Stack spacing={3}>
                                <Stack direction='row' justifyContent='space-between'>
                                    <Typography fontWeight='bold'>Allowlist Owners</Typography>
                                    <TextField placeholder='Search by wallet' InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}/>
                                </Stack>
                                <TableContainer component={Paper} elevation={3} sx={{p: 3, height: 300}}>
                                    <Table stickyHeader aria-label="simple table">
                                        <TableBody>
                                        {itemOwners.map((owner, index) => (
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
        </Grid>

    )
}