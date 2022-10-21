import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, Close } from "@mui/icons-material";
import { Button, Chip, Container, Grid, IconButton, Snackbar, SnackbarContent, Stack, Typography, useMediaQuery, useTheme, Paper, Skeleton } from "@mui/material";
import { Froggy } from "../models/Froggy";
import { useEthers } from "@usedapp/core";
import { useStakingDeposits } from '../client';
import { saveAs } from 'file-saver';
import axios from "axios";
import ribbitToken from '../images/ribbit.gif';
import twitter from '../images/twitter.svg';
import discord from '../images/discord.svg';
import opensea from '../images/opensea.svg';
import { kFormatter } from "../utils";

export default function FrogDetails() {
    const theme = useTheme();
    const navigate = useNavigate();
    const params = useParams();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const { account } = useEthers();
    const deposits = useStakingDeposits(`${account}`);
    const [frog, setFrog] = useState<Froggy>();
    const [alertMessage, setAlertMessage] = useState<any>(undefined);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        scroll();
        if (account) {
            getFroggy(`${params.id}`);
        }
    }, [account, params.id]);

    async function getFroggy(id: string) {
        try {
          const response = await axios.post<Froggy>(`${process.env.REACT_APP_API}/frog/${id}`);
          let item = response.data;
          setFrog(item);
        } catch (error) {
          setAlertMessage("Failed to get items");
          setShowAlert(true);
        }
    }

    const scroll = () => {
        const itemDetails = document.querySelector('#item-details');
        itemDetails?.scrollIntoView({ behavior: 'smooth'});
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

    const downloadAsset = (asset: string, name: string) => {
        saveAs(asset, name);
    }

    return (
        <Grid id='item-details' container direction='column' bgcolor={theme.palette.background.default} pt={20} pb={20}>
            <Container maxWidth='lg'>
                <Grid id='top-row' container justifyContent='space-between' pb={10}>
                    <Grid id='image' item xl={4} lg={4} md={5} sm={5} xs={12} pb={isXs ? 5 : 0}>
                        {
                            frog ? (
                                <img src={frog?.image3d} alt='' width='100%' style={{borderRadius: 5}}/>
                            ) : (
                                <Skeleton variant='rectangular' animation='wave' height={400}/>
                            )
                        }
                    </Grid>
                    <Grid id='info' container item direction='column' justifyContent='space-between' minHeight={isSm ? 400 : 'inherit'} xl={7} lg={7} md={6} sm={6} xs={12}>
                        <Grid id='title-and-exit' container justifyContent='space-between' alignItems='center'>
                            {
                                frog ? (
                                    <Typography variant='h5' fontWeight='bold'>{frog?.name}</Typography>
                                ) : (
                                    <Skeleton variant='text' animation='wave' height={35} width={200}/>
                                )
                            }
                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                <IconButton className="cta" onClick={onItemDetailsClose}>   
                                    <ArrowBack/>
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid id='price-and-socials' container> 
                            <Grid id='price' item xl={2} lg={2} md={2} sm={3} xs={4}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Price</Typography>
                                    <Typography display='flex' alignItems='center'> 
                                        <img src={ribbitToken} style={{height: 30, width: 30}} alt='Ribbit'/>
                                        {kFormatter(frog?.ribbit || 0)}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid id='socials' item xl={2} lg={2} md={2} sm={2} xs={2}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Socials</Typography>
                                    <Stack direction='row' spacing={2}>
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href='' target='_blank'>
                                                    <img src={twitter} alt='' style={{height: 24, width: 24}}/>
                                                </IconButton>
                                            </Paper>
                                            <Paper elevation={3} sx={{borderRadius: 25}}>
                                                <IconButton className="cta" href='' target='_blank'>
                                                    <img src={discord} alt='' style={{height: 24, width: 24}}/>
                                                </IconButton>
                                            </Paper>
                                        <Paper elevation={3} sx={{borderRadius: 25}}>
                                            <IconButton className="cta" href='https://opensea.io/collection/froggyfriendsnft' target='_blank'>
                                                <img src={opensea} alt='' style={{height: 24, width: 24}}/>
                                            </IconButton>
                                        </Paper>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack id='tags' spacing={1}>
                            <Typography fontWeight='bold'>Tags</Typography>
                            <Grid container spacing={2}>
                                <Grid item ml={-2}><Chip label={frog?.rarity || 'common'}/></Grid>
                                <Grid item><Chip label={frog?.isStaked ? 'staked' : 'unstaked'}/></Grid>
                                <Grid item><Chip label={frog?.isPaired ? 'paired' : 'unpaired'}/></Grid>
                            </Grid>
                        </Stack>
                        {
                            frog && deposits.includes(frog.edition) && <Grid id='buttons' container justifyContent={isXs ? 'center' : 'start'}>
                                <Button variant='contained' disabled sx={{height: 50}}>
                                    <Typography color='secondary'>Pair Friend</Typography>
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </Grid>
                <Grid id='bottom-row' container justifyContent='space-between'>
                    {
                        frog && <Grid id='traits' container item xl={4} lg={4} md={5} sm={5} xs={12} pb={10}>
                            <Stack spacing={3}>
                                <Typography variant='h5' fontWeight='bold'>Traits</Typography>
                                <Grid container>
                                    {
                                        frog.attributes.map(trait => {
                                            return (
                                                <Grid item xl={4} lg={4} md={4} sm={6} xs={6} pb={3}>
                                                    <Typography fontWeight='bold'>{trait.trait_type}</Typography>
                                                    <Typography>{trait.value}</Typography>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Stack>
                        </Grid>
                    }
                    {
                        frog && <Grid id='download' item xl={7} lg={7} md={6} sm={6} xs={12} pb={5}>
                            <Stack spacing={3}>
                                <Typography variant='h5' fontWeight='bold'>Download Assets</Typography>
                                <Stack direction={isXs ? 'column' : 'row'} spacing={3}>
                                    {
                                        frog.image && 
                                        <Stack alignItems='center' spacing={5} pb={5}>
                                            <img src={frog.image} alt='' width={isSm ? '100%' : 200} style={{borderRadius: 5}}/>
                                            <Button variant='contained' color="primary" sx={{height: 50, width: 130}}onClick={() => downloadAsset(frog.image, `${frog.edition}.png`)}>Download</Button>
                                        </Stack>
                                    }
                                    {
                                        frog.imagePixel && 
                                        <Stack alignItems='center' spacing={5} pb={5}>
                                            <img src={frog.imagePixel} alt='' width={isSm ? '100%' : 200} style={{borderRadius: 5}}/>
                                            <Button variant='contained' color="primary" sx={{height: 50, width: 130}} onClick={() => downloadAsset(frog.imagePixel, `${frog.edition}-pixel.png`)}>Download</Button>
                                        </Stack>
                                    }
                                    {
                                        frog.image3d && 
                                        <Stack alignItems='center' spacing={5} pb={5}>
                                            <img src={frog.image3d} alt='' width={isSm ? '100%' : 200} style={{borderRadius: 5}}/>
                                            <Button variant='contained' color="primary" sx={{height: 50, width: 130}} onClick={() => downloadAsset(frog.image3d, `${frog.edition}-3d.png`)}>Download</Button>
                                        </Stack>
                                    }
                                </Stack>
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