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
    },
    warning: {
      main: '#BFB85D'
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
          },
          "&.transparent": {
            backgroundColor: "#000000d1",
            borderRadius: 5,
            textTransform: 'capitalize',
            ":hover": {
              color: "#5ea14e"
            }
          }
        }
      }
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          fontSize: '1.3rem',
          backgroundColor: '#BFB85D',
          color: '#181818'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          color: '#ebedf1',
          width: '100%',
          textAlign: 'center',
          "&.disabled": {
            backgroundColor: "#ebedf145"
          },
          "&.inverted": {
            backgroundColor: "#ebedf1",
            color: "#181818",
            width: 350
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
          fontSize: '1rem',
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
          backgroundColor: "#181818",
          "&.MuiDrawer-paper": {
            width: '100%',
            maxWidth: 425
          } 
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltipPlacementBottom: {
          backgroundColor: '#181818',
          color: '#ebedf1'
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "&.scrollable": {
            "::-webkit-scrollbar": {
              width: 5,
              height: 5,
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
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#fece07',
          color: 'black'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          input: {
            textAlign: 'center',
            color: 'white'
          }
        }
      }
    }
  }
});

theme = responsiveFontSizes(theme);

export default theme;