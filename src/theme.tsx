import { createTheme, responsiveFontSizes } from '@mui/material';

const configs = {
  dark: '#181818',
  primary: '#5ea14e',
  secondary: '#ebedf1',
  gold: '#fece07'
}

export default function setTheme(isDarkMode: boolean) {
  let theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: configs.dark
      },
      primary: {
        main: configs.primary
      },
      secondary: {
        main: configs.secondary
      },
      info: {
        main: configs.dark
      }
    },
    typography: {
      fontFamily: 'nunito'
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
            backgroundColor: configs.dark,
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
            color: configs.secondary,
            backgroundColor: configs.primary,
            borderRadius: 25,
            height: 35,
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
                color: configs.primary
              }
            },
            "&.inverted": {
              backgroundColor: configs.secondary,
              color: configs.dark
            },
            "&.inverted:hover": {
              color: configs.primary
            }
          }
        }
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            fontSize: '1.3rem',
            backgroundColor: configs.dark,
            color: configs.secondary
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'black',
            color: configs.secondary,
            width: '100%',
            textAlign: 'center',
            "&.disabled": {
              backgroundColor: "#ebedf145"
            },
            "&.inverted": {
              backgroundColor: configs.secondary,
              color: configs.dark,
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
                color: configs.primary
              }
            }
          }
        }
      },
      MuiLink: {
        styleOverrides: {
          root: {
            ":hover": {
              color: configs.primary
            }
          }
        }
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            color: configs.secondary,
            fontWeight: "bold",
            "&.Mui-selected": {
              color: configs.primary
            }
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: configs.secondary,
            fontSize: '1rem',
            alignItems: 'start',
            padding: 24,
            "&.Mui-selected": {
              color: configs.primary,
              fontWeight: 'bold'
            },
          },
        }
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minWidth: 200,
            color: configs.primary
          }
        }
      },
      MuiFab: {
        styleOverrides: {
          root: {
            backgroundColor: configs.secondary,
            color: configs.dark,
            ":hover": {
              backgroundColor: configs.secondary,
              color: configs.primary
            }
          }
        }
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            overflowY: 'scroll',
            backgroundColor: 'black',
            "::-webkit-scrollbar": {
              width: 8,
              height: 8,
              backgroundColor: 'black'
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: configs.primary,
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
            color: configs.secondary
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: configs.dark,
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
            backgroundColor: configs.dark,
            color: configs.secondary
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
                backgroundColor: configs.dark
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: configs.primary,
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
            backgroundColor: configs.gold,
            color: configs.dark
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

  return theme;
}