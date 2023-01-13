import { Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Switch, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useFroggiesOwned, useStakingDeposits } from "../client";
import banner from '../images/lab.jpg';
import { ItemPresets } from "../models/ItemPresets";
import theme from "../theme";

const useStyles: any = makeStyles((theme: Theme) => 
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
  const [presets, setPresets] = useState<ItemPresets>();
  const [itemName, setItemName] = useState('');
  const [itemOnSale, setItemOnSale] = useState(false);
  const [itemCategory, setItemCategory] = useState('');
  const [itemFriendOrigin, setItemFriendOrigin] = useState('');

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

  const onItemNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemName(event.target.value);
  }

  const onItemSaleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemOnSale(event.target.checked);
  };

  const onItemCategoryChange = (event: SelectChangeEvent) => {
    setItemCategory(event.target.value as string);
  }

  const onItemFriendOriginChange = (event: SelectChangeEvent) => {
    setItemFriendOrigin(event.target.value as string);
  }

  return (
    <Grid id="admin" className={classes.market} container direction="column" justifyContent="start">
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl'  sx={{pt: 15, pb: 25}}>
        <Grid container spacing={5}>
          <Stack>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Admin Tasks</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={task}
                onChange={onTaskChange}
              >
                <FormControlLabel value="wallet" control={<Radio />} label="Wallet Checker" />
                <FormControlLabel value="list" control={<Radio />} label="List Item" />
                <FormControlLabel value="update" control={<Radio />} label="Update Item" />
              </RadioGroup>
            </FormControl>
          </Stack>
          {
            task === 'wallet' &&
            <Stack width='80%'>
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
          {
            task === 'list' &&
            <Stack>
              <FormControl component='fieldset' variant='standard'>
                <Stack direction='row'>
                  <TextField label="Name" variant="outlined" value='itemName' onChange={onItemNameChange}/>
                  <FormControlLabel
                    control={
                      <Switch checked={itemOnSale} onChange={onItemSaleChanged}/>
                    }
                    label='On Sale'
                    labelPlacement="top"
                  />
                </Stack>
                <Stack direction='row' spacing={2}>
                  <Stack minWidth={100}>
                    <FormControl fullWidth>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category"
                        value={itemCategory}
                        label="Category"
                        onChange={onItemCategoryChange}
                      >
                        {
                          presets?.categories.map((category, index) => (
                            <MenuItem key={index} value={category}>{category}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack minWidth={100}>
                    <FormControl fullWidth>
                      <InputLabel id="friendOrigin-label">Friend Origin</InputLabel>
                      <Select
                        labelId="friendOrigin-label"
                        id="friendOrigin"
                        value={itemFriendOrigin}
                        label="friendOrigin"
                        onChange={onItemFriendOriginChange}
                      >
                        {
                          presets?.friendOrigins.map((friendOrigin, index) => (
                            <MenuItem key={index} value={friendOrigin}>{friendOrigin}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
              </FormControl>
            </Stack>
          }
        </Grid>
      </Container>
    </Grid>
  )
}