import { Close } from '@mui/icons-material';
import { Button, Card, createStyles, CardContent, CardHeader, CardMedia, Grid, Typography, useMediaQuery, useTheme, Theme, Container, Modal, IconButton, Box, Stepper, Step, StepLabel, StepButton, Select, MenuItem, FormControl } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEthers } from '@usedapp/core';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import usePairFriend, { useFroggiesOwned } from '../client';
import { stakeUrl } from '../data';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    app: {
      backgroundColor: '#000000',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.1)), url(${stakeUrl})`,
      backgroundRepeat: 'no-repeat'
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: '#cfdcae',
      color: 'black',
      border: '2px solid #000',
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    },
    ribbit: {
      background: theme.palette.background.default,
      borderRadius: 30,
      padding: 5
    },
    buttons: {
      [theme.breakpoints.down(375)]: {
        maxWidth: '100%',
        flexBasis: '100%',
        padding: theme.spacing(2)
      }
    },
    walletButton: {
      marginTop: theme.spacing(3)
    }
  })
);

export default function Items() {

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [ownedItems, setOwnedItems] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedFrog, setSelectedFrog] = useState<any>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [stakedFrogs, setStakedFrogs] = useState<any>([]);
  const { pairFriend, pairFriendState } = usePairFriend();

  const { account } = useEthers();

  const getBackgroundSize = () => {
    return isDesktop ? "contain" : "cover";
  }

  const getStakedFroggies = useCallback(async (address: string) => {
    const response = await axios.post(`${process.env.REACT_APP_API}/owned`, { account: address });
    const frogsStaked = response.data.froggies.filter((frog: any) => frog.isStaked)
    setStakedFrogs(frogsStaked);
  }, []);

  const getOwnedItems = useCallback(async () => {
    const response = await axios.get(`https://api.froggyfriendsnft.com/items/owned/0x09a06f3901f3b0299dd492bd35eA1bB38c5C4c9b`);
    setOwnedItems(response.data);
  }, []);

  const confirmPair = async (item: any) => {
    setSelectedItem(item);
    setShowConfirmationModal(true);
  }

  const pair = async () => {
    const response = await axios.post(`${process.env.REACT_APP_API}/stake`, [selectedFrog]);
    const proof = response.data[0];

    pairFriend(selectedFrog, proof, selectedItem.id)
  }

  const onConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  }

  useEffect(() => {
    if(account) {
      getOwnedItems();
      getStakedFroggies(account);
    }
  }, [account, getOwnedItems, getStakedFroggies]);

  useEffect(() => {
    console.log(pairFriendState)
  }, [pairFriendState])
  
  return (
    <div>
      <Grid id='app' className={classes.app} sx={{backgroundSize: getBackgroundSize()}} container direction='column' pt={20} pb={30}>
      <Container maxWidth='xl'>
        <Grid id='froggies' container item xl={12} lg={12} md={12} sm={12} xs={12}>
          {ownedItems.length > 0 && ownedItems.map((ownedItem: any) =>
            ownedItem.isBoost && (
              <Grid key={ownedItem.index} item xl={2} lg={2} md={3} sm={6} xs={12} p={2} minHeight={300}>
                <Card>
                  <CardHeader title={ownedItem.name} titleTypographyProps={{variant: 'h6', color: 'secondary'}}/>
                  <CardMedia component='img' image={ownedItem.image} alt={ownedItem.name}/>
                  <CardContent>
                    <Typography variant='subtitle1' color='secondary' pb={1}>{ownedItem.name}</Typography>
                    <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                      <Typography variant='subtitle1' color='secondary' pb={1}>{ownedItem.percentage}% Boost</Typography>  
                    </Grid>
                    <Button variant='contained' color='success' onClick={() => confirmPair(ownedItem)}>
                      PAIR
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Grid>
      <Modal open={showConfirmationModal} onClose={onConfirmationModalClose} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h4" p={3}>Pair Friend</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onConfirmationModalClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <FormControl fullWidth>
            <Select defaultChecked={true} onChange={(e) => setSelectedFrog(e.target.value)}>
              {stakedFrogs.map((frog: any, idx: number) => <MenuItem key={frog.edition} value={frog.edition}>{frog.name}</MenuItem>)}
            </Select>
          </FormControl>
          
          <Typography variant='subtitle1'>Pairing you friend will give you a {selectedItem?.percentage} boost but it will burn your friend item. Do you wish to proceed?</Typography>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button variant='contained' color='success' onClick={() => pair()}>
              PAIR
            </Button>
          </Grid> 
        </Box>
      </Modal>
      <Modal open={showPairingModal} onClose={() => setShowPairingModal(false)} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id='modal-title' variant="h4" p={3}>Pair Friend</Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={() => setShowPairingModal(false)}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  )
}