import {
  createSlice
  // createAsyncThunk
} from '@reduxjs/toolkit'
// import { API_ROOT } from '~/utils/constants'

// import authorizedAxiosInstance from '~/utils/authorizeAxios'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Nơi xử lí dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload

      // Xử lí dữ liệu nếu cần thiết


      // Update lại dữ liệu của currentActiveCard
      state.currentActiveCard = fullCard
    },
    // clear data and hide modal activeCard
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    }
  },
  extraReducers: (builder) => {}
})

export const { updateCurrentActiveCard, clearAndHideCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer