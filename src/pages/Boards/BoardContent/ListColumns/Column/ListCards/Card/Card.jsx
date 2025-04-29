import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { Button, Card as MuiCard, CardActions, CardContent, CardMedia, Typography } from '@mui/material'

function Card({temporaryHideMedia}) {
  if (temporaryHideMedia) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1 px rgba(0,0,0,0.2)',
        overflow: 'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card 01</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1 px rgba(0,0,0,0.2)',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://images.careerviet.vn/content/images/it-2.jpg"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&;last-child': { p: 1.5 } }}>
        <Typography>Lizard</Typography>
      </CardContent>
      <CardActions sx={ { p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon/>}>20</Button>
        <Button size="small" startIcon={<CommentIcon/>}>15</Button>
        <Button size="small" startIcon={<AttachmentIcon/>}>5</Button>
      </CardActions>
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