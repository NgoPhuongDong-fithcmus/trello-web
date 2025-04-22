import { Box } from '@mui/material'
function BoardContent() {
  return (
    <div>
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#2c3e50' : '#1976d2'),
        width: '100%',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Box column */}
        <Box sx={{
          minWidth: '300px',
          maxWidth: '300px',
          backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px'
        }}>

        </Box>
      </Box>
    </div>
  )
}

export default BoardContent
