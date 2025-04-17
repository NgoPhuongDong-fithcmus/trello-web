import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { pink, purple } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: pink[300]
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
  }
})

export default theme