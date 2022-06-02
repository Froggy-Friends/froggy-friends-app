import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Fade, Grid, Typography, CardMedia, IconButton, Card, Button, createStyles, Theme, Modal, Backdrop } from "@mui/material";
import { commify } from "ethers/lib/utils";
import { cartItems, cartOpen, remove, toggle } from '../redux/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RibbitItem } from '../models/RibbitItem';
import CancelIcon from '@mui/icons-material/Cancel';
import ribbit from '../images/ribbit.gif';
import { Close } from '@mui/icons-material';


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
    }
  })
);


export default function Cart() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector(cartOpen);
  const items = useAppSelector(cartItems);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (items) {
      const total = items.reduce((acc, item) => { return acc + item.price}, 0);
      setTotal(total);
    }
  }, [items]);

  const onRemoveItem = (item: RibbitItem) => {
    dispatch(remove(item));
  }

  const handleClose = () => {
    dispatch(toggle());
  }

  return (
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
          <Grid item id='title-and-items'>
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
            <Grid id='cart-items' item maxHeight={500} sx={{overflowY: 'scroll', "::-webkit-scrollbar": { backgroundColor: 'transparent'}}}>
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
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                        <IconButton size='small' color='primary' onClick={() => onRemoveItem(item)} disabled={!item.isActive}>
                          <CancelIcon/>
                        </IconButton>
                      </Grid>
                  </Grid>
                })
              }
            </Grid>
          </Grid>
          <Grid item id='total-and-checkout'>
            <Grid id="total" item mr={1} p={1}>
              <Grid className={classes.cartItem} container justifyContent='space-between' xl={12} lg={12} md={12} sm={12} xs={12}>
                <Typography variant='h6' color='secondary' p={1} pl={2}>Total</Typography>
                <Grid item display='flex' justifyContent='center' alignItems='center' p={1} pr={2}>
                  <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                  <Typography>{commify(total)}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid id='checkout' container item justifyContent='center' p={1}>
              <Button variant='contained' color='success' fullWidth disabled={total === 0}>
                <Typography variant='subtitle1' color='secondary'>Checkout</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Fade> 
    </Modal>
  )
}