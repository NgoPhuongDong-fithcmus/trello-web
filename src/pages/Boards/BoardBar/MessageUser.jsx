import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import ChatIcon from '@mui/icons-material/Chat'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send'
import Badge from '@mui/material/Badge'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { socketIoInstance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import { fetchMessagesAPI } from '~/apis'
import IconMessage from '~/components/IconMessage/IconMessage'
import IconTyping from '~/components/IconMessage/IconTypingMessage'

function MessageUser({ boardId }) {
  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [unread, setUnread] = useState(false)

  const [typingUsers, setTypingUsers] = useState({})
  const typingTimeout = useRef(null)


  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-chat-popover' : undefined

  // Đóng mở popover chat
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
      setUnread(false)
    }
    else setAnchorPopoverElement(null)
  }

  // Hàm gửi tin nhắn đã áp dụng realtime với socket.io
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

  // Hàm xử lý khi người dùng gõ tin nhắn realtime với socket.io
  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    socketIoInstance.emit('CLIENT_TYPING_MESSAGE', { boardId, userId: userId })

    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socketIoInstance.emit('CLIENT_STOP_TYPING_MESSAGE', { boardId, userId: userId })
    }, 2000)
  }


  useEffect(() => {
    if (boardId) {
      socketIoInstance.emit('JOIN_BOARD', boardId)
    }
  }, [boardId])

  useEffect(() => {
    socketIoInstance.on('SERVER_TYPING_MESSAGE', ({ userId }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: true }))
    })

    socketIoInstance.on('SERVER_STOP_TYPING_MESSAGE', ({ userId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    })

    return () => {
      socketIoInstance.off('SERVER_TYPING_MESSAGE')
      socketIoInstance.off('SERVER_STOP_TYPING_MESSAGE')
    }
  }, [])
  // End Hàm xử lý khi người dùng gõ tin nhắn realtime với socket.io

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
    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !(m.pending && m.text === msg.text))
        return [...filtered, msg]
      })
      if (!isOpenPopover) setUnread(true)
    }

    socketIoInstance.on('SERVER_SEND_MESSAGE', handleNewMessage)

    return () => {
      socketIoInstance.off('SERVER_SEND_MESSAGE', handleNewMessage)
    }
  }, [isOpenPopover])

  return (
    <Box>
      <Tooltip title="Chat together">
        <Badge
          color="error"
          variant="dot"
          invisible={!unread}
          overlap="circular"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Button
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            variant="outlined"
            startIcon={<ChatIcon />}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
          >
            Chat
          </Button>
        </Badge>

      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        PaperProps={{
          sx: {
            width: 350,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            mt: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -12,
              left: 'calc(50% - 8px)',
              width: 16,
              height: 16,
              bgcolor: '#7f8c8d',
              transform: 'rotate(45deg)',
              boxShadow: '-1px -1px 2px rgba(0,0,0,0.05)',
              zIndex: 1
            }
          }
        }}
      >
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
                      {dayjs(m.createdAt).format('hh:mm A')}
                    </Typography>

                  </Box>


                  <Tooltip
                    title={dayjs(m.createdAt).format('DD/MM/YYYY hh:mm A')}
                    arrow
                    enterDelay={500}
                    leaveDelay={100}
                  >
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: isMe ? '#e1f5fe' : 'white',
                        borderRadius: 2,
                        maxWidth: '70%',
                        boxShadow: 1,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        textAlign: 'left',
                        cursor: 'default'
                      }}
                    >
                      <Typography variant="body2">{m.text}</Typography>
                    </Box>
                  </Tooltip>

                </Box>
              )
            })
          )}
          {Object.keys(typingUsers).length > 0 && (
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'white',
                  borderRadius: 2,
                  maxWidth: '50%',
                  boxShadow: 1
                }}
              >
                <IconTyping />
              </Box>
            </Box>
          )}

          <div ref={chatEndRef} />
        </Box>

        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{ display: 'flex', p: 1, borderTop: '1px solid #ddd' }}
        >
          <TextField
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            size="small"
            fullWidth
          />
          <IconMessage onSelectEmoji={(emoji) => setNewMessage((prev) => prev + emoji)} />
          <Button type="submit" color="primary" variant="contained" sx={{ ml: 1 }}>
            <SendIcon />
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default MessageUser
