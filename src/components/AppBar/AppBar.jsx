import { Badge, Box, Button, Tooltip, Typography } from '@mui/material'
import SelectMode from '../ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Workspaces from './Menu/Workspaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menu/Profiles'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
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
        overflowX: 'auto',
        backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#2c3e50' : '#007AC2')
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to='/boards'>
            <AppsIcon
              sx={{
                color: 'white',
                verticalAlign: 'middle'
              }}
            />
          </Link>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SvgIcon component={TrelloIcon} inheritViewBox sx={(theme) => ({
                color: theme.palette.mode === 'dark'
                  ? '#ecf0f1' : '#001f3f',
                '& path': {
                  fill: 'white'
                },
                fontSize: 'small'
              })} />
              <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} >Trello</Typography>
            </Box>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Workspaces/>
            <Recent/>
            <Starred/>
            <Templates/>
            <Button
              sx={{
                color: 'white',
                border: 'none',
                '&:hover': { border: 'none' }
              }}
              variant="outlined"
              startIcon={<AddToPhotosIcon/>}
            >
                Create
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoCompleteSearchBoard/>
          <SelectMode/>
          <Notifications/>
          <Tooltip title="Helps">
            <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }} >
              <HelpOutlineIcon sx={{ color: 'white' }}/>
            </Badge>
          </Tooltip>
          <Profiles/>
        </Box>
      </Box>
    </div>
  )
}

export default AppBar
