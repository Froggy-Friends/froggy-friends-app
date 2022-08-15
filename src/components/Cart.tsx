import { Fragment, useEffect, useState } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Fade, Grid, Typography, CardMedia, IconButton, Button, createStyles, Theme, Modal, Backdrop, Box, Link, LinearProgress, Snackbar, useTheme, useMediaQuery } from "@mui/material";
import { BigNumber } from 'ethers';
import { commify, formatEther } from "ethers/lib/utils";
import { cartItems, cartOpen, empty, remove, toggle } from '../redux/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RibbitItem } from '../models/RibbitItem';
import { useSpendingApproved, useApproveSpender, useBundleBuy } from '../client';
import { AddShoppingCart, Check, Close, Warning } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import ribbit from '../images/ribbit.gif';
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
      backgroundColor: '#181818',
      color: '#ebedf1',
      borderRadius: 5,
      boxShadow: 24,
      p: 4,
      height: '90vh',
      [theme.breakpoints.down('md')]: {
        top: '0%',
        left: '0%',
        transform: 'none',
        height: '100%',
        width: '100%'
      }
    },
    cartItem: {
      backgroundColor: '#333333',
      color: '#ebedf1',
      alignItems: 'center',
      borderRadius: 5
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
  const theme = useTheme();
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
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      const total = items.reduce((acc, item) => { return acc + (item.price * item.amount)}, 0);
      setTotal(total);

      const etherFormat = formatEther(ribbitBalance);
      const number = +etherFormat;
      const remaining = number - total;
      setRemaining(remaining);
    }
  }, [items]);

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
      const amounts = items.map(item => item.amount);
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
          <Grid className={classes.cart} item xl={4} lg={6} md={8} sm={12} xs={12} container direction="column" justifyContent='space-between' p={2}>
            <Grid id='title' item xl={1} lg={1} md={1} sm={1} xs={1} container justifyContent='space-between' alignItems='center' pb={2}>
              <Grid item>
                <Typography variant='h4' fontWeight='bold'>Ribbit Cart</Typography>
              </Grid>
              <Grid item>
                <IconButton size='large' color='secondary' onClick={handleClose}>
                  <Close/>
                </IconButton>
              </Grid>
            </Grid>
            <Grid id='items' item xl={8} lg={8} md={8} sm={8} xs={8} maxHeight='50vh' overflow='scroll' 
              sx={{
                  "::-webkit-scrollbar": { width: 0, height: 0, backgroundColor: "transparent"}, 
                  
              }}>
              {
                items.length === 0 && 
                <Typography variant='h6' color='secondary'>
                  Click the add to cart button
                  <Button variant='contained' size='small' color='success' sx={{marginLeft: theme.spacing(1), marginRight: theme.spacing(1)}}>
                    <AddShoppingCart/>
                  </Button>
                  on any item to see it here
                </Typography>
              }
              {
                items.map((item, index) => {
                  return <Grid className={classes.cartItem} key={index} container item mb={1} xl={12} lg={12} md={12} sm={12} xs={12}>
                      <Grid id='item-image' display={isXs ? "none" : "flex"} item p={1} xl={2} lg={2} md={1} sm={1}>
                        <CardMedia component="img" image={item.image} alt={item.name}/>
                      </Grid>
                      <Grid id='item-title' item justifySelf="start" xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Typography variant='subtitle1' color='secondary' pl={1}>
                          { item.category === 'raffles' ? `${item.name} (${item.amount} tickets)` : item.name }
                        </Typography>
                      </Grid>
                      <Grid item display='flex' justifyContent='center' p={1} xl={2} lg={2} md={3} sm={3} xs={4}>
                        <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                        <Typography variant='subtitle1'>{commify(item.price * item.amount)}</Typography>
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
            <Grid id="total" item xl={2} lg={2} md={2} sm={2} xs={2} className={classes.cartItem} mt={2}>
              <Grid container item justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                <Typography variant='h6' color='secondary' p={1} pl={2}>Ribbit</Typography>
                <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                  <Typography>{formatBalance(ribbitBalance)}</Typography>
                </Grid>
              </Grid>
              <Grid container item justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                <Typography variant='h6' color='secondary' p={1} pl={2}>Cart total</Typography>
                <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                  <Typography>{commify(total.toFixed(2))}</Typography>
                </Grid>
              </Grid>
              <Grid container item justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                <Typography variant='h6' color='secondary' p={1} pl={2}>Remaining</Typography>
                <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                  <Typography>{commify(remaining.toFixed(2))}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid id='checkout' item xl={1} lg={1} md={1} sm={1} xs={1} alignSelf='center' pt={2}>
              <Button variant='contained' color='success' fullWidth disabled={isCheckoutDisabled()} onClick={checkout}>
                <Typography variant='subtitle1' color='secondary'>Checkout</Typography>
              </Button>
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
                Grant Ribbit Market Permissions {approveSpenderState.status === "Success" && <Check/>} {approveSpenderState.status === "Fail" && <Warning/>}
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