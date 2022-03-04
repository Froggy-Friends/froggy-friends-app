import { makeStyles } from '@mui/styles';
import { Container, createStyles, Grid, Theme, Typography } from "@mui/material";
import hills from '../images/hills.png';
import grass from '../images/grass.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    hills: {
      [theme.breakpoints.up('xl')]: {
        minHeight: 720
      }
    },
    faq: {
      backgroundColor: theme.palette.success.main
    }
  })
);


export default function Faq() {
  const classes = useStyles();
  return (
    <Grid container direction='column'>
      <Grid item className={classes.hills}>
        <img alt='faq' src={hills} style={{width: '100%'}}/>  
      </Grid>
      <Grid item className={classes.faq} mt={-1}>
        <Container maxWidth='xl'>
          <Grid container direction='column' alignItems='center'>
            <Grid item pb={10}>
              <Typography variant='h1' textTransform='uppercase'>FAQs</Typography>  
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item className={classes.faq}>
        <img alt='grass' src={grass} style={{width: '100%'}}/>
      </Grid>
    </Grid>
  );
}
