import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    mint: {
      
    }
  })
);


export default function Mint() {
  const classes = useStyles();
  return (
    <Grid className={classes.mint} container direction='column' justifyContent='space-between'>
      
      
    </Grid>
  );
}
