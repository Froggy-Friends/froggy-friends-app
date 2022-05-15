import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    background: {
      default: '#000000'
    },
    primary: {
      main: '#5ea14e'
    },
    secondary: {
      main: '#ebedf1'
    },
    success: {
      main: '#cfdcae'
    }
  },
  typography: {
    fontFamily: 'nunito',
    h6: {
      color: 'black'
    }
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
          },
          ":disabled": {
            backgroundColor: "#b3b6bb"
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
    },
    MuiLink: {
      styleOverrides: {
        root: {
          ":hover": {
            color: '#5ea14e'
          }
        }
      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "#0000008a"
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: "#ebedf1",
          "&.Mui-selected": {
            color: "#5ea14e"
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#ebedf1",
          fontSize: '1.2rem',
          alignItems: 'start',
          "&.Mui-selected": {
            color: "#5ea14e"
          },
        },
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minWidth: 200
        }
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;