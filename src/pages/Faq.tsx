import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    faq: {
      
    }
  })
);


export default function Faq() {
  const classes = useStyles();
  return (
    <Grid className={classes.faq} container direction='column' justifyContent='space-between'>
      
    </Grid>
  );
}
