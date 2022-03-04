import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    team: {
      
    }
  })
);


export default function Team() {
  const classes = useStyles();
  return (
    <Grid className={classes.team} container direction='column' justifyContent='space-between'>
      
      
    </Grid>
  );
}
