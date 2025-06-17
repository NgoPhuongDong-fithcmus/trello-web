import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoading from '~/components/Loading/PageLoading'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
// eslint-disable-next-line no-unused-vars
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'

import { styled } from '@mui/material/styles'
import { fetchBoardsAPI } from '~/apis'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { Alert, Button } from '@mui/material'
import Setup2FA from '~/components/Verify2FA/setup-2fa'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDetailAPI, selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import Require2FA from '~/components/Verify2FA/require-2fa'
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const user = useSelector(selectCurrentUser)
  // console.log('Boards > user: ', user)
  const dispatch = useDispatch()
  const [openSetup2FA, setOpenSetup2FA] = useState(false)

  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || '1', 10)

  const updateDataAfterCreateBoard = (res) => {
    // Cập nhật lại danh sách boards sau khi tạo board mới thành công
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search)
      .then(updateDataAfterCreateBoard)
    // dispatch(updateUserAPI(user.require_2fa))
    dispatch(fetchUserDetailAPI(user._id))
    // if (user?._id) {
    //   dispatch(fetchUserDetailAPI(user._id))
    // }
  }, [location.search, user._id, dispatch])


  const refreshPageAfterCreateBoard = () => {
    fetchBoardsAPI(location.search)
      .then(updateDataAfterCreateBoard)
  }

  const handleSuccessSetup2FA = (updatedUser) => {
    dispatch(updateUserAPI({ ...updatedUser, require_2fa: true, is_2fa_verified: true }))
    setOpenSetup2FA(false)
  }

  const handleSuccessRequire2FA = (updatedUser) => {
    dispatch(updateUserAPI({ ...updatedUser, is_2fa_verified: true }))
  }

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoading caption="Loading..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal refreshPageAfterCreateBoard={refreshPageAfterCreateBoard}/>
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Box sx={{
              maxWidth: '1120px',
              margin: '1em auto',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1,
              padding: '0 1em'
            }}>
              {/* Modal để user cài đặt 2FA */}
              <Setup2FA
                isOpen={openSetup2FA}
                toggleOpen={setOpenSetup2FA}
                user={user}
                handleSuccessSetup2FA={handleSuccessSetup2FA}
              />

              {/* Modal yêu cầu xác thực 2FA */}
              {/* Với điều kiện user đã bật tính năng 2FA, và user chưa xác thực 2FA ngay sau khi đăng nhập ở lần tiếp theo */}
              {/* <Require2FA /> */}
              {user.require_2fa && !user.is_2fa_verified && <Require2FA user={user} handleSuccessRequire2FA={handleSuccessRequire2FA}/>}

              <Alert severity={`${user.require_2fa ? 'success' : 'warning'}`} sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Tình trạng bảo mật tài khoản:&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#e67e22', cursor: 'pointer' } }}>
                  {user.require_2fa ? 'Đã Bật' : 'Chưa Bật'} xác thực 2 lớp - Two-Factor Authentication (2FA)
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2, mt: 1 }}>
                {!user.require_2fa &&
                <Button
                  type='button'
                  variant='contained'
                  color='warning'
                  size='large'
                  sx={{ maxWidth: 'max-content' }}
                  onClick={() => setOpenSetup2FA(true)}
                >
                  Enable 2FA
                </Button>
                }
              </Box>

              <Divider sx={{ my: 2 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Your boards:</Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>No result found!</Typography>
            }

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 &&
              <Grid container spacing={2}>
                {boards.map(b =>
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    <Card sx={{ width: '250px' }}>
                      {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
                      {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                      <Box sx={{ height: '50px', backgroundColor: randomColor() }}></Box>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {b.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {b?.description || 'No description provided.'}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${b._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}>
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            }

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {(totalBoards > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            }
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
