import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Card, CardMedia, Grid, Stack, TextField, Typography } from "@mui/material";
import { Trait } from "../models/Trait";
import axios from "axios";

export default function BuildAFrog() {
  const [preview, setPreview] = useState('');
  const [tokenId, setTokenId] = useState<number>();
  const [backgroundTraits, setBackgroundTraits] = useState<Trait[]>([]);
  const [bodyTraits, setBodyTraits] = useState<Trait[]>([]);
  const [eyeTraits, setEyeTraits] = useState<Trait[]>([]);
  const [mouthTraits, setMouthTraits] = useState<Trait[]>([]);
  const [shirtTraits, setShirtTraits] = useState<Trait[]>([]);
  const [hatTraits, setHatTraits] = useState<Trait[]>([]);

  useEffect(() => {
    loadTraits();
  }, [])

  const loadTraits = async () => {
    try {
      const backgrounds = (await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/Background`)).data;
      const bodies = (await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/Body`)).data;
      const eyes = (await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/Eyes`)).data;
      const mouths = (await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/Mouth`)).data;
      const shirts = (await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/Shirt`)).data;
      const hats = (await axios.get<Trait[]>(`${process.env.REACT_APP_API}/traits/layer/Hat`)).data;
      setBackgroundTraits(backgrounds);
      setBodyTraits(bodies);
      setEyeTraits(eyes);
      setMouthTraits(mouths);
      setShirtTraits(shirts);
      setHatTraits(hats);
    } catch (error) {
      console.log("load traits error: ", error);
    }
  }

  return (
    <Stack id='build-a-frog' direction='row' spacing={5}>
      <Stack id='preview'>
        <Typography variant='h6'>Build-A-Frog</Typography>
        { preview && <img src={preview} alt='' height={400} width={400} style={{backgroundColor: 'white'}}/> }
        { !preview && <Stack width={400} height={400} bgcolor='white'/>}
      </Stack>
      <Stack id='traits' spacing={2} p={2}>
        <Typography p={2}>Backgrounds</Typography>
        <Grid id='backgrounds' container>
          {
            backgroundTraits.map(trait => {
              return (
                <Grid item key={trait.id} xl={3} lg={3} md={3} sm={3} xs={3} p={2}>
                  <Card>
                    <CardMedia component='img' src={trait.imageTransparent} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </Stack>
    </Stack>
  )
}