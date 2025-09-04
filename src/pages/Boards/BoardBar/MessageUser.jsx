import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import ChatIcon from '@mui/icons-material/Chat'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { socketIoInstance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import { fetchMessagesAPI } from '~/apis'

function MessageUser({ boardId }) {
  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alice', text: 'Hello team!' },
    { id: 2, sender: 'Bob', text: 'Hi Alice 👋' }
  ])
  const [newMessage, setNewMessage] = useState('')

  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-chat-popover' : undefined

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    const msg = {
      id: Date.now(),
      text: newMessage,
      createdAt: Date.now(),
      sender: { username: currentUser.username },
      pending: true
    }
    setNewMessage('')
    socketIoInstance.emit('CLIENT_SEND_MESSAGE', { boardId, msg, userId })
  }
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (!isOpenPopover) return
    const fetchMessages = async () => {
      const data = await fetchMessagesAPI(boardId)
      setMessages(data)
    }

    fetchMessages()
  }, [isOpenPopover, boardId])

  useEffect(() => {
    if (boardId) {
      socketIoInstance.emit('JOIN_BOARD', boardId)
    }
  }, [boardId])

  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        // nếu có pending message (tạm thời) thì thay bằng msg thật từ server
        const filtered = prev.filter((m) => !(m.pending && m.text === msg.text))
        return [...filtered, msg]
      })
    }

    socketIoInstance.on('SERVER_SEND_MESSAGE', handleNewMessage)

    return () => {
      socketIoInstance.off('SERVER_SEND_MESSAGE', handleNewMessage)
    }
  }, [])

  return (
    <Box>
      <Tooltip title="Chat together">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<ChatIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Chat
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 350, height: 400, display: 'flex', flexDirection: 'column' }
        }}
        transitionDuration={0}
        TransitionProps={{
          onEntered: () => {
            if (chatEndRef.current) {
              chatEndRef.current.scrollIntoView({ behavior: 'auto' })
            }
          }
        }}
      >
        {/* Danh sách tin nhắn */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
          {messages.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'gray'
              }}
            >
              <ChatIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Chưa có tin nhắn
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Hãy bắt đầu cuộc trò chuyện 👋
              </Typography>
            </Box>
          ) : (
            messages.map((m, index) => {
              const isMe = m.sender?.username === currentUser?.username

              return (
                <Box
                  key={m._id ?? m.id ?? `${index}-${m.text}`}
                  sx={{
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mb: 0.3
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {isMe ? 'Me' : m.sender?.username || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'gray' }}>
                      {dayjs(m.createdAt).format('HH:mm')}
                    </Typography>
                  </Box>


                  <Box
                    sx={{
                      p: 1,
                      bgcolor: isMe ? '#e1f5fe' : 'white',
                      borderRadius: 2,
                      maxWidth: '70%',
                      boxShadow: 1,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      textAlign: 'left'
                    }}
                  >
                    <Typography variant="body2">{m.text}</Typography>
                  </Box>
                </Box>
              )
            })
          )}
          <div ref={chatEndRef} />
        </Box>


        {/* Input gửi tin nhắn */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{ display: 'flex', p: 1, borderTop: '1px solid #ddd' }}
        >
          <TextField
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            size="small"
            fullWidth
          />
          <Button type="submit" color="primary" variant="contained" sx={{ ml: 1 }}>
            <SendIcon />
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default MessageUser
