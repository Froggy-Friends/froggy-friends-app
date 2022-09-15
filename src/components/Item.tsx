import { Card, CardMedia, CardContent, Typography, Grid, Button, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ribbitToken from '../images/ribbit.gif';
import { RibbitItem } from "../models/RibbitItem";
import { addItemDetails } from "../redux/itemSlice";

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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getBorderColor = () => {
        if (selected && showGreenBorder) {
            return theme.palette.primary.main;
        } else if (selected && showRedBorder) {
            return theme.palette.error.main;
        } else {
            return "transparent";
        }
    }

    const kFormatter = (num: number): string => {
        const fixed = ((Math.abs(num)/1000));
        const format = Math.abs(num) > 999 
        ?( Math.sign(num) * fixed).toFixed(0) + 'k' 
        : Math.sign(num) * Math.abs(num) + '';
        return format;
    }

    const onItemClick = (item: RibbitItem) => {
        console.log("dispatch add item details: ", item);
        dispatch(addItemDetails(item));
        navigate('/item');
      }

    return (
        <Card sx={{height: '100%', border: selected ? '5px solid' : '0px', borderColor: getBorderColor()}}>
            <CardMedia component='img' image={item.image} alt='Froggy' height={200}/>
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