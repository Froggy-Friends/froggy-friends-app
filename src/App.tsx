import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Faq from './pages/Faq';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: theme.palette.common.white
    }
  })
);


function App() {
  const classes = useStyles();
  return (
    <Grid className={classes.app} container direction='column' alignItems='center'>
      <Home/>
      <About/>
      <Team/>
      <Faq/>
    </Grid>
  );
}

export default App;
