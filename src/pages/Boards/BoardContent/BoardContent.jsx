import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  // closestCenter,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board, createNewColumn, createNewCard, moveColumnsUpdateAPI }) {
  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })


  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu nhấn giữ 250ms và di chuyển 5px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setactiveDragItemId] = useState(null)
  const [activeDragItemType, setactiveDragItemType] = useState(null)
  const [activeDragItemData, setactiveDragItemData] = useState(null)
  const [oldColumnWhenDragging, setOldColumnWhenDragging] = useState(null)

  // Điểm va chạm cuối cùng trước lúc thả
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    // đoạn này dùng c.cards thay vì c.cartOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dlieu hoàn chỉnh cards rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : over?.cards?.length + 1

      // clone mảng OrderColumnsState cũ ra mảng mới để xử lí data rồi return - Cập nhật lại OrderColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      // nextActiveColumn là column đang kéo thả (column cũ)
      if (nextActiveColumn) {
        // Tìm index của card đang kéo thả trong column đang kéo thả
        const activeCardIndex = nextActiveColumn.cards.findIndex(card => card._id === activeDraggingCardId)
        // Nếu tìm thấy thì xóa nó ra khỏi column đang kéo thả
        if (activeCardIndex >= 0) {
          nextActiveColumn.cards = nextActiveColumn.cards.toSpliced(activeCardIndex, 1)
        }

        // Thêm PlaceholderCard vào nếu column rỗng: bị kéo hết card đi, không còn card nào
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceHolderCard(nextActiveColumn)]
        }

        // Cập nhật lại cardOrderIds của column đang kéo thả
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // nextOverColumn là column đang thả (column mới)
      if (nextOverColumn) {
        // Nếu tìm thấy thì thêm nó vào column đang thả
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

        // Nếu column đang thả có card thì xóa PlaceholderCard đi
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card?.FE_PlaceholerCard)

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // ở đây phải return vì nếu không thì sẽ bị lỗi không cập nhật lại state
      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      // Nếu là card thì tìm column chứa card đó để xử lí
      const column = findColumnByCardId(event?.active?.id)
      setOldColumnWhenDragging(column)
    }
  }

  const handleDragOver = (event) => {

    // Nếu đang kéo thả column thì không cần xử lý gì cả
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }

    // Nếu đang kéo thả card thì cần xử lý
    const { active, over } = event

    if (!active || !over) return

    // activeDraggingCard: là card đang kéo thả
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là card đang ở vị trí thả
    const { id: overCardId } = over

    // Tìm 2 colums theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn: ', activeColumn)
    // console.log('overColumn: ', overColumn)

    // Nếu không tồn tại 1 trong 2 column thì không cần xử lý gì cả
    if (!activeColumn || !overColumn) return

    // Xử lí logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo thả trong cùng 1 column thì không cần xử lý gì cả
    // Vì đây đang là đoạn xử lí lúc kéo handleOver còn xử lí lúc kéo xong thì ở đoạn handleDragEnd
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }

  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) return

    // Xử lí kéo cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: là card đang kéo thả
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là card đang ở vị trí thả
      const { id: overCardId } = over

      // Tìm 2 colums theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log('activeColumn: ', activeColumn)
      // console.log('overColumn: ', overColumn)

      // Nếu không tồn tại 1 trong 2 column thì không cần xử lý gì cả
      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDragging._id !== overColumn._id) {
        // console.log('Keo card qua column khac nhau')
        moveCardBetweenColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
      }
      else {
        const oldCardIndex = oldColumnWhenDragging?.cards.findIndex(card => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards.findIndex(card => card._id === overCardId)
        const dndOrderedColumns = arrayMove(oldColumnWhenDragging?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find(column => column._id === oldColumnWhenDragging._id)

          if (targetColumn) {
            targetColumn.cards = dndOrderedColumns
            targetColumn.cardOrderIds = dndOrderedColumns.map(card => card._id)
          }

          return nextColumns
        } )

      }

    }

    // Xử lí kéo columns trong cùng boardContent tương tự như kéo thả cards trong cùng column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí mới sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

        // dndOrderedColumnsIds để sau này cập nhật lại db thật
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

        // Hoàn thiện kéo thả column và cập nhật api
        moveColumnsUpdateAPI(dndOrderedColumns)

        // Cập nhật lại data column sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Những xử lí sau khi kéo thả xong thì luôn phải reset lại state để không bị lỗi
    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback( (args) => {
    // Trường hợp kéo thả column thì dùng thuật toán closetCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm va chạm với con trỏ chuột, trả về mảng các điểm va chạm
    const pointerIntersections = pointerWithin(args)

    // Khi kéo thả card có media (có ảnh) thì pointerIntersections sẽ trả về mảng rỗng nên là sẽ bị bug flickering nên phải thêm lệnh này
    if (!pointerIntersections?.length) return


    // Thuật toán phát hiện va chạm sẽ trả về một mảng các điểm va chạm với con trỏ chuột =>>>>> !!!!!! nó cũng giống pointerIntersections nhưng mà không cần bước này nữa
    // const intersections = pointerIntersections?.length > 0 ? pointerIntersections : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {

      const checkIntersectionColumn = orderedColumns.find(c => c._id === overId)
      if (checkIntersectionColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter( (container) => {
            return container.id !== overId && ( checkIntersectionColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} >
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#2c3e50' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}


export default BoardContent
