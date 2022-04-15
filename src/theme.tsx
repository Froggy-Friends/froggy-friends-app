import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    background: {
      default: '#000000'
    },
    primary: {
      main: '#ebedf1'
    },
    secondary: {
      main: '#b3b6bb'
    },
    success: {
      main: '#cfdcae'
    }
  },
  typography: {
    fontFamily: 'nunito'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ebedf1',
          backgroundColor: '#5ea14e',
          borderRadius: 25,
          fontWeight: 'bold',
          ":hover": {
            backgroundColor: '#48793c'
          }
        }
      }
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          fontSize: '1.3rem',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '8px solid #1a1b1c',
          borderRadius: 5,
          width: '100%',
          textAlign: 'center'
        }
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;