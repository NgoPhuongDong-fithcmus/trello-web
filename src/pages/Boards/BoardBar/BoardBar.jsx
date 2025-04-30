import { Avatar, AvatarGroup, Box, Button, Chip, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const boardBarStyle = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  fontWeight: 500,
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderTop: '1px solid #fff ',
      backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#2c3e50' : '#1976d2'),
      borderBottom: '1px solid #fff'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
          sx={boardBarStyle}
        />
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={boardBarStyle}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
          sx={boardBarStyle}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={boardBarStyle}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          sx={boardBarStyle}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '15px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}
        >
          <Tooltip title="Ngo Phuong Dong">
            <Avatar alt="Ngo Phuong Dong" src="https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/297533791_1479862829130608_1409595589639716606_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=SQa7YKPJfRYQ7kNvwFPky3s&_nc_oc=AdmfoEgxk2DnrlvQdmI4uYmLxcueuTojyY_PY8Scb5u_tPztTPDeF9XvIjT0yniQH_c&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=lAC2lMtqhgDM-byiDCk-Jg&oh=00_AfFVdlt7gB0NbTabbrxmbnFzlhZXiYxwFn4mGm6uR4LhEQ&oe=680C4749" />
          </Tooltip>
          <Tooltip title="Lan Anh">
            <Avatar alt="Lan Anh" src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/484849714_1193059875750084_934415388812104824_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=6ht_KYLCTy8Q7kNvwEiscrA&_nc_oc=AdlQ__VurSHfgvNqWv0PI9F3iWCrK_arEfFEwdpi-7YBJrma3oUxVZ1RUsZnEuT6GWA&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=xkP0zbQzaFgMrO3pSGO4UQ&oh=00_AfGa9o6OSPqJed4k_96M7I9ybZKF-FWpLa1fmyjpFRdajQ&oe=680C4428" />
          </Tooltip>
          <Tooltip title="Tra Giang">
            <Avatar alt="Tra Giang" src="https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/472790274_4007013252913943_7531981176001639622_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=pNT_d1I_SvYQ7kNvwHB7fSJ&_nc_oc=AdmbLh7f37KHY9Oy-trRPaim5TClzOFpTCaAKsZSWsW08k5EGg6_ecT6rDGtm1eRSSM&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=ZQq-9Fru4IuNCQag2mXJ3g&oh=00_AfGDCqVlL6Uwvu0d0-B597AOwSGajeQxUxNbZrCsyQpZmA&oe=680C42CB" />
          </Tooltip>
          <Tooltip title="Bao Ngoc">
            <Avatar alt="Bao Ngoc" src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.6435-9/178033776_232553641997489_915994129008670473_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=2pFNsvuVSoQQ7kNvwHGjOJK&_nc_oc=Admuh3R7kgHxub9tg71mGCMxtQdKStAXSAIpR6OVHZT7C4aG1PiLHfTWLmE79MZFzNw&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=D8UIlu-AvVkyd4QugBntPQ&oh=00_AfGlTBmtlys1KBfsrpdIntMfw6qddeIan-mEskDvmJOUAQ&oe=682DEB98" />
          </Tooltip>
          <Tooltip title="Bao Ngoc">
            <Avatar alt="Bao Ngoc" src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.6435-9/178033776_232553641997489_915994129008670473_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=2pFNsvuVSoQQ7kNvwHGjOJK&_nc_oc=Admuh3R7kgHxub9tg71mGCMxtQdKStAXSAIpR6OVHZT7C4aG1PiLHfTWLmE79MZFzNw&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=D8UIlu-AvVkyd4QugBntPQ&oh=00_AfGlTBmtlys1KBfsrpdIntMfw6qddeIan-mEskDvmJOUAQ&oe=682DEB98" />
          </Tooltip>
          <Tooltip title="Bao Ngoc">
            <Avatar alt="Bao Ngoc" src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.6435-9/178033776_232553641997489_915994129008670473_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=2pFNsvuVSoQQ7kNvwHGjOJK&_nc_oc=Admuh3R7kgHxub9tg71mGCMxtQdKStAXSAIpR6OVHZT7C4aG1PiLHfTWLmE79MZFzNw&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=D8UIlu-AvVkyd4QugBntPQ&oh=00_AfGlTBmtlys1KBfsrpdIntMfw6qddeIan-mEskDvmJOUAQ&oe=682DEB98" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
