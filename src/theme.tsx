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
    fontFamily: ''
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#1a1b1c',
          backgroundColor: '#dedede',
          borderRadius: 50,
          fontWeight: 'bold'
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