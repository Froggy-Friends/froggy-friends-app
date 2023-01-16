import { Stack, Typography, TextField, FormControl, FormControlLabel, Switch, InputLabel, Select, MenuItem, Input, Button, SelectChangeEvent } from "@mui/material";
import { useEthers } from "@usedapp/core";
import axios from "axios";
import { ethers } from "ethers";
import { ChangeEvent, useState } from "react";
import { ItemPresets } from "../../models/ItemPresets";
import { ItemRequest } from "../../models/ItemRequest";

declare var window: any;
const itemRequest: ItemRequest = {
    admin: '',
    message: '',
    signature: '',
    name: '',
    description: '',
    category: '',
    twitter: '',
    discord: '',
    website: '',
    endDate: 0,
    collabId: '',
    isCommunity: false,
    isBoost: false,
    isTrait: false,
    isPhysical: false,
    isAllowlist: false,
    rarity: '',
    friendOrigin: '',
    traitLayer: '',
    price: '',
    percent: '',
    supply: '',
    walletLimit: '',
    isOnSale: false
};

export interface ListItemProps {
    presets: ItemPresets;
}

export default function ListItem(props: ListItemProps) {
    const { presets } = props;
    const { account } = useEthers();
    const [item, setItem] = useState<ItemRequest>(itemRequest);
    const [itemImage, setItemImage] = useState<File>();
    const [itemImageTransparent, setItemImageTransparent] = useState<File>();

    const onListItemSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("list item submit: ", event);

        try {
            // prompt admin signature
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const message = JSON.stringify({ listItem: true, itemName: item.name, account: account });
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            const address = await signer.getAddress();
            const formData = new FormData();

            formData.append('admin', address);
            formData.append('message', message);
            formData.append('signature', signature);
            formData.append('item', JSON.stringify(item));

            // formData.append('')
            if (itemImage) {
                formData.append('image', itemImage);
            }
            if (itemImageTransparent) {
                formData.append('imageTransparent', itemImageTransparent);
            }

            const response = await axios.post(`${process.env.REACT_APP_API}/items/list`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            console.log("response: ", response);

        } catch (error) {
            console.log("request accounts error: ", error);

        }
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

    return (
        <Stack>
            <Typography variant="h4" pb={5}>List New Item</Typography>
            <form onSubmit={onListItemSubmit}>
                <Stack id='title' direction='row' pb={5}>
                    <TextField id='item-name' label="Name" name="name" variant="outlined" value={item.name} onChange={onInputChange} />
                    <FormControl>
                        <FormControlLabel label='On Sale*' labelPlacement="top" name="isOnSale" control={<Switch checked={item.isOnSale} onChange={onSwitchChange} />} />
                    </FormControl>
                </Stack>
                <Stack id='menus' direction='row' spacing={2} pb={5}>
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
                    <Stack minWidth={100}>
                        <FormControl fullWidth>
                            <InputLabel id="friendOrigin-label">Friend Origin</InputLabel>
                            <Select labelId="friendOrigin-label" id="friendOrigin" name="friendOrigin" value={item.friendOrigin} label="friendOrigin" onChange={onMenuChange}>
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
                            <Select labelId="collabId-label" id="collabId" name="collabId" value={item.collabId} label="collabId" onChange={onMenuChange}>
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
                            <Select labelId="boost-label" id="boost" name="percent" value={item.percent} label="Boost" onChange={onMenuChange}>
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
                </Stack>
                <Stack id='switches' direction='row' pb={5}>
                    <FormControl>
                        <FormControlLabel label='Allowlist' labelPlacement="top" name="isAllowlist" control={<Switch checked={item.isAllowlist} onChange={onSwitchChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Friend' labelPlacement="top" name="isBoost" control={<Switch checked={item.isBoost} onChange={onSwitchChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Trait' labelPlacement="top" name="isTrait" control={<Switch checked={item.isTrait} onChange={onSwitchChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Community' labelPlacement="top" name="isCommunity" control={<Switch checked={item.isCommunity} onChange={onSwitchChange} />}/>
                    </FormControl>
                    <FormControl>
                        <FormControlLabel label='Physical' labelPlacement="top" name="isPhysical" control={<Switch checked={item.isPhysical} onChange={onSwitchChange} />}/>
                    </FormControl>
                </Stack>
                <Stack id='contract' direction='row' spacing={2} pb={5}>
                    <TextField id='item-price' label="Price" name="price" variant="outlined" value={item.price} onChange={onInputChange} />
                    <TextField id='item-supply' label="Supply" name="supply" variant="outlined" value={item.supply} onChange={onInputChange} />
                    <TextField id='item-limit' label="Wallet Limit" name="walletLimit" variant="outlined" value={item.walletLimit} onChange={onInputChange} />
                </Stack>
                <Stack id='description' pb={5}>
                    <TextField id='item-description' label="Description" name="description" variant="outlined" multiline minRows={3} value={item.description} onChange={onInputChange} />
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
        </Stack>
    )

}