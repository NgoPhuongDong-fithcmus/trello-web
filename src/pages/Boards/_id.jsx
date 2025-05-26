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

// Board Detail
function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()
  useEffect(() => {
    // const boardId = '682c0919afc67a30e3ed89d1'
    dispatch(fetchBoardDetailApi(boardId))
    // fetchBoardDetailApi(boardId).then((board) => {

    //   board.columns = mapOrder(board?.columns, board.columnOrderIds, '_id')


    //   board.columns.forEach(column => {
    //   // xu li keo tha vao column rong moi tao de khoi can f5 trang web
    //     if (isEmpty(column.cards)) {
    //       column.cards = [generatePlaceHolderCard(column)]
    //       column.cardOrderIds = [generatePlaceHolderCard(column)._id]
    //     }
    //     else {
    //       // Sắp xếp thứ tự cards ở đây luôn trước khi đưa xuống các component con (fix bug quan trọng khi kéo thả cards trong cùng column lần đầu)
    //       column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id' )
    //     }
    //   })
    //   // end xu li keo tha vao column rong moi tao de khoi can f5 trang web
    //   setBoard(board)
    // })
  }, [dispatch, boardId])

  // gọi api tạo mới column và cập nhật dữ liệu state board
  // const createNewColumn = async (newColumnData) => {
  //   const createdColumn = await createNewColumnAPI({
  //     ...newColumnData,
  //     boardId: board._id
  //   })

  //   // xử lí khi vừa mới tạo column thì có thể kéo thả liền
  //   createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
  //   createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]
  //   // end xử lí khi vừa mới tạo column thì có thể kéo thả liền

  //   // cap nhat state board
  //   // const newBoard = { ...board }
  //   const newBoard = cloneDeep(board)
  //   newBoard.columns.push(createdColumn)
  //   newBoard.columnOrderIds.push(createdColumn._id)
  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  // }

  // gọi api tạo mới card và cập nhật dữ liệu state board
  // const createNewCard = async (newCardData) => {
  //   const createdCard = await createNewCardAPI({
  //     ...newCardData,
  //     boardId: board._id
  //   })

  //   // cap nhat state board
  //   // const newBoard = { ...board }
  //   const newBoard = cloneDeep(board)
  //   const columnUpdateCards = newBoard.columns.find(column => column._id === createdCard.columnId)

  //   if (columnUpdateCards) {
  //     if (columnUpdateCards.cards.some(card => card.FE_PlaceholerCard)) {
  //       columnUpdateCards.cards = [createdCard]
  //       columnUpdateCards.cardOrderIds = [createdCard._id]
  //     }
  //     else {
  //       columnUpdateCards.cards.push(createdCard)
  //       columnUpdateCards.cardOrderIds.push(createdCard._id)
  //     }

  //   }

  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  //   //end cap nhat state board
  // }

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

  // const deleteColumn = (columnId) => {
  //   // cập nhật state board
  //   const newBoard = { ...board }
  //   newBoard.columns= newBoard.columns.filter(c => c._id !== columnId)
  //   newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  //   // Gọi API để xử lí BE
  //   deleteColumnDetailApi(columnId).then(res => {
  //     toast.success(res?.result)
  //   })
  // }

  if (!board) {
    return (
      <PageLoading content='Loading, Please waiting...' />
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
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