import { Close } from "@mui/icons-material";
import { Stack, Typography, TextField, FormControl, FormControlLabel, Switch, InputLabel, Select, MenuItem, Input, Button, SelectChangeEvent, IconButton, Snackbar, OutlinedInput, Checkbox, ListItemText } from "@mui/material";
import { useEthers } from "@usedapp/core";
import axios from "axios";
import { ethers } from "ethers";
import { ChangeEvent, useEffect, useState } from "react";
import { ItemPresets } from "../../models/ItemPresets";
import { ItemRequest } from "../../models/ItemRequest";
import { Trait } from "../../models/Trait";

declare var window: any;

const itemRequest: ItemRequest = {
    name: '',
    description: '',
    category: '',
    twitter: '',
    discord: '',
    website: '',
    endDate: 0,
    collabId: 0,
    collabAddress: '',
    isCommunity: false,
    isBoost: false,
    isFriend: false,
    isCollabFriend: false,
    isTrait: false,
    isPhysical: false,
    isAllowlist: false,
    rarity: '',
    traitLayer: '',
    price: 0,
    percent: 0,
    supply: 0,
    walletLimit: 0,
    isOnSale: false
};

export type itemType = 'normal' | 'friends' | 'collabs' | 'traits';
export interface ListItemProps {
    title: string;
    type: itemType;
    presets: ItemPresets;
}

export default function ListItem(props: ListItemProps) {
    const { title, type, presets } = props;
    const { account } = useEthers();
    const [itemImage, setItemImage] = useState<File>();
    const [itemImageTransparent, setItemImageTransparent] = useState<File>();
    const [price, setPrice] = useState('');
    const [percent, setPercent] = useState('');
    const [supply, setSupply] = useState('');
    const [walletLimit, setWalletLimit] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [traits, setTraits] = useState<Trait[]>([]);
    const [compatibleTraits, setCompatibleTraits] = useState<string[]>([]);
    const [item, setItem] = useState<ItemRequest>({
        ...itemRequest, 
        isBoost: type === 'friends' || type === 'collabs',
        isFriend: type === 'friends',
        isCollabFriend: type === 'collabs',
        isTrait: type === 'traits',
        category: type === 'normal' ? '' : type
    });

    useEffect(() => {
        async function getTraits(layer: string) {
            try {
                setCompatibleTraits([]);
                const response = await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/${layer}`);
                setTraits(response.data);
            } catch (error) {
                console.log("error fetching traits: ", error);
                setCompatibleTraits([]);
            }
        }

        getTraits(item.traitLayer);
    }, [item.traitLayer]);

    const onCompatibleTraitsChanged = (event: SelectChangeEvent<typeof compatibleTraits>) => {
      const value = event.target.value;

      setCompatibleTraits(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      )
    };

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
            const listItem = {...item, price: +price, supply: +supply, walletLimit: +walletLimit};
            if (percent) listItem.percent = +percent;
            
            // gather compatible traits
            const compTraits = traits.filter(trait => compatibleTraits.includes(trait.name));
            console.log("compatible traits: ", compTraits);

            formData.append('admin', address);
            formData.append('message', message);
            formData.append('signature', signature);
            formData.append('item', JSON.stringify(listItem));
            formData.append('compatibleTraits', JSON.stringify(compTraits));

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

    const onPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value)
    }

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setItem({
            ...item,
            [event.target.name]: event.target.value
        });
    }

    const onSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setItem({
            ...item,
            [event.target.name]: event.target.checked
        });
    }

    const onMenuChange = (event: SelectChangeEvent) => {
        setItem({
            ...item,
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
            <Typography variant="h4" pb={5}>{title}</Typography>
            <form onSubmit={onListItemSubmit}>
                <Stack id='title' direction='row' justifyContent='space-between' pb={5}>
                    <TextField id='item-name' label="Name" name="name" variant="outlined" fullWidth value={item.name} onChange={onInputChange} />
                    <FormControl fullWidth>
                        <FormControlLabel label='On Sale*' labelPlacement="top" name="isOnSale" control={<Switch checked={item.isOnSale} onChange={onSwitchChange} />} />
                    </FormControl>
                </Stack>
                <Stack id='menus' direction='row' spacing={2} pb={5}>
                    { type === 'normal' &&
                    <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category*</InputLabel>
                            <Select labelId="category-label" id="category" name="category" value={item.category} label="Category" onChange={onMenuChange}>
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
                            <Select labelId="rarity-label" id="rarity" name="rarity" value={item.rarity} label="rarity" onChange={onMenuChange}>
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
                            <FormControlLabel label='Allowlist' labelPlacement="top" name="isAllowlist" control={<Switch checked={item.isAllowlist} onChange={onSwitchChange} />}/>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel label='Community' labelPlacement="top" name="isCommunity" control={<Switch checked={item.isCommunity} onChange={onSwitchChange} />}/>
                        </FormControl>
                        <FormControl>
                            <FormControlLabel label='Physical' labelPlacement="top" name="isPhysical" control={<Switch checked={item.isPhysical} onChange={onSwitchChange} />}/>
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
                    { type === 'traits' && 
                    <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="traitLayer-label">Trait Layer</InputLabel>
                            <Select labelId="traitLayer-label" id="traitLayer" name="traitLayer" value={item.traitLayer} label="traitLayer" onChange={onMenuChange}>
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
                    { type === 'traits' &&
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
                <Stack id='contract' direction='row' spacing={2} pb={5}>
                    <TextField id='item-price' label="Price" variant="outlined" value={price} onChange={(event) => setPrice(event.target.value)} />
                    <TextField id='item-supply' label="Supply" variant="outlined" value={supply} onChange={(event) => setSupply(event.target.value)} />
                    <TextField id='item-limit' label="Wallet Limit" variant="outlined" value={walletLimit} onChange={(event) => setWalletLimit(event.target.value)} />
                    {
                        type === 'collabs' &&
                        <TextField id='item-address' label="Collab Address" name="collabAddress" variant="outlined" value={item.collabAddress} onChange={onInputChange} />
                    }
                </Stack>
                <Stack id='description' pb={5}>
                    <TextField id='item-description' label="Description" name="description" variant="outlined" multiline minRows={3} value={item.description} onChange={onInputChange} />
                </Stack>
                { type === 'normal' &&
                <Stack id='links' spacing={2} pb={5}>
                    <TextField id='item-twitter' label="Twitter" name="twitter" variant="outlined" multiline value={item.twitter} onChange={onInputChange} />
                    <TextField id='item-discord' label="Discord" name="discord" variant="outlined" multiline value={item.discord} onChange={onInputChange} />
                    <TextField id='item-website' label="Website" name="website" variant="outlined" multiline value={item.website} onChange={onInputChange} />
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