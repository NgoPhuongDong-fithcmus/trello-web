import * as React from 'react'
import { Menu, MenuItem, Box, Divider, ListItemIcon, Avatar, Tooltip, IconButton } from '@mui/material'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import logoutIcon from '../../../assets/logout.png'

function Profiles() {

  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Logging out?',
      text: 'We hope to see you again soon!',
      imageUrl: logoutIcon,
      imageWidth: 50,
      imageHeight: 50,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUserAPI())
      }
    })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profile' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 30, height: 30 }} alt='babyboy' src={currentUser?.avatar}>Đ</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile'
        }}
      >
        <MenuItem sx={{
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'primary.main'
          }
        }} >
          <Avatar sx={{ width: '28px', height: '28px', mr: 2 }} alt={currentUser?.name} src={currentUser?.avatar} /> {currentUser?.displayName || 'Profile' }
        </MenuItem>
        <Divider />
        <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'warning.dark',
              '& .logout-icon': {
                color: 'warning.dark'
              }
            }
          }}>
          <ListItemIcon>
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles