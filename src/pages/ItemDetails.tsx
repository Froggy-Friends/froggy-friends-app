import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { itemDetails, removeItemDetails } from "../redux/itemSlice";
import { Close, Search } from "@mui/icons-material";
import { Button, Chip, Container, Grid, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import ribbitToken from '../images/ribbit.gif';

export default function ItemDetails() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const item = useAppSelector(itemDetails);

    useEffect(() => {
        scroll();
    }, []);

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
        dispatch(removeItemDetails(item));
        navigate(-1);
    }

    return (
        <Grid id='item-details' container direction='column' bgcolor={theme.palette.background.default} pt={20} pb={20}>
            <Container maxWidth='lg'>
                <Grid id='top-row' container justifyContent='space-between' pb={10}>
                    <Grid id='image' item xl={4} lg={4} md={4} sm={5.5} xs={12} pb={3}>
                        <img src={item.image} width='100%' style={{borderRadius: 5}}/>
                    </Grid>
                    <Grid id='info' container item direction='column' justifyContent='space-between' xl={7} lg={7} md={7} sm={5.5} xs={12}>
                        <Grid id='title-and-exit' container justifyContent='space-between' pb={5}>
                            <Typography variant='h5' fontWeight='bold'>{item.name}</Typography>
                            <IconButton size="large" sx={{bgcolor: theme.palette.common.white, color: theme.palette.common.black}} onClick={onItemDetailsClose}>   
                                <Close/>
                            </IconButton>
                        </Grid>
                        <Grid id='price-and-socials' container pb={5}> 
                            <Grid id='price' item xl={2} lg={2} md={2} sm={2} xs={2}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Price</Typography>
                                    <Typography display='flex' alignItems='center'> 
                                        <img src={ribbitToken} style={{height: 30, width: 30}} alt='Ribbit'/>
                                        {kFormatter(item.price)}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid id='socials' item xl={2} lg={2} md={2} sm={2} xs={2}>
                                <Stack spacing={1}>
                                    <Typography variant='body1' fontWeight='bold'>Socials</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack spacing={1} pb={5}>
                            <Typography fontWeight='bold'>Description</Typography>
                            <Typography>{item.description}</Typography>
                        </Stack>
                        <Grid id='buttons' container>
                            <Button variant='contained' sx={{height: 50}}>
                                <Typography>Add to cart</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid id='bottom-row' container>
                    <Grid id='tags' item xl={4} lg={4} md={4} sm={5.5} xs={12} pb={3}>
                        <Stack spacing={1}>
                            <Typography fontWeight='bold'>Tags</Typography>
                            <Grid container spacing={2}>
                                <Grid item ml={-2}><Chip label='Allowlist'/></Grid>
                                <Grid item><Chip label='Allowlist'/></Grid>
                                <Grid item><Chip label='Allowlist'/></Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                    <Grid id='owners' item xl={7} lg={7} md={7} sm={5.5} xs={12}>
                        <Stack spacing={1}>
                            <Stack direction='row' justifyContent='space-between'>
                                <Typography fontWeight='bold'>Allowlist Owners</Typography>
                                <TextField placeholder='Search by wallet' InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}/>
                            </Stack>

                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Grid>

    )
}