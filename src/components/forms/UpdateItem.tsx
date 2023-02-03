import { Close } from "@mui/icons-material";
import { Stack, Typography, TextField, FormControl, FormControlLabel, Switch, InputLabel, Select, MenuItem, Input, Button, SelectChangeEvent, IconButton, Snackbar, OutlinedInput, Checkbox, ListItemText } from "@mui/material";
import { useEthers } from "@usedapp/core";
import axios from "axios";
import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { ItemPresets } from "../../models/ItemPresets";
import { RibbitItem } from "../../models/RibbitItem";
import { Trait } from "../../models/Trait";

declare var window: any;
const ribbitItem: RibbitItem = {
  id: 0,
  name: '',
  description: '',
  category: '',
  collabId: 0,
  collabAddress: '',
  twitter: '',
  discord: '',
  website: '',
  endDate: 0,
  image: '',
  imageTransparent: '',
  previewImage: '',
  price: 0,
  percent: 0,
  minted: 0,
  supply: 0,
  rarity: '',
  walletLimit: 0,
  isBoost: false,
  isFriend: false,
  isCollabFriend: false,
  isOnSale: false,
  isCommunity: false,
  isAllowlist: false,
  isPhysical: false,
  isTrait: false,
  amount: 0,
  traitLayer: '',
  traitId: 0,
  friendOrigin: '',
};

export type itemType = 'normal' | 'friends' | 'collabs' | 'traits';
export interface ListItemProps {
    title: string;
    type: itemType;
    presets: ItemPresets;
}

export default function UpdateItem(props: ListItemProps) {
    const { title, type, presets } = props;
    const { account } = useEthers();
    const [items, setItems] = useState<RibbitItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<RibbitItem>(ribbitItem);
    const [itemImage, setItemImage] = useState<File>();
    const [itemImageTransparent, setItemImageTransparent] = useState<File>();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [traits, setTraits] = useState<Trait[]>([]);
    const [compatibleTraits, setCompatibleTraits] = useState<string[]>([]);

    useEffect(() => {
      async function getAllItems() {
        try {
          const response = await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/items`);
          setItems(response.data);
        } catch (error) {
          setItems([]);
          setAlertMessage("Issue fetching all items");
          setShowAlert(true);
        }
      }

      getAllItems();
    }, []);

    useEffect(() => {
        async function getTraits(layer: string) {
            try {
                const response = await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/${layer}`);
                setTraits(response.data);
            } catch (error) {
                console.log("error fetching traits: ", error);
                setTraits([]);
            }
        }

        if (selectedItem.traitLayer) {
            getTraits(selectedItem.traitLayer);
        }

    }, [selectedItem.traitLayer]);

    async function getCompatibleTraits(traitId: number) {
        try {
            const response = await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/compatible/${traitId}`);
            setCompatibleTraits(response.data.map(t => t.name));
        } catch (error) {
            console.log("get compatible traits error: ", error);
            setCompatibleTraits([]);
        }
    }

    const onListItemSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // prompt admin signature
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const message = JSON.stringify({ modifiedBy: account });
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            const address = await signer.getAddress();
            const formData = new FormData();

            formData.append('admin', address);
            formData.append('message', message);
            formData.append('signature', signature);
            formData.append('item', JSON.stringify(selectedItem));

            if (itemImage) {
                formData.append('image', itemImage);
            }
            if (itemImageTransparent) {
                formData.append('imageTransparent', itemImageTransparent);
            }
            if (selectedItem.isTrait) {
                // gather compatible traits
                const compTraits = traits.filter(trait => compatibleTraits.includes(trait.name));
                formData.append('compatibleTraits', JSON.stringify(compTraits));
            }

            let url: string = `${process.env.REACT_APP_API}/items`;
            const response = await axios.put(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
            console.log("response: ", response);
            if (response.status === 200) {
                setAlertMessage('Item updated');
                setShowAlert(true);
            }
        } catch (error) {
            setAlertMessage('Error creating item ' + error);
            setShowAlert(true);
        }
    }

    const onSelectedItemIndexChange = (event: SelectChangeEvent) => {
        const id = +event.target.value;
        const newItem = items.find(item => item.id === id);
        if (newItem) {
            setSelectedItem(newItem);
            if (newItem.traitId) {
                getCompatibleTraits(newItem.traitId);
            }
        }
    }

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedItem({
            ...selectedItem,
            [event.target.name]: event.target.value
        });
    }

    const onSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedItem({
            ...selectedItem,
            [event.target.name]: event.target.checked
        });
    }

    const onMenuChange = (event: SelectChangeEvent) => {
        if (event.target.name === 'traitLayer' && event.target.value !== selectedItem.traitLayer) {
            setTraits([]);
            setCompatibleTraits([]);
        }
        setSelectedItem({
            ...selectedItem,
            [event.target.name]: event.target.value as string
        })
    }

    const onItemImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setItemImage(event.target.files[0]);
        }
    }

    const onItemImageTransparentChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setItemImageTransparent(event.target.files[0]);
        }
    }

    const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowAlert(false);
      };

    const onCompatibleTraitsChanged = (event: SelectChangeEvent<typeof compatibleTraits>) => {
        const value = event.target.value;
  
        setCompatibleTraits(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        )
    };

    return (
        <Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="h4" pb={5}>{title}</Typography>
              <FormControl sx={{minWidth: 200}}>
                <InputLabel id="item-label">Selected Item</InputLabel>
                <Select labelId="item-label" id="item" label="Selected Item" value={`${selectedItem.id}`} onChange={onSelectedItemIndexChange}>
                    {
                        items.map((item, index) => (
                            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                        ))
                    }
                </Select>
              </FormControl>
            </Stack>
            <form onSubmit={onListItemSubmit}>
                <Stack id='title' direction='row' justifyContent='space-between' pb={5}>
                    <TextField id='item-name' label="Name" name="name" variant="outlined" fullWidth value={selectedItem.name} onChange={onInputChange} />
                    <FormControl fullWidth>
                        <FormControlLabel label='On Sale*' labelPlacement="top" name="isOnSale" control={<Switch checked={selectedItem.isOnSale} onChange={onSwitchChange} />} />
                    </FormControl>
                </Stack>
                <Stack id='menus' direction='row' spacing={2} pb={5}>
                    <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category*</InputLabel>
                            <Select labelId="category-label" id="category" name="category" value={selectedItem.category} label="Category" onChange={onMenuChange}>
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
                            <Select labelId="rarity-label" id="rarity" name="rarity" value={selectedItem.rarity} label="rarity" onChange={onMenuChange}>
                                <MenuItem value=''></MenuItem>
                                {
                                    presets?.rarities.map((rarity, index) => (
                                        <MenuItem key={index} value={rarity}>{rarity}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    { selectedItem.isBoost &&
                    <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="boost-label">Boost</InputLabel>
                            <Select labelId="boost-label" id="boost" name="percent" label="Boost"
                              value={selectedItem.percent}
                              onChange={(event) => setSelectedItem({...selectedItem, percent: +event.target.value})}>
                                <MenuItem value=''></MenuItem>
                                {
                                    presets?.boosts.map((boost, index) => (
                                        <MenuItem key={index} value={boost}>{boost}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    }
                    { selectedItem.isTrait &&
                    <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="traitLayer-label">Trait Layer</InputLabel>
                            <Select labelId="traitLayer-label" id="traitLayer" name="traitLayer" value={selectedItem.traitLayer} label="traitLayer" onChange={onMenuChange}>
                                <MenuItem value=''></MenuItem>
                                {
                                    presets?.traitLayers.map((traitLayer, index) => (
                                        <MenuItem key={index} value={traitLayer}>{traitLayer}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    }
                    { selectedItem.isTrait &&
                    <Stack minWidth={300}>
                        <FormControl>
                            <InputLabel id="compatible-traits-label">Compatible Traits</InputLabel>
                            <Select labelId="compatible-traits-label" id="compatible-traits" multiple value={compatibleTraits} onChange={onCompatibleTraitsChanged} 
                                input={<OutlinedInput label="Compatible Traits" />} renderValue={(selected) => selected.join(', ')}>
                            {traits.map((trait) => (
                                <MenuItem key={trait.id} value={trait.name}>
                                    <Checkbox checked={compatibleTraits.includes(trait.name)} />
                                    <ListItemText primary={trait.name} />
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    }
                </Stack>
                { selectedItem.category === 'collabs' &&
                <Stack id='collab' direction='row' spacing={2} pb={5}>
                  <TextField id='item-collab-address' label="Collab Address" name="collabAddress" variant="outlined" fullWidth value={selectedItem.collabAddress} onChange={onInputChange} />
                </Stack>
                }
                <Stack id='switches' direction='row' pb={5}>
                    <FormControl>
                        <FormControlLabel label='Allowlist' labelPlacement="top" name="isAllowlist" control={<Switch checked={selectedItem.isAllowlist} onChange={onSwitchChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Community' labelPlacement="top" name="isCommunity" control={<Switch checked={selectedItem.isCommunity} onChange={onSwitchChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Physical' labelPlacement="top" name="isPhysical" control={<Switch checked={selectedItem.isPhysical} onChange={onSwitchChange} />}/>
                    </FormControl>
                </Stack>
                <Stack id='contract' direction='row' spacing={2} pb={5}>
                    <TextField id='item-price' label="Price" variant="outlined" value={selectedItem.price} onChange={(event) => setSelectedItem({...selectedItem, price: +event.target.value})} />
                    <TextField id='item-supply' label="Supply" variant="outlined" value={selectedItem.supply} onChange={(event) => setSelectedItem({...selectedItem, supply: +event.target.value})} />
                    <TextField id='item-limit' label="Wallet Limit" variant="outlined" value={selectedItem.walletLimit} onChange={(event) => setSelectedItem({...selectedItem, walletLimit: +event.target.value})} />
                    {
                        type === 'collabs' &&
                        <TextField id='item-address' label="Collab Address" name="collabAddress" variant="outlined" value={selectedItem.collabAddress} onChange={onInputChange} />
                    }
                </Stack>
                <Stack id='description' pb={5}>
                    <TextField id='item-description' label="Description" name="description" variant="outlined" multiline minRows={3} value={selectedItem.description} onChange={onInputChange} />
                </Stack>
                <Stack id='links' spacing={2} pb={5}>
                    <TextField id='item-twitter' label="Twitter" name="twitter" variant="outlined" multiline value={selectedItem.twitter} onChange={onInputChange} />
                    <TextField id='item-discord' label="Discord" name="discord" variant="outlined" multiline value={selectedItem.discord} onChange={onInputChange} />
                    <TextField id='item-website' label="Website" name="website" variant="outlined" multiline value={selectedItem.website} onChange={onInputChange} />
                </Stack>
                <Stack id='files' direction='row' pb={10}>
                    <FormControl>
                        <FormControlLabel label='Image' labelPlacement="top" control={<Input type="file" onChange={onItemImageChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Transparent Image' labelPlacement="top" control={<Input type="file" onChange={onItemImageTransparentChange} />}/>
                    </FormControl>
                </Stack>
                <Stack id='submit' direction='row' justifyContent='center'>
                    <Button type="submit" variant='contained' color="primary">
                        <Typography>Submit</Typography>
                    </Button>
                </Stack>
            </form>
            <Snackbar
                open={showAlert} 
                autoHideDuration={5000} 
                message={alertMessage} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={onAlertClose}
                action={
                <IconButton size='small' aria-label='close' color='inherit' onClick={onAlertClose}>
                    <Close fontSize='small' />
                </IconButton>
                }
            />
        </Stack>
    )

}