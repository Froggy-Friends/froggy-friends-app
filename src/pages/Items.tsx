import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Close, InfoOutlined } from "@mui/icons-material";
import {Button, Card, createStyles, CardContent, CardHeader, CardMedia, Grid, Typography, useMediaQuery, useTheme, Theme, Container, Modal, IconButton, Box, Select, MenuItem, FormControl, Link, Tooltip, Chip} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEthers } from "@usedapp/core";
import { commify } from '@ethersproject/units';
import usePairFriend from "../client";
import { RibbitItem } from "../models/RibbitItem";
import hi from '../images/hi.png';
import discord from '../images/discord.png';
import twitter from '../images/twitter.png';
import ribbit from '../images/ribbit.gif';

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      backgroundColor: "#181818"
    },
    modal: {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 500,
      backgroundColor: "#cfdcae",
      color: "black",
      border: "2px solid #000",
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down("sm")]: {
        width: 300,
      },
    },
    ribbit: {
      background: theme.palette.background.default,
      borderRadius: 30,
      padding: 5,
    },
    buttons: {
      [theme.breakpoints.down(375)]: {
        maxWidth: "100%",
        flexBasis: "100%",
        padding: theme.spacing(2),
      },
    },
    walletButton: {
      marginTop: theme.spacing(3),
    },

    select: {
      color: "white",
    },
    cardMedia: {
      position: 'relative',
    },
    cardMediaImage: {
      display: 'block',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      objectFit: 'cover',
      height: 350
    },
    community: {
      position: 'absolute',
      top: 0,
      backgroundColor: '#ebca27',
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1)
    },
  })
);

export default function Items() {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [ownedItems, setOwnedItems] = useState<RibbitItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedFrog, setSelectedFrog] = useState<any>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [ownedFrogs, setOwnedFrogs] = useState<any>([]);
  const { pairFriend, pairFriendState } = usePairFriend();

  const { account } = useEthers();

  const getBackgroundSize = () => {
    return isDesktop ? "contain" : "cover";
  };

  const getOwnedFrogs = useCallback(async (address: string) => {
    const response = await axios.post(`${process.env.REACT_APP_API}/owned`, {
      account: address,
    });
    const ownedFrogs = response.data.froggies.filter(
      (frog: any) => !frog.isStaked
    );
    setOwnedFrogs(ownedFrogs);
  }, []);

  const getOwnedItems = useCallback(async (address: string) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/items/owned/${address}`
    );
    setOwnedItems(response.data);
  }, [account]);

  const confirmPair = async (item: any) => {
    setSelectedItem(item);
    setShowConfirmationModal(true);
  };

  const pair = async () => {
    const response = await axios.post(`${process.env.REACT_APP_API}/stake`, [
      selectedFrog,
    ]);
    const proof = response.data[0];

    pairFriend(selectedFrog, proof, selectedItem.id);
  };

  const onConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    if (account) {
      getOwnedItems(account);
      getOwnedFrogs(account);
    }
  }, [account, getOwnedItems, getOwnedFrogs]);

  useEffect(() => {
    console.log(pairFriendState);
  }, [pairFriendState]);

  const filterItems = (category: string) => {
    return ownedItems.filter(item => item.category.toLowerCase() == category.toLowerCase());
  }

  return (
    <div>
      <Grid id="app" className={classes.app} sx={{ backgroundSize: getBackgroundSize() }} container direction="column" pt={20} pb={30}>
        <Container maxWidth="xl">
          {
            ownedItems.length == 0 && 
            <Grid item display='flex' direction='column'>
              <Typography variant='h5' color='secondary' pb={3}>No Ribbit Items purchased yet. Browse the market to purchase items.</Typography>
              <img src={hi} style={{height: 125, width: 125}}/>
            </Grid>
          }
          {
            filterItems('lilies').length > 0 &&
            <Grid id='lilies' container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>Golden Lily Pads</Typography>
              </Grid>
              {
                filterItems('lilies').map((lily, index) => {
                  return <Grid key={index} item xl={3} lg={3} md={4} sm={6} xs={12} p={2}>
                          <Card className='dark'>
                            <CardHeader title="Golden Lily Pad" titleTypographyProps={{variant: 'h6', color: 'secondary'}}/>
                            <CardMedia component='img' image={lily.image} alt='Golden Lily Pad'/>
                            <CardContent>
                              <Typography variant='subtitle1' color='secondary' pb={1}>{lily.name}</Typography>
                              <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(lily.price)}</Typography>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
            </Grid>
          }
          {
            filterItems('friends').length > 0 &&
            <Grid id="friends" container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>Genesis Friends</Typography>
              </Grid>
              {
                filterItems('friends').map(friend => {
                  return <Grid key={friend.id} item xl={3} lg={3} md={4} sm={6} xs={12} p={2}>
                          <Card className='dark'>
                            <CardHeader title={friend.name} titleTypographyProps={{variant: "h6", color: "secondary"}}/>
                            <CardMedia component="img" image={friend.image} alt={friend.name}/>
                            <CardContent>
                              <Grid item display="flex" justifyContent="center" pb={1}> 
                                <Typography   variant="subtitle1"   color="secondary"   pb={1} >   {friend.percentage}% Boost </Typography>
                              </Grid>
                              <Grid item display='flex' justifyContent='center' alignItems='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(friend.price)}</Typography>
                              </Grid>
                              <Button variant="contained" color="success" disabled onClick={() => confirmPair(friend)}> 
                                PAIR
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                })
              }
            </Grid>
          }
          {
            filterItems('collabs').length > 0 && 
            <Grid id="collabs" container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>Collab Friends</Typography>
              </Grid>
              {
                filterItems('collabs').map(friend => {
                  return <Grid key={friend.id} item xl={3} lg={3} md={4} sm={6} xs={12} p={2}>
                          <Card className='dark'>
                            <CardHeader title={friend.name} titleTypographyProps={{variant: "h6", color: "secondary"}}/>
                            <CardMedia component="img" image={friend.image} alt={friend.name}/>
                            <CardContent>
                              <Typography variant="subtitle1" color="secondary" pb={1}>
                                {friend.name}
                              </Typography>
                              <Grid item display="flex" justifyContent="center" pb={2} pr={1}> 
                                <Typography   variant="subtitle1"   color="secondary"   pb={1} >   {friend.percentage}% Boost </Typography>
                              </Grid>
                              <Button variant="contained" color="success" disabled onClick={() => confirmPair(friend)}> 
                                PAIR
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                })
              }
            </Grid>
          }
          {
            filterItems('nfts').length > 0 && 
            <Grid id="nfts" container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>NFTs</Typography>
              </Grid>
              {
                filterItems('nfts').map((nft, index) => {
                  return <Grid key={index} item xl={3} lg={3} md={4} sm={6} xs={12} p={2}>
                          <Card className='dark'>
                            <CardHeader titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}
                              title={
                                <Grid item display='flex' justifyContent='center'>
                                  <Typography>{nft.name}</Typography>
                                  <Grid item display={nft.twitter ? "flex" : "none"} pl={2}>
                                    <Link href={nft.twitter} target='_blank'>
                                      <img src={twitter} style={{height: 20, width: 20}} alt='twitter'/>
                                    </Link>
                                  </Grid>
                                  <Grid item display={nft.discord ? "flex" : "none"} pl={1}>
                                    <Link href={nft.discord} target="_blank">
                                      <img src={discord} style={{height: 20, width: 20}} alt='discord'/>
                                    </Link>
                                  </Grid>
                                </Grid>
                              }
                            />
                            <CardMedia component={() =>
                                  <Grid className={classes.cardMedia} container>
                                    { nft.community && <Chip className={classes.community} label="community"/> }
                                    <img className={classes.cardMediaImage} src={nft.image} alt='NFT'/>
                                  </Grid>
                              }/>
                            <CardContent>
                              <Grid item display='flex' justifyContent='center' alignItems='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(nft.price)}</Typography>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
            </Grid>
          }
          {
            filterItems('raffles').length > 0 && 
            <Grid id="raffles" container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>Raffles</Typography>
              </Grid>
              {
                filterItems('raffles').map((raffle, index) => {
                  return <Grid key={index} item xl={3} lg={3} md={4} sm={6} xs={12} p={2}>
                          <Card className='dark'>
                            <CardHeader titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}
                              title={
                                <Grid item display='flex' justifyContent='center' alignItems='center'>
                                  <Typography>{raffle.name}</Typography>
                                  <Grid item display={raffle.twitter ? "flex" : "none"} justifySelf='center' pl={2}>
                                    <Link display='flex' href={raffle.twitter} target='_blank'>
                                      <img src={twitter} style={{height: 20, width: 20}} alt='twitter'/>
                                    </Link>
                                  </Grid>
                                  <Grid item display={raffle.discord ? "flex" : "none"} pl={1}>
                                    <Link display='flex' href={raffle.discord} target="_blank">
                                      <img src={discord} style={{height: 20, width: 20}} alt='discord'/>
                                    </Link>
                                  </Grid>
                                  <Grid item display={raffle.twitter ? "flex" : "none"}>
                                    <Tooltip title={raffle.description}>
                                      <IconButton color='secondary'>
                                        <InfoOutlined/>
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              }
                            />
                            <CardMedia component={() =>
                                <Grid className={classes.cardMedia} container>
                                  { raffle.community && <Chip className={classes.community} label="community"/> }
                                  <img className={classes.cardMediaImage} src={raffle.image} alt='NFT'/>
                                </Grid>
                            }/>
                            <CardContent>
                              <Grid item display='flex' justifyContent='center' alignItems='center' pb={2} pr={1}>
                                <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                <Typography>{commify(raffle.price)}</Typography>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid> 
                })
              }
            </Grid>
          }
          {
            filterItems('allowlists').length > 0 && 
            <Grid id="allowlists" container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>Allowlists</Typography>
              </Grid>
              {
                filterItems('allowlists').map((allowlist, index) => {
                  return <Grid key={index} item xl={3} lg={3} md={4} sm={6} xs={12} p={2}>
                    <Card className='dark'>
                      <CardHeader titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}
                        title={
                          <Grid item display='flex' justifyContent='center' alignItems='center'>
                            <Typography>{allowlist.name}</Typography>
                            <Grid item display={allowlist.twitter ? "flex" : "none"} justifySelf='center' pl={2}>
                              <Link display='flex' href={allowlist.twitter} target='_blank'>
                                <img src={twitter} style={{height: 20, width: 20}} alt='twitter'/>
                              </Link>
                            </Grid>
                            <Grid item display={allowlist.discord ? "flex" : "none"} pl={1}>
                              <Link display='flex' href={allowlist.discord} target="_blank">
                                <img src={discord} style={{height: 20, width: 20}} alt='discord'/>
                              </Link>
                            </Grid>
                            <Tooltip title={allowlist.description}>
                              <IconButton color='secondary'>
                                <InfoOutlined/>
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        }
                      />
                      <CardMedia component='img' image={allowlist.image} style={{height: 350}} alt='Allowlist'/>
                      <CardContent>
                        <Typography variant='subtitle1' color='secondary' pb={1}>{allowlist.name}</Typography>
                        <Grid item display='flex' justifyContent='center' pb={2} pr={1}>
                          <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                          <Typography>{commify(allowlist.price)}</Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                })
              }
            </Grid>
          }
          {
            filterItems('merch').length > 0 && 
            <Grid id="merch" container item xl={12} lg={12} md={12} sm={12} xs={12} pb={5}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} p={2}>
                <Typography variant='h3' color='secondary'>Merch</Typography>
              </Grid>
              {
                filterItems('merch').map((merch, index) => {
                  return <Grid key={index} item xl={3} lg={3} md={4} sm={6} xs={12} p={2} minHeight={450}>
                    <Card className='dark'>
                      <CardHeader titleTypographyProps={{variant: 'subtitle1', color: 'secondary'}}
                          title={
                            <Grid item display='flex' justifyContent='center' alignItems='center'>
                              <Typography>{merch.name}</Typography>
                              <Grid item display={merch.twitter ? "flex" : "none"} justifySelf='center' pl={2}>
                                <Link display='flex' href={merch.twitter} target='_blank'>
                                  <img src={twitter} style={{height: 20, width: 20}} alt='twitter'/>
                                </Link>
                              </Grid>
                              <Tooltip title={merch.description}>
                                <IconButton color='secondary'>
                                  <InfoOutlined/>
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          }
                        />
                      <CardMedia component={() =>
                          <Grid className={classes.cardMedia} container>
                            { merch.community && <Chip className={classes.community} label="community"/> }
                            <img className={classes.cardMediaImage} src={merch.image} alt='NFT'/>
                          </Grid>
                      }/>
                      <CardContent>
                        <Grid item display='flex' justifyContent='center' alignItems='center' pb={2} pr={1}>
                          <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                          <Typography>{commify(merch.price)}</Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                })
              }
            </Grid>
          }
        </Container>
      </Grid>
      <Modal
        open={showConfirmationModal}
        onClose={onConfirmationModalClose}
        keepMounted
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
      >
        <Box className={classes.modal}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            pb={5}
          >
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id="modal-title" variant="h4" p={3}>
                Pair Friend
              </Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton
                size="medium"
                color="inherit"
                onClick={onConfirmationModalClose}
              >
                <Close fontSize="medium" />
              </IconButton>
            </Grid>
          </Grid>
          <FormControl fullWidth>
            <Select onChange={(e) => setSelectedFrog(e.target.value)}>
              {ownedFrogs.map((frog: any) => (
                <MenuItem
                  key={frog.edition}
                  value={frog.edition}
                  className="frogSelection"
                >
                  {frog.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle1">
            Pairing you friend will give you a {selectedItem?.percentage}% boost
            but it will burn your friend item. Do you wish to proceed?
          </Typography>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button variant="contained" color="success" onClick={() => pair()}>
              Proceed
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={showPairingModal}
        onClose={() => setShowPairingModal(false)}
        keepMounted
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
      >
        <Box className={classes.modal}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            pb={5}
          >
            <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
              <Typography id="modal-title" variant="h4" p={3}>
                Pair Friend
              </Typography>
            </Grid>
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton
                size="medium"
                color="inherit"
                onClick={() => setShowPairingModal(false)}
              >
                <Close fontSize="medium" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
