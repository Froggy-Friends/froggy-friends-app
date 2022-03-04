import { makeStyles } from '@mui/styles';
import { Avatar, Button, createStyles, Grid, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import froggy from '../images/froggy.jpg';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    home: {
      width: '100%'
    },
  })
);


export default function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Grid className={classes.home} container direction='column' alignItems='center' p={3}>
      <Grid id='header' container item justifyContent='center' p={5}>
        { !isMobile && <Avatar className={classes.avatar} alt='Home' src={froggy} sx={{height: 200, width: 200}}/>}
        { isMobile && <Avatar className={classes.avatar} alt='Home' src={froggy} sx={{height: 75, width: 75}}/>}
      </Grid>
      <Grid id='title' item pb={5}>
        <Typography variant='h2'>Froggy Friends</Typography>
      </Grid>
      <Grid id='mint' item>
        <Button variant='contained' color='secondary'>
          <Typography>Coming Soon</Typography>  
        </Button>  
      </Grid>
    </Grid>
  );
}
