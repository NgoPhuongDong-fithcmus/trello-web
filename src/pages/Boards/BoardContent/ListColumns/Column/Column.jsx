import { useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import { Cloud, ContentCopy, ContentCut, ContentPaste, DragHandle, ExpandMore } from '@mui/icons-material'
import { Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'


function Column({ column, createNewCard, deleteColumn }) {


  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')


  const addNewCard = async () => {

    if (!newCardTitle) {
      toast.error('Please enter card title')
      return
    }

    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    await createNewCard(newCardData)

    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const handleDeleteColumn = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this column? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteColumn(column._id)
        Swal.fire('Deleted!', 'The column has been deleted.', 'success')
      }
    })
  }


  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column?._id,
    data: { ...column }
  })
  const dndKitColumnStyles = {
    touchAction: 'none',
    // Nếu sử dụng Transform thì sẽ bị biến dạng
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform), // Transform thì column sẽ bị biến dạng, còn Translate thì không
    transition,
    // chiều cao phải luôn là 100% vì nếu không sẽ bị lỗi lúc kéo column ngắn qua một cái column dài thì phải kéo ở khu vực giữa rất khó chịu,
    // lưu ý: phải kết hợp với {...listeners} nằm ở giữa Box chứ không phải ở div nằm ngoài cùng để tránh trường hợp kéo ở vùng xanh ngoài
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  // Cards đã được sắp xếp ở component cha cao nhất rồi
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id' )

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    // ở đây phải bọc div vì chiều cao của column khi kéo thả sẽ có bug kiểu flickering
    <div ref={setNodeRef} style={dndKitColumnStyles} { ...attributes } >
      <Box
        { ...listeners }
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)}})`,
          marginBottom: '10px'
        }}>
        <Box>
          {/*Box column header */}
          <Box sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography sx={{
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            >
              {column?.title}
            </Typography>
            <Box>
              <Tooltip title='dropdown'>
                <ExpandMore
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id="basic-button-workspaces"
                  aria-controls={open ? 'basic-menu-workspaces' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="basic-menu-workspaces"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-workspaces'
                }}
              >
                <MenuItem
                  onClick={toggleOpenNewCardForm}
                  sx={{
                    '&:hover': {
                      color: 'success.light'
                    }
                  }}
                >
                  <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new cart</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                  <Typography variant="body2" color="text.secondary">
                    ⌘X
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                  <Typography variant="body2" color="text.secondary">
                    ⌘C
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                  <Typography variant="body2" color="text.secondary">
                    ⌘V
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleDeleteColumn}
                  sx={{
                    '&:hover': {
                      color: 'warning.dark',
                      '& .delete-forever-icon': {
                        color: 'warning.dark'
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    <DeleteForeverIcon className='delete-forever-icon' fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/*Box column list card */}
          <ListCards cards={orderedCards}/>
          {/*Box column footer */}
          <Box
            sx={{
              height: (theme) => theme.trello.columnFooterHeight,
              p: 2
            }}>
            {!openNewCardForm
              ?<Box sx={{ height: '100%', display:'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={toggleOpenNewCardForm} startIcon={<AddCardIcon/>}>
                  Add new cart
                </Button>
                <Tooltip title='Drag to move'>
                  <DragHandle sx={{ cursor: 'pointer' }}/>
                </Tooltip>
              </Box>
              :
              <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TextField
                  label="Enter Column Title"
                  type="text"
                  size='small'
                  variant='outlined'
                  autoFocus
                  data-no-dnd='true'
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  sx={{
                    '& label': { color: '#007AC2' },
                    '& input': { color: '#007AC2' },
                    '& label.Mui-focused': { color: '#007AC2' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#007AC2'
                      },
                      '&:hover fieldset': {
                        borderColor: '#007AC2'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#007AC2'
                      }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    onClick={addNewCard}
                    variant='contained'
                    color='success'
                    size='small'
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid'
                    }}
                  >
                    Add
                  </Button>
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color: '#007AC2',
                      cursor: 'pointer'
                    }}
                    onClick={toggleOpenNewCardForm}
                  />
                </Box>
              </Box>
            }
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Column
