import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'

function CardUserGroup({ cardMemberIds = [], onUpdateCardMembers }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const board = useSelector(selectCurrentActiveBoard)

  // const cardMembers = board?.allUsers.filter(user => cardMemberIds.includes(user._id)) // thêm vào k theo thứ tự mà tuần theo thứ tự của board.allUsers
  const cardMembers = cardMemberIds.map(id => (board?.allUsers.find(user => user._id === id))) // Lấy ra các user là thành viên của card theo đúng thứ tự của cardMemberIds
  // console.log('🚀 ~ CardUserGroup ~ cardMembers:', cardMembers)

  const handleUpdateCardMembers = (user) => {
    const memberInfo = {
      userId: user._id,
      action: cardMemberIds.includes(user._id) ? CARD_MEMBER_ACTIONS.REMOVE : CARD_MEMBER_ACTIONS.ADD // Nếu đã có thì remove, chưa có thì add
    }
    onUpdateCardMembers(memberInfo)
  }

  // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bởi nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lý phần tử tính toán cuối, đơn giản là cứ dùng Box và CSS - Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi.
  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Hiển thị các user là thành viên của card */}
      {cardMembers.map((member, index) =>
        <Tooltip title={member.displayName} key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt={member.displayName}
            src={member.avatar}
          />
        </Tooltip>
      )}

      {/* Nút này để mở popover thêm member */}
      <Tooltip title="Add new member">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {board?.allUsers.map((user, index) =>
            <Tooltip title={user.displayName} key={index}>
              {/* Cách làm Avatar kèm badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  cardMemberIds.includes(user._id)
                    ? <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
                    : null
                }
                onClick= {() => {handleUpdateCardMembers(user)}}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt={user.displayName}
                  src={user.avatar}
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardUserGroup
