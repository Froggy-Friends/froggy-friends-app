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
    },
    success: {
      main: '#cfdcae'
    }
  },
  typography: {
    fontFamily: ['billy', 'outfit', 'sans-serif'].join(',')
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#1a1b1c',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '4px solid #1a1b1c',
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
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: 'outfit'
        }
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;