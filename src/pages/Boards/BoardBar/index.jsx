import { Box } from '@mui/material'

function BoardBar() {
  return (
    <div>
      <Box sx={{
        backgroundColor: '#007AC2',
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        Board Bar
      </Box>
    </div>
  )
}

export default BoardBar
