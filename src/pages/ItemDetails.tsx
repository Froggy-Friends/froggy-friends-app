import { Close } from "@mui/icons-material";
import { Button, Container, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { itemDetails, removeItemDetails } from "../redux/itemSlice";
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
        <Grid id='item-details' container direction='column' bgcolor={theme.palette.background.default} height='100%' pt={20}>
            <Container maxWidth='xl'>
                <Grid id='top-row' container>
                    <Grid id='image' item xl={4} lg={4} md={4} sm={4} xs={4}>
                        <img src={item.image} height='100%' width='100%' style={{borderRadius: 5}}/>
                    </Grid>
                    <Grid id='info' container item direction='column' xl={8} lg={8} md={8} sm={8} xs={8} pl={8}>
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
                            <Button variant='contained'>
                                <Typography>Add to Cart</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid id='bottom-row' container></Grid>
            </Container>
        </Grid>

    )
}