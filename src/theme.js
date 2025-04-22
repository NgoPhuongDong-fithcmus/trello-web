import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { pink, purple } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: {
    //       main: '#007AC2'
    //     }
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: {
    //       main: purple[400]
    //     }
    //   }
    // }
  },
  components: {
    CssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: 'white'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          // color: 'white',
          // '.MuiOutlinedInput-notchedOutline': {
          //   borderColor: 'white'
          // },
          // ':hover': {
          //   '.MuiOutlinedInput-notchedOutline': {
          //     borderColor: 'white'
          //   }
          // },
          // cái này để cho nó không bị đậm viền quá, vì khi dùng MUI thì nó hơi đậm so với những components khác và nhớ cú pháp của nó phải có dấu cách
          '& fieldset': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth: '2px !important'
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px !important'
          }
        }
      }
    }
  }
})

export default theme