import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

// Khởi tạo giá trị của một Slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bât đồng bộ) và cập nhật dữ liệu vào redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailApi = createAsyncThunk(
  'activeBoard/fetchBoardDetailApi',
  async (boardId) => {
    const request = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)

    return request.data
  }
)

// Khởi tạo slice trong kho lưu trữ redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Nơi xử lí dữ liệu đồng bộ
  reducers: {

    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa
      const board = action.payload

      // Xử lí dữ liệu nếu cần thiết


      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCurrentActiveCardInBoard: (state, action) => {
      const updatedCard = action.payload

      // Tìm column chứa card đã cập nhật
      const column = state.currentActiveBoard.columns.find(c => c._id === updatedCard.columnId)
      if (column) {
        // Cập nhật lại card trong column
        const card = column.cards.find(c => c._id === updatedCard._id)
        if (card) {
          // card.title = updatedCard.title
          // card.description = updatedCard.description
          // card.cover = updatedCard.cover
          Object.assign(card, updatedCard) // Cập nhật tất cả các trường của card
        }
      }
    }
  },
  // extraReducers: nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailApi.fulfilled, (state, action) => {
      // action.payload là response.data trả về
      let board = action.payload

      // Thành viên trong board sẽ là gộp lại của 2 mảng ownerIds và memberIds
      board.allUsers = [
        ...board.owners,
        ...board.members
      ]
      // có thể thay thế gộp trên bằng concat
      // board.allUsersInBoard = board.owners.concat(board.members)

      board.columns = mapOrder(board?.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
      // xu li keo tha vao column rong moi tao de khoi can f5 trang web
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        }
        else {
          // Sắp xếp thứ tự cards ở đây luôn trước khi đưa xuống các component con (fix bug quan trọng khi kéo thả cards trong cùng column lần đầu)
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id' )
        }
      })

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard, updateCurrentActiveCardInBoard } = activeBoardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store để sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer