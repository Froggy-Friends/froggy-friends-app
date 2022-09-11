import { createTheme, responsiveFontSizes } from '@mui/material';

const configs = {
  dark: '#181818',
  light: '#ebedf1',
  primary: '#5ea14e',
  gold: '#fece07',
  disabled: "#b3b6bb",
  white: '#ffffff'
}

export default function getTheme(isDarkMode: boolean) {
  let theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? configs.dark : configs.white
      },
      primary: {
        main: configs.primary
      },
      secondary: {
        main: isDarkMode ? configs.white : configs.dark
      },
      text: {
        primary: isDarkMode ? configs.light : configs.dark
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
            borderRadius: 25,
            height: 35,
            fontWeight: 'bold',
            ":disabled": {
              backgroundColor: configs.disabled,
              cursor: "not-allowed",
              pointerEvents: "auto"
            }
          }
        }
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            color: isDarkMode ? configs.light : configs.dark,
            backgroundColor: isDarkMode ? configs.dark : configs.light
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            color: configs.dark,
            backgroundColor: configs.light,
            width: '100%',
            textAlign: 'center',
            "&.disabled": {
              backgroundColor: "#ebedf145"
            },
            "&.inverted": {
              // backgroundColor: configs.secondary,
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
            // color: configs.secondary,
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
            // color: configs.secondary,
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
            // backgroundColor: configs.secondary,
            color: configs.dark,
            ":hover": {
              // backgroundColor: configs.secondary,
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
            // color: configs.secondary
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
            // color: configs.secondary
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