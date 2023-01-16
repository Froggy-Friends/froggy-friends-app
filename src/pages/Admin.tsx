import { Button, Container, FormControl, FormControlLabel, FormLabel, Grid, Input, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Switch, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import { useConfig, useEthers } from "@usedapp/core";
import axios from "axios";
import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { useFroggiesOwned, useStakingDeposits } from "../client";
import banner from '../images/lab.jpg';
import { ItemPresets } from "../models/ItemPresets";
import theme from "../theme";

declare var window: any;

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
  const { account } = useEthers();
  const [task, setTask] = useState('list');
  const [presets, setPresets] = useState<ItemPresets>();
  const [itemName, setItemName] = useState('');
  const [itemOnSale, setItemOnSale] = useState(false);
  const [itemCategory, setItemCategory] = useState<string>('');
  const [itemFriendOrigin, setItemFriendOrigin] = useState<string>('');
  const [itemCollabId, setItemCollabId] = useState<string>('');
  const [itemBoost, setItemBoost] = useState<string>('');
  const [itemRarity, setItemRarity] = useState<string>('');
  const [itemTraitLayer, setItemTraitLayer] = useState<string>('');
  const [itemIsCommunity, setItemIsCommunity] = useState(false);
  const [itemIsFriend, setItemIsFriend] = useState(false);
  const [itemIsCollabFriend, setItemIsCollabFriend] = useState(false);
  const [itemIsTrait, setItemIsTrait] = useState(false);
  const [itemIsPhysical, setItemIsPhysical] = useState(false);
  const [itemIsAllowlist, setItemIsAllowlist] = useState(false);
  const [itemPrice, setItemPrice] = useState<string>('');
  const [itemSupply, setItemSupply] = useState<string>('');
  const [itemWalletLimit, setItemWalletLimit] = useState<string>('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState<File>();
  const [itemImageTransparent, setItemImageTransparent] = useState<File>();

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
    setItemFriendOrigin(event.target.value);
  }

  const onItemCollabIdChange = (event: SelectChangeEvent) => {
    setItemCollabId(event.target.value);
  }

  const onItemBoostChange = (event: SelectChangeEvent) => {
    setItemBoost(event.target.value);
  }

  const onItemRarityChange = (event: SelectChangeEvent) => {
    setItemRarity(event.target.value);
  }

  const onItemTraitLayerChange = (event: SelectChangeEvent) => {
    setItemTraitLayer(event.target.value);
  }

  const onItemIsCommunityChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemIsCommunity(event.target.checked);
  };

  const onItemIsBoostChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemIsFriend(event.target.checked);
  };

  const onItemIsCollabFriendChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemIsCollabFriend(event.target.checked);
  };

  const onItemIsTraitChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemIsTrait(event.target.checked);
  };

  const onItemIsPhysicalChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemIsPhysical(event.target.checked);
  };

  const onItemIsAllowlistChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemIsAllowlist(event.target.checked);
  };

  const onItemPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemPrice(event.target.value);
  }

  const onItemSupplyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemSupply(event.target.value);
  }

  const onItemWalletLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemWalletLimit(event.target.value);
  }

  const onItemDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemDescription(event.target.value);
  }

  const onItemImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("item image change: ", event);
    if (event.target.files && event.target.files.length > 0) {
      setItemImage(event.target.files[0]);
    }
  }

  const onItemImageTransparentChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setItemImageTransparent(event.target.files[0]);
    }
  }

  const onListItemSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("list item submit: ", event);

    try {
      // prompt admin signature
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const message = JSON.stringify({listItem: true, itemName: itemName, account: account});
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();
      const formData = new FormData();
      formData.append('admin', address);
      formData.append('message', message);
      formData.append('signature', signature);
      if (itemImage) {
        formData.append('image', itemImage);
      }
      if (itemImageTransparent) {
        formData.append('imageTransparent', itemImageTransparent);
      }

      let url = `${process.env.REACT_APP_API}`;
      if (itemIsFriend) {
        url += '/items/list/friend';
      } else if (itemIsCollabFriend) {
        url += '/items/list/collab/friend';
      } else {
        url += '/items/list';
      }
      
      const response = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data"}});
      console.log("response: ", response);

    } catch (error) {
      console.log("request accounts error: ", error);
      
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
              <FormLabel id="demo-controlled-radio-buttons-group">Admin Tasks</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={task}
                onChange={onTaskChange}
              >
                <FormControlLabel value="list" control={<Radio />} label="List Item" />
                <FormControlLabel value="update" control={<Radio />} label="Update Item" />
                <FormControlLabel value="wallet" control={<Radio />} label="Wallet Checker" />
              </RadioGroup>
            </FormControl>
          </Stack>
          {
            task === 'list' &&
            <Stack>
              <Typography variant="h4" pb={5}>List New Item</Typography>
              <form onSubmit={onListItemSubmit}>
                <Stack id='title' direction='row' pb={5}>
                    <TextField id='item-name' label="Name" variant="outlined" value={itemName} onChange={onItemNameChange}/>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemOnSale} onChange={onItemSaleChanged}/>
                          }
                          label='On Sale*'
                          labelPlacement="top"
                        />  
                    </FormControl>
                  </Stack>
                  <Stack id='menus' direction='row' spacing={2} pb={5}>
                    <Stack minWidth={100}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category*</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category"
                          value={itemCategory}
                          label="Category"
                          onChange={onItemCategoryChange}
                        >
                          <MenuItem value=''></MenuItem>
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
                        <InputLabel id="rarity-label">Rarity*</InputLabel>
                        <Select
                          labelId="rarity-label"
                          id="rarity"
                          value={itemRarity}
                          label="rarity"
                          onChange={onItemRarityChange}
                        >
                          <MenuItem value=''></MenuItem>
                          {
                            presets?.rarities.map((rarity, index) => (
                              <MenuItem key={index} value={rarity}>{rarity}</MenuItem>
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
                          <MenuItem value=''></MenuItem>
                          {
                            presets?.friendOrigins.map((friendOrigin, index) => (
                              <MenuItem key={index} value={friendOrigin}>{friendOrigin}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack minWidth={100}>
                      <FormControl fullWidth>
                        <InputLabel id="collabId-label">Collab ID</InputLabel>
                        <Select
                          labelId="collabId-label"
                          id="collabId"
                          value={itemCollabId}
                          label="collabId"
                          onChange={onItemCollabIdChange}
                        >
                          <MenuItem value=''></MenuItem>
                          {
                            presets?.collabIds.map((collabId, index) => (
                              <MenuItem key={index} value={collabId}>{collabId}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack minWidth={100}>
                      <FormControl fullWidth>
                        <InputLabel id="boost-label">Boost</InputLabel>
                        <Select
                          labelId="boost-label"
                          id="boost"
                          value={itemBoost}
                          label="Boost"
                          onChange={onItemBoostChange}
                        >
                          <MenuItem value=''></MenuItem>
                          {
                            presets?.boosts.map((boost, index) => (
                              <MenuItem key={index} value={boost}>{boost}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack minWidth={100}>
                      <FormControl fullWidth>
                        <InputLabel id="traitLayer-label">Trait Layer</InputLabel>
                        <Select
                          labelId="traitLayer-label"
                          id="traitLayer"
                          value={itemTraitLayer}
                          label="traitLayer"
                          onChange={onItemTraitLayerChange}
                        >
                          <MenuItem value=''></MenuItem>
                          {
                            presets?.traitLayers.map((traitLayer, index) => (
                              <MenuItem key={index} value={traitLayer}>{traitLayer}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Stack id='switches' direction='row' pb={5}>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemIsAllowlist} onChange={onItemIsAllowlistChanged}/>
                          }
                          label='Allowlist'
                          labelPlacement="top"
                        />  
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemIsFriend} onChange={onItemIsBoostChanged}/>
                          }
                          label='Friend'
                          labelPlacement="top"
                        />  
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemIsCollabFriend} onChange={onItemIsCollabFriendChanged}/>
                          }
                          label='Collab Friend'
                          labelPlacement="top"
                        />  
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemIsTrait} onChange={onItemIsTraitChanged}/>
                          }
                          label='Trait'
                          labelPlacement="top"
                        />  
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemIsCommunity} onChange={onItemIsCommunityChanged}/>
                          }
                          label='Community'
                          labelPlacement="top"
                        />  
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                          control={
                            <Switch checked={itemIsPhysical} onChange={onItemIsPhysicalChanged}/>
                          }
                          label='Physical'
                          labelPlacement="top"
                        />  
                    </FormControl>
                  </Stack>
                  <Stack id='contract' direction='row' spacing={2} pb={5}>
                    <TextField id='item-price' label="Price" variant="outlined" value={itemPrice} onChange={onItemPriceChange}/>
                    <TextField id='item-supply' label="Supply" variant="outlined" value={itemSupply} onChange={onItemSupplyChange}/>
                    <TextField id='item-limit' label="Wallet Limit" variant="outlined" value={itemWalletLimit} onChange={onItemWalletLimitChange}/>
                  </Stack>
                  <Stack id='description' pb={5}>
                    <TextField id='item-description' label="Description" variant="outlined" multiline minRows={3} value={itemDescription} onChange={onItemDescriptionChange}/>
                  </Stack>
                  <Stack id='files' direction='row' pb={10}>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Input type="file" onChange={onItemImageChange}/>
                        }
                        label='Image'
                        labelPlacement="top"
                      />
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                        control={
                          <Input type="file" onChange={onItemImageTransparentChange}/>
                        }
                        label='Transparent Image'
                        labelPlacement="top"
                      />
                    </FormControl>
                  </Stack>
                  <Stack id='submit' direction='row' justifyContent='center'>
                    <Button type="submit" variant='contained' color="primary">
                      <Typography>Submit</Typography>
                    </Button>
                  </Stack>
              </form>
            </Stack>
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