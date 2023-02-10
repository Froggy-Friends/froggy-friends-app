import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Card, CardMedia, Grid, Stack, Switch, TextField, Typography } from "@mui/material";
import { Trait } from "../models/Trait";
import axios from "axios";
import mergeImages from 'merge-images';

export default function BuildAFrog() {
  const [preview, setPreview] = useState('');
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
  const [selectedShirt, setSelectedShirt] = useState<Trait>();
  const [selectedHat, setSelectedHat] = useState<Trait>();
  const [showBackgrounds, setShowBackgrounds] = useState(true);
  const [showBodies, setShowBodies] = useState(true);
  const [showEyes, setShowEyes] = useState(false);
  const [showMouths, setShowMouths] = useState(false);
  const [showShirts, setShowShirts] = useState(false);
  const [showHats, setShowHats] = useState(false);

  useEffect(() => {
    loadTraits();
  }, [])

  useEffect(() => {
    loadPreview(
      selectedBackground,
      selectedBody,
      selectedEyes,
      selectedMouth,
      selectedShirt,
      selectedHat
    );
  }, [selectedBackground, selectedBody, selectedEyes, selectedMouth, selectedShirt, selectedHat]);

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

  const loadPreview = async (
    bg: Trait | undefined, 
    body: Trait | undefined, 
    eyes: Trait | undefined, 
    mouth: Trait | undefined,
    shirt: Trait | undefined,
    hat: Trait | undefined
  ) => {
    const sources = [];

    if (bg) sources.push(bg.imageTransparent);
    if (body) sources.push(body.imageTransparent);
    if (eyes) sources.push(eyes.imageTransparent);
    if (mouth) sources.push(mouth.imageTransparent);
    if (shirt) sources.push(shirt.imageTransparent);
    if (hat) sources.push(hat.imageTransparent);

    if (sources.length) {
      const prev = await mergeImages(sources, { crossOrigin: 'anonymous', width: 2000, height: 2000});
      setPreview(prev);
    }
  }

  return (
    <Stack id='build-a-frog' direction='row' spacing={10}>
      <Stack id='preview' pt={2} spacing={4}>
        <Typography variant='h6'>Frog Preview</Typography>
        { preview && <img src={preview} alt='' height={400} width={400} style={{backgroundColor: 'white'}}/> }
        { !preview && <Stack width={400} height={400} bgcolor='white'/>}
      </Stack>
      <Stack id='choices' pt={2} spacing={5}>
        <Typography variant='h6'>Filters</Typography>
        <Stack id='filters' direction='row' spacing={2}>
          <Stack direction='row'>
            <Typography variant='body1'>Backgrounds</Typography>
            <Switch checked={showBackgrounds} onChange={() => setShowBackgrounds(!showBackgrounds)}/>
          </Stack>
          <Stack direction='row'>
            <Typography variant='body1'>Bodies</Typography>
            <Switch checked={showBodies} onChange={() => setShowBodies(!showBodies)}/>
          </Stack>
          <Stack direction='row'>
            <Typography variant='body1'>Eyes</Typography>
            <Switch checked={showEyes} onChange={() => setShowEyes(!showEyes)}/>
          </Stack>
          <Stack direction='row'>
            <Typography variant='body1'>Mouths</Typography>
            <Switch checked={showMouths} onChange={() => setShowMouths(!showMouths)}/>
          </Stack>
          <Stack direction='row'>
            <Typography variant='body1'>Shirts</Typography>
            <Switch checked={showShirts} onChange={() => setShowShirts(!showShirts)}/>
          </Stack>
          <Stack direction='row'>
            <Typography variant='body1'>Hats</Typography>
            <Switch checked={showHats} onChange={() => setShowHats(!showHats)}/>
          </Stack>
        </Stack>
        <Stack id='traits' spacing={2}>
          <Typography variant='h6'>Backgrounds</Typography>
          <Grid id='backgrounds' container>
            {
              backgroundTraits.map((trait, index) => {
                return (
                  <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} pr={2} pb={2}>
                    <Card onClick={() => setSelectedBackground(trait)}>
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
                  <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} pr={2} pb={2}>
                    <Card onClick={() => setSelectedBody(trait)}>
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
                  <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} pr={2} pb={2}>
                    <Card onClick={() => setSelectedEyes(trait)}>
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
                  <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} pr={2} pb={2}>
                    <Card onClick={() => setSelectedMouth(trait)}>
                      <CardMedia component='img' src={`${trait.imageTransparent}?img-width=100&img-height=100`} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                    </Card>
                  </Grid>
                )
              })
            }
          </Grid>
          <Typography variant='h6' pl={2}>Shirts</Typography>
          <Grid id='shirts' container>
            {
              shirtTraits.map((trait, index) => {
                return (
                  <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} pr={2} pb={2}>
                    <Card onClick={() => setSelectedShirt(trait)}>
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
              hatTraits.map((trait, index) => {
                return (
                  <Grid item key={index} xl={2} lg={2} md={2} sm={2} xs={2} pr={2} pb={2}>
                    <Card onClick={() => setSelectedHat(trait)}>
                      <CardMedia component='img' src={`${trait.imageTransparent}?img-width=100&img-height=100`} height={100} width={100} alt='' sx={{backgroundColor: '#93d0aa'}}/>
                    </Card>
                  </Grid>
                )
              })
            }
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  )
}