import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme } from "@mui/material";
import Mint from './pages/Mint';
import About from './pages/About';
import Team from './pages/Team';
import Faq from './pages/Faq';

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
      <Mint/>
      <About/>
      <Team/>
      <Faq/>
    </Grid>
  );
}

export default App;
