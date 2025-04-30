import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
function BoardContent({ board }) {
  const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx={{
      backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#2c3e50' : '#1976d2'),
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      p: '10px 0'
    }}>
      <ListColumns columns={orderedColumn}/>
    </Box>
  )
}

export default BoardContent
