import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    background: {
      default: ''
    },
    primary: {
      main: ''
    },
    secondary: {
      main: ''
    }
  },
  typography: {
    fontFamily: ''
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '',
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