import { Box } from '@mui/material'
import SelectMode from '../ModeSelect'

function AppBar() {
  return (
    <div>
      <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        <SelectMode/>
      </Box>
    </div>
  )
}

export default AppBar
