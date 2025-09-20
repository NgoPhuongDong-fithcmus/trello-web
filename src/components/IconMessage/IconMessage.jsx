import { IconButton, Popover } from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import EmojiPicker from 'emoji-picker-react'

import { useState } from 'react'

function IconMessage ({ onSelectEmoji }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleOpenEmoji = (event) => setAnchorEl(event.currentTarget)
  const handleCloseEmoji = () => setAnchorEl(null)

  const handleEmojiClick = (emojiData) => {
    onSelectEmoji(emojiData.emoji)
  }

  return (
    <>
      <IconButton color="default" sx={{ mx: 1 }} onClick={handleOpenEmoji}>
        <EmojiEmotionsIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseEmoji}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>
    </>
  )
}

export default IconMessage