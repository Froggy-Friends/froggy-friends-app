import { Close } from "@mui/icons-material";
import { Stack, Typography, TextField, FormControl, FormControlLabel, Switch, InputLabel, Select, MenuItem, Input, Button, SelectChangeEvent, IconButton, Snackbar } from "@mui/material";
import { useEthers } from "@usedapp/core";
import axios from "axios";
import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { ItemPresets } from "../../models/ItemPresets";
import { ItemRequest } from "../../models/ItemRequest";
import { RibbitItem } from "../../models/RibbitItem";

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
    const [price, setPrice] = useState('');
    const [percent, setPercent] = useState('');
    const [supply, setSupply] = useState('');
    const [walletLimit, setWalletLimit] = useState('');
    const [collabId, setCollabId] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

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

    const onListItemSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // prompt admin signature
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const message = JSON.stringify({ listItem: true, itemName: selectedItem.name, account: account });
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            const address = await signer.getAddress();
            const formData = new FormData();
            const listItem = {...selectedItem, price: +price, supply: +supply, walletLimit: +walletLimit};
            if (percent) listItem.percent = +percent;
            if (collabId) listItem.collabId = +collabId;
            console.log("item: ", listItem);

            formData.append('admin', address);
            formData.append('message', message);
            formData.append('signature', signature);
            formData.append('item', JSON.stringify(listItem));

            if (itemImage) {
                formData.append('image', itemImage);
            }
            if (itemImageTransparent) {
                formData.append('imageTransparent', itemImageTransparent);
            }

            let url: string = '';
            if (listItem.isFriend) {
                url = `${process.env.REACT_APP_API}/items/list/friend`;
            } else if (listItem.isCollabFriend) {
                url = `${process.env.REACT_APP_API}/items/list/collab/friend`;
            } else {
                url = `${process.env.REACT_APP_API}/items/list`;
            }
            const response = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
            console.log("response: ", response);
            if (response.status === 201) {
                setAlertMessage('Item created');
                setShowAlert(true);
            }
        } catch (error) {
            setAlertMessage('Error creating item ' + error);
            setShowAlert(true);
        }
    }

    const onSelectedItemIndexChange = (event: SelectChangeEvent) => {
      const newItem = items.find(item => item.name === event.target.value);
      console.log("new item: ", newItem);
      if (newItem) {
        setSelectedItem(newItem);
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
        setSelectedItem({
            ...selectedItem,
            [event.target.name]: event.target.value as string
        })
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

    const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowAlert(false);
      };

    return (
        <Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant="h4" pb={5}>{title}</Typography>
              <FormControl>
                <InputLabel id="item-label">Selected Item</InputLabel>
                <Select labelId="item-label" id="item" label="Selected Item" value={selectedItem.name} onChange={onSelectedItemIndexChange}>
                    {
                        items.map((item, index) => (
                            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
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
                    { type === 'normal' &&
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
                    }
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
                    { type === 'normal' &&
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
                    }
                    { type === 'collabs' && <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="collabId-label">Collab ID</InputLabel>
                            <Select labelId="collabId-label" id="collabId" name="collabId" value={collabId} label="collabId" onChange={(event) => setCollabId(event.target.value)}>
                                <MenuItem value=''></MenuItem>
                                {
                                    presets?.collabIds.map((collabId, index) => (
                                        <MenuItem key={index} value={collabId}>{collabId}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Stack>
                    }
                    { (type === 'friends' || type === 'collabs') && <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="boost-label">Boost</InputLabel>
                            <Select labelId="boost-label" id="boost" name="percent" value={percent} label="Boost" onChange={(event) => setPercent(event.target.value)}>
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
                    { type === 'traits' && <Stack minWidth={100}>
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
                </Stack>
                <Stack id='contract' direction='row' spacing={2} pb={5}>
                    <TextField id='item-price' label="Price" variant="outlined" value={price} onChange={(event) => setPrice(event.target.value)} />
                    <TextField id='item-supply' label="Supply" variant="outlined" value={supply} onChange={(event) => setSupply(event.target.value)} />
                    <TextField id='item-limit' label="Wallet Limit" variant="outlined" value={walletLimit} onChange={(event) => setWalletLimit(event.target.value)} />
                    {
                        type === 'collabs' &&
                        <TextField id='item-address' label="Collab Address" name="collabAddress" variant="outlined" value={selectedItem.collabAddress} onChange={onInputChange} />
                    }
                </Stack>
                <Stack id='description' pb={5}>
                    <TextField id='item-description' label="Description" name="description" variant="outlined" multiline minRows={3} value={selectedItem.description} onChange={onInputChange} />
                </Stack>
                { type === 'normal' &&
                <Stack id='links' spacing={2} pb={5}>
                    <TextField id='item-twitter' label="Twitter" name="twitter" variant="outlined" multiline minRows={3} value={selectedItem.twitter} onChange={onInputChange} />
                    <TextField id='item-discord' label="Discord" name="discord" variant="outlined" multiline minRows={3} value={selectedItem.discord} onChange={onInputChange} />
                    <TextField id='item-website' label="Website" name="website" variant="outlined" multiline minRows={3} value={selectedItem.website} onChange={onInputChange} />
                </Stack>
                }
                <Stack id='files' direction='row' pb={10}>
                    <FormControl>
                        <FormControlLabel label='Image' labelPlacement="top" control={<Input type="file" onChange={onItemImageChange} />}/>
                    </FormControl>
                    { type !== 'normal' && <FormControl>
                        <FormControlLabel label='Transparent Image' labelPlacement="top" control={<Input type="file" onChange={onItemImageTransparentChange} />}/>
                    </FormControl>
                    }
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