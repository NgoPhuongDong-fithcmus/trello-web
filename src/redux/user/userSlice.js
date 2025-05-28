import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { toast } from 'react-toastify'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    toast.success('Logged in successfully!', {
      theme: 'colored',
      position: 'top-right',
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined
    })
    return request.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const request = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)

    if (showSuccessMessage) {
      toast.success('Logged out successfully!', {
        theme: 'colored',
        position: 'top-right',
        autoClose: 200,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined
      })
    }

    return request.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload

      state.currentUser = user
    })
    // Khi gọi API logout thành công thì sẽ xóa currentUser trong state kết hợp với ProtectedRoute sẽ tự động chuyển hướng về trang login
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer