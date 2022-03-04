import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme, Typography } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    about: {
      backgroundColor: theme.palette.common.white
    }
  })
);


export default function About() {
  const classes = useStyles();
  return (
    <Grid className={classes.about} container direction='column' alignItems='center' mt={-1} pt={10} pb={10}>
      <Grid item pb={10}>
        <Typography variant='h2' textTransform='uppercase'>About</Typography>  
      </Grid>
      <Grid item>
        <Typography variant='h3'>
          Froggy Friends is a collection of 4444 of the friendliest frogs in the metaverse.  
        </Typography>  
        <Typography variant='h3'>
          Our community-driven project is aimed at becoming a place every Froggy holder will be able to call home in the metaverse and in real life.  
        </Typography>
      </Grid>
    </Grid>
  );
}
