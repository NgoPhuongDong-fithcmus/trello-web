import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    // đoạn này dùng c.cards thay vì c.cartOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dlieu hoàn chỉnh cards rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    // console.log('handleDragOver', event)

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

        if (nextActiveColumn) {
          // Tìm index của card đang kéo thả trong column đang kéo thả
          const activeCardIndex = nextActiveColumn.cards.findIndex(card => card._id === activeDraggingCardId)
          // Nếu tìm thấy thì xóa nó ra khỏi column đang kéo thả
          if (activeCardIndex >= 0) {
            nextActiveColumn.cards = nextActiveColumn.cards.toSpliced(activeCardIndex, 1)
          }

          // Cập nhật lại cardOrderIds của column đang kéo thả
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          // Nếu tìm thấy thì thêm nó vào column đang thả
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        // ở đây phải return vì nếu không thì sẽ bị lỗi không cập nhật lại state
        return nextColumns
      })
    }

  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) return

    // Xử lí kéo cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log('Hien tai khong lam gi ca')

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

      if (activeColumn._id !== overColumn._id) {
        console.log('Keo card qua column khac nhau')
      }
      else {
        console.log('Keo card trong cung column')
      }

    }

    // Xử lí kéo columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí mới sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

        // dndOrderedColumnsIds để sau này cập nhật lại db thật
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
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
  return (
    <DndContext sensors={sensors} closestCorners={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} >
      <Box sx={{
        backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#2c3e50' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
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
