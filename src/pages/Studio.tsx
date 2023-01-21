import { Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import banner from '../images/friends.png';
import FriendPairing from "../components/FriendPairing";

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
  const [studioView, setStudioView] = useState('pair');
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const onStudioViewChange = (event: SelectChangeEvent) => {
    setStudioView(event.target.value);
  }

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant='h3' pb={5}>Froggy Studio</Typography>
          <FormControl sx={{minWidth: 200}}>
            <InputLabel id="item-label">Studio View</InputLabel>
            <Select labelId="item-label" id="item" label="Studio View" value={studioView} onChange={onStudioViewChange}>
              <MenuItem value='pair'>Pairing</MenuItem>
              <MenuItem value='trait'>Traits</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <FriendPairing/>
      </Container>
    </Grid>

  )
}