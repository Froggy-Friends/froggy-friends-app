import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import { ArrowBack, Close, Search } from "@mui/icons-material";
import { createStyles, Button, Chip, Container, Grid, IconButton, Snackbar, SnackbarContent, Stack, TextField, Theme, Typography, useMediaQuery, useTheme, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { RibbitItem } from "../models/RibbitItem";
import axios from "axios";
import ribbitToken from '../images/ribbit.gif';
import twitter from '../images/twitter.svg';
import discord from '../images/discord.svg';
import opensea from '../images/opensea.svg';
import { Froggy } from "../models/Froggy";
import { useEthers } from "@usedapp/core";
import { useStakingDeposits } from '../client';

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

export default function FrogDetails() {
    const classes = useStyles();
    const theme = useTheme();
    const navigate = useNavigate();
    const params = useParams();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const { account } = useEthers();
    const deposits = useStakingDeposits(`${account}`);
    const [item, setItem] = useState<Froggy>();
    const [alertMessage, setAlertMessage] = useState<any>(undefined);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        getFroggy(`${params.id}`);
        scroll();
    }, [params]);

    async function getFroggy(id: string) {
        try {
          const response = await axios.get<Froggy>(`${process.env.REACT_APP_API}/frog/${id}`);
          let item = response.data;
          console.log("item: ", item);
          setItem(item);
        } catch (error) {
          setAlertMessage("Failed to get items");
          setShowAlert(true);
        }
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
                        <img src={item?.image} width='100%' style={{borderRadius: 5}}/>
                    </Grid>
                    <Grid id='info' container item direction='column' justifyContent='space-between' xl={7} lg={7} md={7} sm={7} xs={12}>
                        <Grid id='title-and-exit' container justifyContent='space-between' alignItems='center' pb={5}>
                            <Typography variant='h5' fontWeight='bold'>{item?.name}</Typography>
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
                                        {kFormatter(item?.ribbit || 0)}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid id='socials' item xl={2} lg={2} md={2} sm={2} xs={2}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Socials</Typography>
                                    <Stack direction='row' spacing={2}>
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href='' target='_blank'>
                                                    <img src={twitter} style={{height: 24, width: 24}}/>
                                                </IconButton>
                                            </Paper>
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href='' target='_blank'>
                                                    <img src={discord} style={{height: 24, width: 24}}/>
                                                </IconButton>
                                            </Paper>
                                        <Paper elevation={3} sx={{borderRadius: 25}}>
                                            <IconButton className="cta" href='https://opensea.io/collection/froggyfriendsnft' target='_blank'>
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
                        {
                            item && deposits.includes(item.edition) && <Grid id='buttons' container>
                                <Button variant='contained' disabled sx={{height: 50}}>
                                    <Typography color='secondary'>Pair Friend</Typography>
                                </Button>
                            </Grid>
                        }
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