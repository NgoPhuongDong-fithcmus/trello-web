import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { pink, purple } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#007AC2'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: purple[400]
        }
      }
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.875rem',
          color: theme.palette.primary.main
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.875rem',
          color: theme.palette.primary.main,
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          },
          ':hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            },
            // cái này để cho nó không bị đậm viền quá, vì khi dùng MUI thì nó hơi đậm so với những components khác
            '& filedset': {
              borderWidth: '1px !important'
            }
          }
        })
      }
    }
  }
})

export default theme