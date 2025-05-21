import { Container } from '@mui/material'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '../../components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { fetchBoardDetailApi, createNewColumnAPI, createNewCardAPI } from '~/apis'

// Board Detail
function Board() {

  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '682c0919afc67a30e3ed89d1'
    fetchBoardDetailApi(boardId)
      .then((board) => {
        // xu li keo tha vao column rong moi tao de khoi can f5 trang web
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceHolderCard(column)]
            column.cardOrderIds = [generatePlaceHolderCard(column)._id]
          }
        })
        // end xu li keo tha vao column rong moi tao de khoi can f5 trang web
        setBoard(board)
      })
  }, [])

  // gọi api tạo mới column và cập nhật dữ liệu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // xử lí khi vừa mới tạo column thì có thể kéo thả liền
    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]
    // end xử lí khi vừa mới tạo column thì có thể kéo thả liền

    // cap nhat state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // gọi api tạo mới card và cập nhật dữ liệu state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // cap nhat state board
    const newBoard = { ...board }
    const columnUpdateCards = newBoard.columns.find(column => column._id === createdCard.columnId)

    if (columnUpdateCards) {
      columnUpdateCards.cards.push(createdCard)
      columnUpdateCards.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
    //end cap nhat state board
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={ board }/>
      <BoardContent board={ board } createNewColumn={createNewColumn} createNewCard={createNewCard}/>
    </Container>
  )
}
export default Board

// mockData.board