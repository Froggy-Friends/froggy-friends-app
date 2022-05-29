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
    },
    info: {
      main: '#181818'
    }
  },
  typography: {
    fontFamily: 'nunito',
    h6: {
      color: 'black'
    }
  },
  transitions: {
    duration: {
      enteringScreen: 750,
      leavingScreen: 750
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#181818",
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          minHeight: 1500
        }
      }
    },
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
            backgroundColor: "#b3b6bb",
            cursor: "not-allowed",
            pointerEvents: "auto"
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
          border: '5px solid #1a1b1c',
          backgroundColor: '#181818',
          color: '#ebedf1',
          width: '100%',
          textAlign: 'center',
          "&.disabled": {
            backgroundColor: "#ebedf145"
          },
          "&.inverted": {
            border: 'none',
            backgroundColor: "#ebedf1",
            color: "#181818"
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.link": {
            cursor: "pointer",
            ":hover": {
              color: "#5ea14e"
            }
          }
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
          backgroundColor: "#00000099"
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: "#ebedf1",
          fontWeight: "bold",
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
          padding: 24,
          "&.Mui-selected": {
            color: "#5ea14e",
            fontWeight: 'bold'
          },
        },
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minWidth: 200,
          color: '#5ea14e'
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "#ebedf1",
          color: "#181818",
          ":hover": {
            backgroundColor: "#ebedf1",
            color: "#5ea14e"
          }
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowY: 'scroll',
          backgroundColor: "#00000099",
          "::-webkit-scrollbar": {
            width: 8,
            height: 8,
            backgroundColor: "#181818"
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#5ea14e",
            borderRadius: 5,
            height: 50,
            width: 50
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#ebedf1"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#181818"
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltipPlacementBottom: {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "::-webkit-scrollbar": {
            width: 8,
            height: 8,
            backgroundColor: "#181818"
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#5ea14e",
            borderRadius: 5,
            height: 50,
            width: 50
          }
        }
      }
    },
    
  }
});

theme = responsiveFontSizes(theme);

export default theme;