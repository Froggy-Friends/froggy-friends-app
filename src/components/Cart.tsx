import { Fragment, useEffect, useState } from 'react';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { makeStyles } from '@mui/styles';
import { Fade, Grid, Typography, IconButton, Button, createStyles, Theme, Modal, Backdrop, Box, Link, LinearProgress, Snackbar, useTheme, useMediaQuery, Paper, Stack, TableContainer, Table, TableBody, TableRow, TableCell } from "@mui/material";
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
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
      borderRadius: 5,
      boxShadow: 24,
      p: 4,
      height: '90%',
      width: '40%',
      [theme.breakpoints.down('lg')]: {
        width: '50%'
      },
      [theme.breakpoints.down('md')]: {
        width: '60%'
      },
      [theme.breakpoints.down('sm')]: {
        top: '0%',
        left: '0%',
        transform: 'none',
        height: '100%',
        width: '100%'
      }
    },
    items: {
      height: '60%'
    },
    itemImage: {
      borderRadius: 5,
      height: 120,
      width: 120,
      [theme.breakpoints.down(425)]: {
        height: 80,
        width: 80,
      },
    },
    removeButton: {
      height: 30,
      width: 100
    },
    summary: {
      height: '100%'
    },
    row: {
      padding: 0,
      border: 0,
      '& td, th': {
        padding: '1rem 0',
        border: 0
      },

      '& th, h5': {
        fontWeight: 'bold'
      }
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
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
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelow425 = useMediaQuery(theme.breakpoints.down(425));
  const isBelow375 = useMediaQuery(theme.breakpoints.down(375));
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
    return commify(number.toFixed(0));
  }

  const formatPrice = (item: RibbitItem) => {
    return commify(item.price * item.amount);
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
        <Fade id='cart' in={isCartOpen} style={{overflowY: 'scroll'}}>
          <Stack className={classes.cart} direction="column" p={isXs ? 2 : 5}>
            <Grid id='title' container item justifyContent='space-between' alignItems='center' pb={5}>
              <Grid item>
                <Typography variant='h4' fontWeight='bold'>Ribbit Cart</Typography>
              </Grid>
              <Grid item>
                <Paper elevation={3} sx={{borderRadius: 25}}>
                  <IconButton className="cta" size='small' onClick={handleClose}>
                    <Close/>
                  </IconButton>
                </Paper>
              </Grid>
            </Grid>
            <Stack id='items' className={classes.items} spacing={1} pb={2}>
              {
                items.length === 0 && 
                <Typography variant='h6' color='secondary'>
                  Click the <Button variant='contained'>Add to cart</Button> button on any item to place it in your cart.
                </Typography>
              }
              <TableContainer className="hidden-scrollbar" component={Paper} elevation={0}>
                <Table aria-label='items-table'>
                  <TableBody>
                    {items.map((item,index) => (
                      <TableRow key={index} className={classes.row}>
                        <TableCell>
                          <Stack direction='row' spacing={isXs ? 2 : 5}>
                            <img className={classes.itemImage} src={item.image} alt={item.name}/>
                            
                            <Stack id='row-info' width='100%' justifyContent='space-between'>
                              <Typography>{ item.name }</Typography>
                              {
                                isBelow375 && item.category === 'raffles' && <Typography>{`${item.amount} tickets`}</Typography>
                              }
                              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                <Stack direction='row' alignItems='center'>
                                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                                  <Typography variant='subtitle1' pr={2}>{formatPrice(item)}</Typography>
                                  {
                                    !isBelow375 && item.category === 'raffles' && <Typography>{`${item.amount} tickets`}</Typography>
                                  }
                                </Stack>
                                {
                                  isBelow425 && 
                                  <IconButton size='small' color='secondary' onClick={() => onRemoveItem(item)}>
                                    <CancelIcon/>
                                  </IconButton>
                                }
                              </Stack>
                              {
                                !isBelow425 && 
                                <Button className={classes.removeButton} variant='contained' color='inherit' onClick={() => onRemoveItem(item)}>
                                  <Typography>Remove</Typography>
                                </Button>
                              }
                            </Stack>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </TableContainer>
            </Stack>

            {
              !isCheckoutDisabled() &&
              <Stack className={classes.summary} id="summary" pb={5} spacing={3}>
                <Typography variant='h6' fontWeight='bold'>Order Summary</Typography>
                <Stack> 
                  <Stack direction='row'>
                    <Typography width={150}>{items.length + ' items'}</Typography>
                    <Stack direction='row'>
                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                      <Typography id='balance'>{formatBalance(ribbitBalance)} {isBelow375 ? 'Bal.' : 'Balance'}</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction='row'>
                    <Typography width={150}>{commify(total.toFixed(0))} Ribbit Total</Typography>
                    <Stack direction='row'>
                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                      <Typography id='remaining'>{commify(remaining.toFixed(0))} {isBelow375 ? 'Rem.' : 'Remaining'}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Button variant='contained' disabled={isCheckoutDisabled()} onClick={checkout} sx={{width: 120, height: 35}}>
                  <Typography>Order</Typography>
                </Button>
              </Stack>
            }
            {
              !account && items.length > 0 &&
              <Typography>Login to checkout.</Typography>
            }
          </Stack>
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
      <Snackbar open={showAlert} autoHideDuration={5000} message={alertMessage} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={onAlertClose}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={onAlertClose}>
            <Close fontSize='small' />
          </IconButton>
        }/>
    </Fragment>
  )
}