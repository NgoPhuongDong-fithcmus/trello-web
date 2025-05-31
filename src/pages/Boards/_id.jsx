import { Container } from '@mui/material'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '../../components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'
import { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import {
  updateBoardDetailApi,
  updateColumnDetailApi,
  moveCardsToDifferentColumnApi
} from '~/apis'
import { fetchBoardDetailApi, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoading from '~/components/Loading/PageLoading'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

// Board Detail
function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)
  const { boardId } = useParams()
  useEffect(() => {
    dispatch(fetchBoardDetailApi(boardId))

  }, [dispatch, boardId])

  // Xử lí kéo thả column và cập nhật api
  const moveColumnsUpdateAPI = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns= dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi api để update Board
    updateBoardDetailApi(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // Khi chuyển card trong cùng column: Gọi API để cập nhật cardOrderIds của column chứa nó
  const moveCardsInSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnUpdateCards = newBoard.columns.find(column => column._id === columnId)

    if (columnUpdateCards) {
      columnUpdateCards.cards = dndOrderedCards
      columnUpdateCards.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API để update column
    updateColumnDetailApi(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // Khi chuyển card sang column khác:
  // + Cập nhật cardOrderIds của column ban đầu chứa nó
  // + Cập nhật cardOrderIds của column sẽ chứa nó
  // + Cập nhật lại columnId của card đã kéo
  // => Gọi API để xử lí
  const moveCardsToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns= dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // fix bug khi khi kéo hết card của 1 column thì khi kéo lại sẽ không gọi được api vì thẻ PlaceholderCard nên nó sẽ đẩy dữ liệu cho backend bị sai. Vì vậy phải xóa PlaceholderCard trước khi gửi cho BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = []
    }
    // Gọi API để xử lí phía BE
    moveCardsToDifferentColumnApi({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <PageLoading content='Loading, Please waiting...' />
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Hiển thị ActiveCard nếu có */}
      { activeCard && <ActiveCard /> }
      {/* <ActiveCard /> */}
      <AppBar/>
      <BoardBar board={ board }/>
      <BoardContent
        board={ board }

        // createNewColumn={createNewColumn}
        // createNewCard={createNewCard}
        // deleteColumn={deleteColumn}

        moveColumnsUpdateAPI={moveColumnsUpdateAPI}
        moveCardsInSameColumn={moveCardsInSameColumn}
        moveCardsToDifferentColumn={moveCardsToDifferentColumn}
      />
    </Container>
  )
}
export default Board

// mockData.board