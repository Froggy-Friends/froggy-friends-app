import { Card, CardMedia, CardContent, Typography, Grid, Button, useTheme } from "@mui/material";
import ribbitToken from '../images/ribbit.gif';

interface ItemProps {
    image: string;
    name: string;
    ribbit: number;
    selected: boolean;
    isFrog?: boolean;
    showGreenBorder?: boolean;
    showRedBorder?: boolean;
}

export default function Item (props: ItemProps) {
    const { image, name, ribbit, isFrog, selected, showGreenBorder, showRedBorder } = props;
    const theme = useTheme();

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

    return (
        <Card sx={{height: '100%', border: selected ? '5px solid' : '0px', borderColor: getBorderColor()}}>
            <CardMedia component='img' image={image} alt='Froggy' height={200}/>
            <CardContent sx={{bgcolor: theme.palette.common.white}}>
                <Typography variant='body1' fontWeight='bold' pb={1} pt={1}>{name}</Typography>
                <Grid container item justifyContent='space-between'>
                <Typography display='flex' alignItems='center'> 
                    <img src={ribbitToken} style={{height: 30, width: 30}} alt='think'/>
                    {kFormatter(ribbit)} {isFrog ? '/ day' : ''}
                </Typography>
                <Button variant='outlined' color='inherit' size="small" sx={{height: 20, borderRadius: 2, alignSelf: 'center'}}>
                    <Typography variant='body2'>MORE</Typography>
                </Button>
                </Grid>
            </CardContent>
        </Card>
    )
}