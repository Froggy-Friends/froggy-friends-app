import { Card, CardMedia, CardContent, Typography, Grid, Button, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ribbitToken from '../images/ribbit.gif';
import { RibbitItem } from "../models/RibbitItem";
import { kFormatter } from "../utils";

interface ItemProps {
    item: RibbitItem;
    selected: boolean;
    isFrog?: boolean;
    showGreenBorder?: boolean;
    showRedBorder?: boolean;
}

export default function Item (props: ItemProps) {
    const { item, isFrog, selected, showGreenBorder, showRedBorder } = props;
    const theme = useTheme();
    const navigate = useNavigate();
    const isDown425 = useMediaQuery(theme.breakpoints.down(425));

    const getBorderColor = () => {
        if (selected && showGreenBorder) {
            return theme.palette.primary.main;
        } else if (selected && showRedBorder) {
            return theme.palette.error.main;
        } else {
            return "transparent";
        }
    }

    const onItemClick = (item: RibbitItem) => {
        navigate(`/item/${item.id}`);
    }

    return (
        <Card sx={{height: '100%', border: selected ? '5px solid' : '0px', borderColor: getBorderColor()}}>
            <CardMedia component='img' image={item.image} alt='' height={isDown425 ? 300 : 200}/>
            <CardContent sx={{bgcolor: theme.palette.common.white}}>
                <Typography variant='body1' fontWeight='bold' pb={1} pt={1}>{item.name}</Typography>
                <Grid container item justifyContent='space-between'>
                <Typography display='flex' alignItems='center'> 
                    <img src={ribbitToken} style={{height: 30, width: 30}} alt='Ribbit'/>
                    {kFormatter(item.price)} {isFrog ? '/ day' : ''}
                </Typography>
                <Button variant='outlined' color='inherit' size="small" sx={{height: 20, borderRadius: 2, alignSelf: 'center'}} onClick={() => onItemClick(item)}>
                    <Typography variant='body2'>MORE</Typography>
                </Button>
                </Grid>
            </CardContent>
        </Card>
    )
}