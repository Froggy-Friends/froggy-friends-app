import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography } from "@mui/material";
import market from "../images/market.png";

const useStyles: any = makeStyles((theme: Theme) => 
createStyles({
  market: {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.1)), url(${market})`,
    backgroundColor: '#000000',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    minHeight: '100%'
  }
})
);


export default function Market() {
  const classes = useStyles();

  return (
    <Grid id="market" className={classes.market} container direction="column" pb={30}>
      <Container maxWidth="xl">
        <Grid container direction='column' textAlign='center' pt={10}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={8}>
            <Typography variant='h2' color='secondary' fontWeight='bold'>$RIBBIT Marketplace</Typography>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
}