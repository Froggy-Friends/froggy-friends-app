import { Fragment, useEffect, useState } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Fade, Grid, Typography, CardMedia, IconButton, Button, createStyles, Theme, Modal, Backdrop, Box, Link, LinearProgress, Snackbar } from "@mui/material";
import { BigNumber } from 'ethers';
import { commify, formatEther } from "ethers/lib/utils";
import { cartItems, cartOpen, empty, remove, toggle } from '../redux/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RibbitItem } from '../models/RibbitItem';
import { useSpendingApproved, useApproveSpender, useBundleBuy } from '../client';
import { Check, Close, Warning } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import ribbit from '../images/ribbit.gif';
import useWindowDimensions from '../hooks/useWindowDimensions';
import please from '../images/plz.png';
import hype from '../images/hype.png';
import uhhh from '../images/uhhh.png';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    cart: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      backgroundColor: theme.palette.common.white,
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      minHeight: 500,
      [theme.breakpoints.down('md')]: {
        top: '0%',
        left: '0%',
        transform: 'none',
        height: '100%',
        width: '100%'
      }
    },
    cartItem: {
      backgroundColor: '#181818',
      color: '#ebedf1',
      alignItems: 'center'
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: '#cfdcae',
      color: theme.palette.background.default,
      border: '2px solid #000',
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    }
  })
);


export default function Cart() {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector(cartOpen);
  const items = useAppSelector(cartItems);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { account } = useEthers();
  const ribbitBalance: BigNumber = useTokenBalance(process.env.REACT_APP_RIBBIT_CONTRACT, account) || BigNumber.from(0);
  const isSpendingApproved = useSpendingApproved(account ?? '');
  const { approveSpender, approveSpenderState } = useApproveSpender();
  const { bundleBuy, bundleBuyState } = useBundleBuy();
  
  
  useEffect(() => {
    if (approveSpenderState.status === "Exception" || approveSpenderState.status === "Fail") {
      console.log("approve spender error: ", approveSpenderState.errorMessage);
      if (approveSpenderState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(approveSpenderState.errorMessage.replace(/^execution reverted:/i, ''));
      } else {
        setAlertMessage(approveSpenderState.errorMessage);
      }

      setShowAlert(true);
    } else if (approveSpenderState.status === "Mining") {
      setShowPurchaseModal(true);
      dispatch(toggle(false));
    }
  }, [approveSpenderState])

  useEffect(() => {
    if (bundleBuyState.status === "Exception" || bundleBuyState.status === "Fail") {
      console.log("approve spender error: ", bundleBuyState.errorMessage);
      if (bundleBuyState.errorMessage?.includes("execution reverted")) {
        setAlertMessage(bundleBuyState.errorMessage.replace(/^execution reverted:/i, ''));
      } else {
        setAlertMessage(bundleBuyState.errorMessage);
      }

      setShowAlert(true);
      dispatch(toggle(true));
    } else if (bundleBuyState.status === "Mining") {
      dispatch(toggle(false));
      setShowPurchaseModal(true);
    } else if (bundleBuyState.status === "Success") {
      dispatch(empty());
      dispatch(toggle(false));
    }
  }, [bundleBuyState])

  useEffect(() => {
    if (items) {
      const total = items.reduce((acc, item) => { return acc + item.price}, 0);
      setTotal(total);

      const etherFormat = formatEther(ribbitBalance);
      const number = +etherFormat;
      const remaining = number - total;
      setRemaining(remaining);
    }
  }, [items]);

  const getItemsHeight = () => {
    if (height < 500) {
      return 200;
    } else if (height < 800) {
      return 400;
    } else if (height < 1000) {
      return 500;
    } else {
      return 600;
    }
  }

  const onRemoveItem = (item: RibbitItem) => {
    dispatch(remove(item));
  }

  const handleClose = () => {
    dispatch(toggle(false));
  }

  const formatBalance = (balance: BigNumber) => {
    const etherFormat = formatEther(balance);
    const number = +etherFormat;
    return commify(number.toFixed(2));
  }

  const onPurchaseModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'backdropClick') {
      setShowPurchaseModal(false);
    }
  }

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const isCheckoutDisabled = () => {
    if (total === 0 || remaining < 0) {
      return true;
    } else if (!account) {
      return true;
    } else {
      return false;
    }
  }

  const checkout = async () => {
    try {
      // check ribbit item is granted approval to spend ribbit
      if (!isSpendingApproved) {
        // request unlimited spending approval
        await approveSpender(process.env.REACT_APP_RIBBIT_ITEM_CONTRACT, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      }

      // buy bundle items
      const ids = items.map(item => item.id);
      const amounts = Array(items.length).fill(1);
      await bundleBuy(ids, amounts);
    } catch (error) {
      console.log("checkout error: ", error);
      setAlertMessage("Checkout error");
      setShowAlert(true);
    }
  }

  return (
    <Fragment>
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isCartOpen}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        <Fade id='cart' in={isCartOpen}>
          <Grid className={classes.cart} container item direction="column" justifyContent='space-between' p={2} xl={3} lg={4} md={5} sm={12} xs={12}>
            <Grid item id='title-and-items' xs={height < 500 ? 8 : 9}>
              <Grid id='title' container item justifyContent='space-between' alignItems="center" pb={3}>
                <Grid item>
                  <Typography variant='h4' color='info' fontWeight='bold'>Ribbit Cart</Typography>
                </Grid>
                <Grid item>
                  <IconButton size='large' color='info' onClick={handleClose}>
                    <Close/>
                  </IconButton>
                </Grid>
              </Grid>
              <Grid id='cart-items' item minHeight={getItemsHeight} maxHeight={getItemsHeight} sx={{overflowY: 'scroll', "::-webkit-scrollbar": { backgroundColor: 'transparent'}}}>
                {
                  items.map((item, index) => {
                    return <Grid className={classes.cartItem} key={index} container item mb={1} xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Grid id='item-image' item p={1} xl={2} lg={2} md={1} sm={1} xs={2}>
                          <CardMedia component="img" image={item.image} alt={item.name}/>
                        </Grid>
                        <Grid id='item-title' item justifySelf="start" xl={5} lg={5} md={5} sm={5} xs={4}>
                          <Typography variant='subtitle1' color='secondary' pl={2}>{item.name}</Typography>
                        </Grid>
                        <Grid item display='flex' p={1} xl={3} lg={3} md={4} sm={4} xs={4}>
                          <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                          <Typography variant='subtitle1'>{commify(item.price)}</Typography>
                        </Grid>
                        <Grid item textAlign='center' xl={2} lg={2} md={2} sm={2} xs={2}>
                          <IconButton size='small' color='primary' onClick={() => onRemoveItem(item)}>
                            <CancelIcon/>
                          </IconButton>
                        </Grid>
                    </Grid>
                  })
                }
              </Grid>
            </Grid>
            <Grid item id='total-and-checkout' xs={height < 500 ? 4 : 3}>
              <Grid id="total" item mr={1} p={1}>
                <Grid className={classes.cartItem} container item justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Typography variant='h6' color='secondary' p={1} pl={2}>Ribbit balance</Typography>
                  <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                    <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                    <Typography>{formatBalance(ribbitBalance)}</Typography>
                  </Grid>
                </Grid>
                <Grid className={classes.cartItem} container item justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Typography variant='h6' color='secondary' p={1} pl={2}>Cart total</Typography>
                  <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                    <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                    <Typography>{commify(total.toFixed(2))}</Typography>
                  </Grid>
                </Grid>
                <Grid className={classes.cartItem} container item justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Typography variant='h6' color='secondary' p={1} pl={2}>Remaining</Typography>
                  <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                    <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                    <Typography>{commify(remaining.toFixed(2))}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid id='checkout' container item justifyContent='center' p={1}>
                <Button variant='contained' color='success' fullWidth disabled={isCheckoutDisabled()} onClick={checkout}>
                  <Typography variant='subtitle1' color='secondary'>Checkout</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Fade> 
      </Modal>
      <Modal open={showPurchaseModal} onClose={onPurchaseModalClose} keepMounted aria-labelledby='confirmation-title' aria-describedby='confirmation-description'>
        <Box className={classes.modal}>
          <Grid container justifyContent='space-between' alignItems='center' pb={5}>
            {
              !isSpendingApproved && 
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                <Typography id='modal-title' variant="h4" p={3}>Granting Permissions</Typography>
              </Grid>
            }
            {
              isSpendingApproved && 
              <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                { bundleBuyState.status === "None" && <Typography id='modal-title' variant="h4" p={3}>Sign Purchase</Typography>}
                { bundleBuyState.status === "PendingSignature" && <Typography id='modal-title' variant="h4" p={3}>Sign Purchase</Typography>}
                { bundleBuyState.status === "Mining" && <Typography id='modal-title' variant="h4" p={3}>Purchase Pending</Typography>}
                { bundleBuyState.status === "Success" && <Typography id='modal-title' variant="h4" p={3}>Ribbit Items Purchased!</Typography>}
                { bundleBuyState.status === "Fail" && <Typography id='modal-title' variant="h4" p={3}>Purchase Failed</Typography>}
                { bundleBuyState.status === "Exception" && <Typography id='modal-title' variant="h4" p={3}>Purchase Failed</Typography>}
              </Grid>
            }
            <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
              <IconButton size='medium' color='inherit' onClick={onPurchaseModalClose}>
                <Close fontSize='medium'/>
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' p={3}>
            <Grid item>
              { bundleBuyState.status === "Success" && <img src={hype} style={{height: 100, width: 100}} alt='hype'/> }
              { bundleBuyState.status === "Mining" && <img src={please} style={{height: 100, width: 100}} alt='please'/> }
              { bundleBuyState.status === "Fail" && <img src={uhhh} style={{height: 100, width: 100}} alt='uhhh'/> }
            </Grid>
          </Grid>
          {
            !isSpendingApproved && 
            <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${approveSpenderState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
              <Typography id='modal-description' variant="h6" p={3}>
                Grant Ribbit Prime Permissions {approveSpenderState.status === "Success" && <Check/>} {approveSpenderState.status === "Fail" && <Warning/>}
              </Typography>
            </Link>
          }
          {
            isSpendingApproved && 
            <Link href={`${process.env.REACT_APP_ETHERSCAN}/tx/${bundleBuyState.transaction?.hash}`} target='_blank' sx={{cursor: 'pointer'}}>
              <Typography id='modal-description' variant="h6" p={3}>
                Purchase transaction {bundleBuyState.status === "Success" && <Check/>} {bundleBuyState.status === "Fail" && <Warning/>}
              </Typography>
            </Link>
          }
          { (approveSpenderState.status === "Mining" || bundleBuyState.status === "Mining") && <LinearProgress  sx={{margin: 2}}/>}
        </Box>
      </Modal>
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
    </Fragment>
  )
}