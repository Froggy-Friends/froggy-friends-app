import { Container, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Stack, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import { useEthers } from "@usedapp/core";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useFroggiesOwned, useStakingDeposits } from "../client";
import ListItem from "../components/forms/ListItem";
import banner from '../images/lab.jpg';
import { ItemPresets } from "../models/ItemPresets";

declare var window: any;

const useStyles: any = makeStyles(() => 
  createStyles({
    banner: {
      backgroundImage: `url(${banner})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    }
  })
);

export default function Admin() {
  const classes = useStyles();
  const theme = useTheme();
  const [stakingWallet, setStakingWallet] = useState("");
  const deposits = useStakingDeposits(stakingWallet);
  const owned = useFroggiesOwned(stakingWallet);
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const [task, setTask] = useState('list');
  const [presets, setPresets] = useState<ItemPresets>({
    categories: [],
    collabIds: [],
    boosts: [],
    rarities: [],
    friendOrigins: [],
    traitLayers: []
  });

  useEffect(() => {
    async function getPresets() {
      try {
        const response = await axios.get<ItemPresets>(`${process.env.REACT_APP_API}/items/presets`);
        const fetchedPresets = response.data;
        setPresets(fetchedPresets);
      } catch (error) {
        console.log("error fetching item presets: ", error);
      }
    }

    getPresets();
  }, [])

  const onStakingWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStakingWallet(event.target.value);
  }

  const onTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask((event.target as HTMLInputElement).value);
  };

  const getRole = (deposits: number[]) => {
    const { length } = deposits;
    if (length >= 20) {
      return "Froggy Whale"
    } else if (length >= 15) {
      return "Froggy Baby Whale"
    } else if (length >= 10) {
      return "Froggy Maxi";
    } else if (length >= 5) {
      return "Froggy Wrangler";
    } else {
      return "None";
    }
  }

  return (
    <Grid id="admin" className={classes.market} container direction="column" justifyContent="start">
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='lg'  sx={{pt: 15, pb: 25}}>
        <Stack direction='row' spacing={20}>
          <Stack>
            <FormControl>
              <FormLabel id="admin-tasks">Admin Tasks</FormLabel>
              <RadioGroup aria-labelledby="admin-tasks" name="admin-tasks-group" value={task} onChange={onTaskChange}>
                <FormControlLabel value="list" control={<Radio />} label="List Item" />
                <FormControlLabel value="list-friend" control={<Radio />} label="List Friend Item" />
                <FormControlLabel value="list-collab-friend" control={<Radio />} label="List Collab Friend Item" />
                <FormControlLabel value="list-trait" control={<Radio />} label="List Trait Item" />
                <FormControlLabel value="update" control={<Radio />} label="Update Item" />
                <FormControlLabel value="update-friend" control={<Radio />} label="Update Friend Item" />
                <FormControlLabel value="update-collab-friend" control={<Radio />} label="Update Collab Friend Item" />
                <FormControlLabel value="update-trait" control={<Radio />} label="Update Trait Item" />
                <FormControlLabel value="wallet" control={<Radio />} label="Wallet Checker" />
              </RadioGroup>
            </FormControl>
          </Stack>
          {
            task === 'list' && <ListItem presets={presets}/>
          }
          {
            task === 'wallet' &&
            <Stack>
              <Grid id="wallet" justifyContent="center" container pb={5}>
                <TextField label="Wallet" variant="outlined" fullWidth value={stakingWallet} onChange={onStakingWalletChange}/>
              </Grid>
              {
                deposits &&
                <Grid id="staked" pb={5}>
                  <Grid item>
                    <Typography variant="h5">Froggies Unstaked: {owned}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">Froggies Staked: {deposits.length}</Typography>
                  </Grid>
                  <Grid item>
                  <Typography variant="h5">Froggies Owned: {owned + deposits.length}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">Whale Roles: {getRole(deposits)}</Typography>
                  </Grid>
                </Grid> 
              }
            </Stack>
          }
        </Stack>
      </Container>
    </Grid>
  )
}