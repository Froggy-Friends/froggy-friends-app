import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    about: {
      
    }
  })
);


export default function About() {
  const classes = useStyles();
  return (
    <Grid className={classes.about} container direction='column' justifyContent='space-between'>
      
      
    </Grid>
  );
}
