import { Badge, Box, Button, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
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
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
function AppBar() {
  const [searchValue, setSearchValue] = useState('')
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
          <AppsIcon
            sx={{
              color: 'white'
            }}
          />
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
          <TextField
            id="outlined-search"
            label="Search"
            type="text"
            size='small'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color: searchValue ? 'white' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSearchValue('')}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: '120px',
              maxWidth: '180px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white'
                },
                '&:hover fieldset': {
                  borderColor: 'white'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white'
                }
              }
            }}
          />
          <SelectMode/>
          <Tooltip title="Notifications">
            <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }} >
              <NotificationsNoneIcon sx={{ color: 'white' }}/>
            </Badge>
          </Tooltip>
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
