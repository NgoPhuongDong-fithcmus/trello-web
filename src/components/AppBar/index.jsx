import { Badge, Box, Button, TextField, Tooltip, Typography } from '@mui/material'
import SelectMode from '../ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Workspaces from './Menu/Workspaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menu/Profiles'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
function AppBar() {
  return (
    <div>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AppsIcon sx={{ color: '#007AC2' }}/>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: '#007AC2', fontSize: 'small' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007AC2' }} >Trello</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Workspaces/>
            <Recent/>
            <Starred/>
            <Templates/>
            <Button variant="outlined" startIcon={<AddToPhotosIcon/>}>Create</Button>
          </Box>


        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField id="outlined-search" label="Search..." type="search" size='small' sx={{ minWidth: '120px' }}/>
          <SelectMode/>
          <Tooltip title="Notifications">
            <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }} >
              <NotificationsNoneIcon sx={{ color: '#007AC2' }}/>
            </Badge>
          </Tooltip>
          <Tooltip title="Helps">
            <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }} >
              <HelpOutlineIcon sx={{ color: '#007AC2' }}/>
            </Badge>
          </Tooltip>
          <Profiles/>
        </Box>
      </Box>
    </div>
  )
}

export default AppBar
