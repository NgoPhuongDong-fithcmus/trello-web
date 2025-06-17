import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { Button, Card as MuiCard, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
function Card({ card }) {

  const dispatch = useDispatch()

  const setActiveCard = () => {
    // cập nhật data cho activeCard
    dispatch(updateCurrentActiveCard(card))

    // Hiển thị modal activeCard
    dispatch(showModalActiveCard())
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndKitCardStyles = {
    touchAction: 'none',
    // Nếu sử dụng Transform thì sẽ bị biến dạng
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform), // Transform thì column sẽ bị biến dạng, còn Translate thì không
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: '1px solid transparent'
  }

  const showCartActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }
  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} { ...attributes } { ...listeners }
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1 px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholerCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': {
          borderColor: '#007AC2'
        }

      }}
    >
      {card?.cover &&
        <CardMedia sx={{ height: 140 }} image={card?.cover}/>
      }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {showCartActions() &&
        <CardActions sx={ { p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon/>}>{card?.memberIds?.length}</Button>}
          {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon/>}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon/>}>{card?.attachments?.length}</Button>}
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card

{/* <MuiCard sx={{
  cursor: 'pointer',
  boxShadow: '0 1px 1 px rgba(0,0,0,0.2)',
  overflow: 'unset'
}}>
  <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
    <Typography>Card 01</Typography>
  </CardContent>
</MuiCard> */}