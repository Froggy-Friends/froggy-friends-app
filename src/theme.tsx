import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    background: {
      default: '#d5e5ef'
    },
    primary: {
      main: '#1a1b1c'
    },
    secondary: {
      main: '#dedede'
    }
  },
  typography: {
    fontFamily: 'Billy, Outfit-Light'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#1a1b1c',
          backgroundColor: '#ffffff',
          borderRadius: 5,
          border: '1px solid #1a1b1c',
          fontWeight: 'bold',
          ":hover": {
            backgroundColor: '#dedede'
          }
        }
      }
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          fontSize: '1.3rem'
        }
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;