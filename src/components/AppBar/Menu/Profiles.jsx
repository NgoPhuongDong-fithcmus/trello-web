import * as React from 'react'
import { Button, Menu, MenuItem, Box, Divider, ListItemText, ListItemIcon, Avatar, Tooltip, IconButton } from '@mui/material'
import Check from '@mui/icons-material/Check'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
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
          <Avatar sx={{ width: 30, height: 30 }} alt='babyboy' src='https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-1/297533791_1479862829130608_1409595589639716606_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=SQa7YKPJfRYQ7kNvwF7kUjQ&_nc_oc=AdmvCDr6wKUmCOEbtBhFN4skwTwjIFomY9plD8oby6cKTwk_uPsj7zbUaxX2E_5t4B8&_nc_zt=24&_nc_ht=scontent.fsgn5-3.fna&_nc_gid=vO14b05rlQhNb97UFK07Tg&oh=00_AfFdB5jjw7HFlX_2IK3oQbkb0XzZt0guCuDEy9rsGhrK9g&oe=6808F24B'>M</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile'
        }}
      >
        <MenuItem >
          <Avatar sx={{ width: '28px', height: '28px', mr: 2 }} /> Profile
        </MenuItem>
        <MenuItem >
          <Avatar sx={{ width: '28px', height: '28px', mr: 2 }}/> My account
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
        <MenuItem >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles