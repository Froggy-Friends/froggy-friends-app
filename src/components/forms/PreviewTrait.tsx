import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Trait } from "../../models/Trait";
import axios from "axios";


export default function PreviewTrait(props: { title: string}) {
  const { title } = props;
  const [tokenId, setTokenId] = useState<number>();
  const [traits, setTraits] = useState<Trait[]>([]);
  const [selectedTraitId, setSelectedTraitId] = useState<number>();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    getTraits();
  }, []);

  useEffect(() => {
    if (tokenId && selectedTraitId) {
      loadFrogPreview(tokenId, selectedTraitId);
    }
  }, [tokenId, selectedTraitId]);

  const getTraits = async () => {
    try {
        const response = await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits`);
        setTraits(response.data);
    } catch (error) {
        console.log("error fetching traits: ", error);
    }
  }

  const loadFrogPreview = async (tokenId: number, traitId: number) => {
    try {
      const factoryUrl = process.env.REACT_APP_FROGGY_FACTORY;
      const preview = (await axios.get<string>(`${factoryUrl}/stream/preview/${tokenId}/${traitId}`)).data;
      setPreview(preview);
    } catch (error) {
      console.log("load frog preview error: ", error);
    }
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenId(+event.target.value);
  }

  const onTraitChange = (event: SelectChangeEvent) => {
    setSelectedTraitId(+event.target.value);
  }

  return (
    <Stack id='preview-trait' spacing={5}>
      <Typography>{ title }</Typography>
      <Stack id='title' direction='row' justifyContent='space-between'>
          <TextField id='item-name' label="Token ID" name="Token ID" variant="outlined" fullWidth value={tokenId} onChange={onInputChange} />
      </Stack>
      <Stack>
        <FormControl fullWidth>
            <InputLabel id="traits-label">Traits</InputLabel>
            <Select labelId="traits-label" id="traits" label="Traits" value={`${selectedTraitId}`} onChange={onTraitChange}>
                {
                    traits.map((trait, index) => (
                        <MenuItem key={index} value={trait.id}>{trait.name} - {trait.layer}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
      </Stack>
      <Stack>
        {
          preview && <img src={preview} alt='' height={400} width={400}/>
        }
      </Stack>
    </Stack>
  )
}