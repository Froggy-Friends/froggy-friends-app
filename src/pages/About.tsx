import { makeStyles } from '@mui/styles';
import { Avatar, Container, createStyles, Grid, Theme, Typography } from "@mui/material";
import froggy1 from '../images/froggy1.png';
import froggy2 from '../images/froggy2.png';
import froggy3 from '../images/froggy3.png';
import froggy4 from '../images/froggy4.png';
import froggy5 from '../images/froggy5.png';
import froggy6 from '../images/froggy6.png';
import clouds from '../images/cloud2.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    about: {
      backgroundColor: theme.palette.common.white
    },
    clouds: {
      width: '100%'
    }
  })
);


export default function About() {
  const classes = useStyles();
  return (
    <Grid className={classes.about} container alignItems='center' mt={-1} pt={10} pb={10}>
      <Container maxWidth='lg'>
        <Grid container direction='column' alignItems='center'>
          <Grid item pb={10}>
            <Typography variant='h1' textTransform='uppercase'>About</Typography>  
          </Grid>
          <Grid item pb={10}>
            <Typography variant='h3' sx={{fontFamily: 'outfit'}}>
              Froggy Friends is a collection of 4444 of the friendliest frogs in the metaverse.  
              Our community-driven project is aimed at becoming a place every Froggy holder will be able to call home in the metaverse and in real life.  
            </Typography> 
          </Grid>
          <Grid container item justifyContent='space-between'>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
              <Avatar alt='froggy' src={froggy1} sx={{height: 150, width: 150}}/>  
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
              <Avatar alt='froggy' src={froggy2} sx={{height: 150, width: 150}}/>  
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
              <Avatar alt='froggy' src={froggy3} sx={{height: 150, width: 150}}/>  
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
              <Avatar alt='froggy' src={froggy4} sx={{height: 150, width: 150}}/>  
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
              <Avatar alt='froggy' src={froggy5} sx={{height: 150, width: 150}}/>  
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={6}>
              <Avatar alt='froggy' src={froggy6} sx={{height: 150, width: 150}}/>  
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Grid id='clouds' className={classes.clouds} item>
        <img alt='clouds' src={clouds} style={{width: '100%'}}/>
      </Grid>
    </Grid>  
  );
}
