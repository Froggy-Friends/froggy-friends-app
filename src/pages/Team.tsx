import { makeStyles } from '@mui/styles';
import { Avatar, Card, CardContent, CardMedia, Container, createStyles, Grid, IconButton, Theme, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import jpg from '../images/jpg.jpg';
import cat from '../images/cat.png';
import cat2 from '../images/cat2.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    team: {
      
    }
  })
);


export default function Team() {
  const classes = useStyles();
  return (
    <Grid className={classes.team} container alignItems='center' pt={10} pb={40}>
      <Container maxWidth='lg'>
        <Grid container direction='column' alignItems='center'>
          <Grid item pb={10}>
            <Typography variant='h1' textTransform='uppercase'>Team</Typography>  
          </Grid>
          <Grid container item justifyContent='center' pb={10} p={5}>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} p={2}>
              <Card>
                <CardMedia sx={{padding: 3}}>
                  <Avatar alt='Home' src={jpg}/>
                </CardMedia>
                <CardContent>
                  <Typography variant='h2'>Jpeg Holdings</Typography>
                  <Typography variant='h3'>Founder / Artist </Typography>
                  <IconButton color='primary' onClick={() => window.open('https://twitter.com/jpegholdings', '_blank')}>
                    <TwitterIcon fontSize='large' />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} p={2}>
              <Card>
                <CardMedia sx={{padding: 3}}>
                  <Avatar alt='Home' src={cat2}/>
                </CardMedia>
                <CardContent>
                  <Typography variant='h2'>MayanMango.eth</Typography>
                  <Typography variant='h3'>Project Manager </Typography>
                  <IconButton color='primary' onClick={() => window.open('https://twitter.com/mayanmango', '_blank')}>
                    <TwitterIcon fontSize='large' />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={8} xs={12} p={2}>
              <Card>
                <CardMedia sx={{padding: 3}}>
                  <Avatar alt='Home' src={cat}/>
                </CardMedia>
                <CardContent>
                  <Typography variant='h2'>Fonzy.eth</Typography>
                  <Typography variant='h3'>Solidity Developer</Typography>
                  <IconButton color='primary' onClick={() => window.open('https://linktr.ee/fonzy.eth', '_blank')}>
                    <TwitterIcon fontSize='large' />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}
