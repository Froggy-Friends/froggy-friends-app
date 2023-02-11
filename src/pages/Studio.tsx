import { Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import banner from '../images/friends.png';
import FriendStudio from "../components/FriendStudio";
import TraitStudio from "../components/TraitStudio";
import { useLocation } from "react-router-dom";
import BuildAFrog from "../components/BuildAFrog";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    banner: {
      backgroundImage: `url(${banner})`, 
      backgroundSize: 'cover',
      [theme.breakpoints.up('xl')]: {
        backgroundPositionY: -800
      }
    }
  })
);

export default function Studio() {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const state: any = location.state;
  const [studioView, setStudioView] = useState(state ? state.view : 'Build-A-Frog');
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const onStudioViewChange = (event: SelectChangeEvent) => {
    setStudioView(event.target.value);
  }

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{minHeight: 800, pt: 5, pb: 5}}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h3' pb={5}>
            {studioView}
          </Typography>
          <FormControl sx={{minWidth: 400}}>
            <InputLabel id="item-label">Studio View</InputLabel>
            <Select labelId="item-label" id="item" label="Studio View" value={studioView} onChange={onStudioViewChange}>
              <MenuItem value='Pair Studio' sx={{fontSize: theme.typography.h6}}>
                <Typography variant="h6">Pairing</Typography>
              </MenuItem>
              <MenuItem value='Trait Studio' sx={{fontSize: theme.typography.h6}}>
                <Typography variant='h6'>Traits</Typography>
              </MenuItem>
              <MenuItem value='Build-A-Frog' sx={{fontSize: theme.typography.h6}}>
                <Typography variant='h6'>Build-A-Frog</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
        { studioView === 'Pair Studio' && <FriendStudio/>}
        { studioView === 'Trait Studio' && <TraitStudio/>}
        { studioView === 'Build-A-Frog' && <BuildAFrog/>}
      </Container>
    </Grid>

  )
}