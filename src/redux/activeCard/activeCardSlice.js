import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { API_ROOT } from '~/utils/constants'

// import authorizedAxiosInstance from '~/utils/authorizeAxios'

const initialState = {
  currentActiveCard: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Nơi xử lí dữ liệu đồng bộ
  reducers: {

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload

      // Xử lí dữ liệu nếu cần thiết


      // Update lại dữ liệu của currentActiveCard
      state.currentActiveCard = fullCard
    },

    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    }
  },
  extraReducers: (builder) => {}
})

export const { updateCurrentActiveCard, clearCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const activeCardReducer = activeCardSlice.reducer