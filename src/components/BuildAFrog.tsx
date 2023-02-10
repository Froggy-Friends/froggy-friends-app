import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Card, CardMedia, Grid, Stack, TextField, Typography } from "@mui/material";
import { Trait } from "../models/Trait";
import axios from "axios";
import mergeImages from 'merge-images';

export default function BuildAFrog() {
  const [preview, setPreview] = useState('');
  const [tokenId, setTokenId] = useState<number>();
  const [backgroundTraits, setBackgroundTraits] = useState<Trait[]>([]);
  const [bodyTraits, setBodyTraits] = useState<Trait[]>([]);
  const [eyeTraits, setEyeTraits] = useState<Trait[]>([]);
  const [mouthTraits, setMouthTraits] = useState<Trait[]>([]);
  const [shirtTraits, setShirtTraits] = useState<Trait[]>([]);
  const [hatTraits, setHatTraits] = useState<Trait[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<Trait>();
  const [selectedBody, setSelectedBody] = useState<Trait>();
  const [selectedEyes, setSelectedEyes] = useState<Trait>();
  const [selectedMouth, setSelectedMouth] = useState<Trait>();

  useEffect(() => {
    loadTraits();
  }, [])

  useEffect(() => {
    loadPreview(
      selectedBackground,
      selectedBody,
      selectedEyes,
      selectedMouth
    );
  }, [selectedBackground, selectedBody, selectedEyes, selectedMouth]);

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

  const loadPreview = async (bg: Trait | undefined, body: Trait | undefined, eyes: Trait | undefined, mouth: Trait | undefined) => {
    const sources = [];

    if (bg) sources.push(bg.imageTransparent);
    if (body) sources.push(body.imageTransparent);
    if (eyes) sources.push(eyes.imageTransparent);
    if (mouth) sources.push(mouth.imageTransparent);

    if (sources.length) {
      const prev = await mergeImages(sources, { crossOrigin: 'anonymous', width: 2000, height: 2000});
      setPreview(prev);
    }
  }

  const onBackgroundClicked = (trait: Trait) => {
    setSelectedBackground(trait);
  }

  const onBodyClick = (trait: Trait) => {
    setSelectedBody(trait);
  }

  const onEyesClick = (trait: Trait) => {
    setSelectedEyes(trait);
  }

  const onMouthClick = (trait: Trait) => {
    setSelectedMouth(trait);
  }

  return (
    <Stack id='build-a-frog' direction='row' spacing={5}>
      <Stack id='preview' pt={5}>
        { preview && <img src={preview} alt='' height={400} width={400} style={{backgroundColor: 'white'}}/> }
        { !preview && <Stack width={400} height={400} bgcolor='white'/>}
      </Stack>
      <Stack id='traits' spacing={2} p={2}>
        <Typography variant='h6' pl={2}>Backgrounds</Typography>
        <Grid id='backgrounds' container>
          {
            backgroundTraits.map((trait, index) => {
              return (
                <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} p={2}>
                  <Card onClick={() => onBackgroundClicked(trait)}>
                    <CardMedia component='img' src={`${trait.imageTransparent}?img-width=100&img-height=100`} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
        <Typography variant='h6' pl={2}>Body</Typography>
        <Grid id='body' container>
          {
            bodyTraits.map((trait, index) => {
              return (
                <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} p={2}>
                  <Card onClick={() => onBodyClick(trait)}>
                    <CardMedia component='img' src={`${trait.imageTransparent}?img-width=100&img-height=100`} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
        <Typography variant='h6' pl={2}>Eyes</Typography>
        <Grid id='eyes' container>
          {
            eyeTraits.map((trait, index) => {
              return (
                <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} p={2}>
                  <Card onClick={() => onEyesClick(trait)}>
                    <CardMedia component='img' src={`${trait.imageTransparent}?img-width=100&img-height=100`} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
        <Typography variant='h6' pl={2}>Mouths</Typography>
        <Grid id='mouths' container>
          {
            mouthTraits.map((trait, index) => {
              return (
                <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} p={2}>
                  <Card onClick={() => onMouthClick(trait)}>
                    <CardMedia component='img' src={`${trait.imageTransparent}?img-width=100&img-height=100`} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
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