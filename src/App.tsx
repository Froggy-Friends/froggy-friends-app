import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }
  })
);


function App() {
  const classes = useStyles();
  return (
    <Grid className={classes.app} container direction='column' justifyContent='space-between'>
      
      
    </Grid>
  );
}

export default App;
