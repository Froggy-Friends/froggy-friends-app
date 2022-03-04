import { makeStyles } from '@mui/styles';
import { Avatar, Card, CardContent, CardMedia, Container, createStyles, Grid, Theme, Typography } from "@mui/material";
import froggy from '../images/froggy.jpg';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    team: {
      
    }
  })
);


export default function Team() {
  const classes = useStyles();
  return (
    <Grid className={classes.team} container alignItems='center' mt={-1} pt={10} pb={10}>
      <Container maxWidth='lg'>
        <Grid container direction='column' alignItems='center'>
          <Grid item pb={10}>
            <Typography variant='h1' textTransform='uppercase'>Team</Typography>  
          </Grid>
          <Grid container item justifyContent='center' pb={10} p={5}>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} p={2}>
              <Card>
                <CardMedia sx={{padding: 3}}>
                  <Avatar alt='Home' src={froggy}/>
                </CardMedia>
                <CardContent>
                  <Typography variant='h2'>Jpeg Holdings</Typography>
                  <Typography variant='h3'>Founder / Artist </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} p={2}>
              <Card>
                <CardMedia sx={{padding: 3}}>
                  <Avatar alt='Home' src={froggy}/>
                </CardMedia>
                <CardContent>
                  <Typography variant='h2'>Mayan Mango</Typography>
                  <Typography variant='h3'>Project Manager </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} p={2}>
              <Card>
                <CardMedia sx={{padding: 3}}>
                  <Avatar alt='Home' src={froggy}/>
                </CardMedia>
                <CardContent>
                  <Typography variant='h2'>Fonzy</Typography>
                  <Typography variant='h3'>Developer</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}
