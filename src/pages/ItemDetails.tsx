import { Close } from "@mui/icons-material";
import { Container, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { itemDetails, removeItemDetails } from "../redux/itemSlice";

export default function ItemDetails() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const item = useAppSelector(itemDetails);

    const onItemDetailsClose = () => {
        dispatch(removeItemDetails(item));
        navigate(-1);
    }

    return (
        <Grid id='item-details' container direction='column' bgcolor={theme.palette.background.default} height='100%' pt={20}>
            <Container maxWidth='xl'>
                <Grid id='top-row' container>
                    <Grid id='image' item xl={2} lg={2} md={2} sm={4} xs={4}>
                        <img src={item.image} height='100%' width='100%'/>
                    </Grid>
                    <Grid id='info' container item direction='column' xl={8} lg={8} md={8} sm={8} xs={8}>
                        <Grid id='title-and-exit' container justifyContent='space-between'>
                            <Typography variant='h5'>{item.name}</Typography>
                            <IconButton size="large" sx={{bgcolor: theme.palette.common.white, color: theme.palette.common.black}} onClick={onItemDetailsClose}>   
                                <Close/>
                            </IconButton>
                        </Grid>
                        <Grid id='price-and-socials' container>
                            <Grid id='price' item xl={3} lg={3} md={3} sm={3} xs={3}></Grid>
                            <Grid id='socials' item xl={3} lg={3} md={3} sm={3} xs={3}></Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid id='bottom-row' container></Grid>
            </Container>
        </Grid>

    )
}