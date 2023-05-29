import { ChangeEvent, useState } from 'react';
import { Button, FormControl, FormControlLabel, IconButton, Snackbar, Stack, Switch, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import { Upgrade } from '../../models/Upgrade';
import { Close } from '@mui/icons-material';
import { AdminUpgradeRequest } from '../../models/AdminUpgradeRequest';

declare var window: any;

interface UpgradeRequest {
  frogId: number;
  itemId: number;
  wallet: string;
  transaction: string;
  account: string;
}

export default function ManualUpgrades() {
  const { account } = useEthers();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [upgrade, setUpgrade] = useState<UpgradeRequest>({
    frogId: 0,
    itemId: 0,
    wallet: '',
    transaction: '',
    account: `${account}`
  });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUpgrade({
      ...upgrade,
      [event.target.name]: event.target.value
    });
  }

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const onUpgradeSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // prompt admin signature
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const message = JSON.stringify(upgrade);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const upgradeRequest: AdminUpgradeRequest = {
        ...upgrade,
        message: message,
        signature: signature
      }

      const apiUrl = process.env.REACT_APP_FROGGY_FACTORY;
      const response = (await axios.post<Upgrade>(`${apiUrl}/upgrade`, upgradeRequest));
      if (response.status === 201) {
        setAlertMessage('Upgrade started');
        setShowAlert(true);
      }
    } catch (error) {
        setAlertMessage('Error starting upgrade ' + error);
        setShowAlert(true);
    }
  }

  return (
    <Stack>
      <form onSubmit={onUpgradeSubmit}>
        <Stack spacing={5}>
          <Typography variant='h4'>Manual Trait Upgrade</Typography>
          <TextField id='frogId' label="Frog ID" name="frogId" variant="outlined" fullWidth value={upgrade.frogId} onChange={onInputChange} />
          <TextField id='itemId' label="Item ID" name="itemId" variant="outlined" fullWidth value={upgrade.itemId} onChange={onInputChange} />
          <TextField id='wallet' label="Wallet" name="wallet" variant="outlined" fullWidth value={upgrade.wallet} onChange={onInputChange} />
          <TextField id='transaction' label="Transaction" name="transaction" variant="outlined" fullWidth value={upgrade.transaction} onChange={onInputChange} />
          <Button type="submit" variant='contained' color="primary">
              <Typography>Submit</Typography>
          </Button>
        </Stack>
      </form>
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
    </Stack>
  )
}