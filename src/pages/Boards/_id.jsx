import { Container } from '@mui/material'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '../../components/AppBar/AppBar'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailApi } from '~/apis'

// Board Detail
function Board() {

  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '682aed7da3c4bcfd85b367d1'
    fetchBoardDetailApi(boardId)
      .then((board) => {
        setBoard(board)
      })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={ board }/>
      <BoardContent board={ board }/>
    </Container>
  )
}
export default Board

// mockData.board