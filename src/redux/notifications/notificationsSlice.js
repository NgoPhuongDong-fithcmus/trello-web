import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
// import { toast } from 'react-toastify'

const initialState = {
  currentNotifications: null
}

export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateInvitationInBoardAPI = createAsyncThunk(
  'notifications/updateInvitationInBoardAPI',
  async ({ invitationId, status }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
    // Thêm mới notifications mới vào đầu mảng
      if (state.currentNotifications) {
        state.currentNotifications.unshift(action.payload)
      } else {
        // Nếu không có notifications nào, khởi tạo mảng với notification mới
        state.currentNotifications = [action.payload]
      }
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let invitations = action.payload

      state.currentNotifications = Array.isArray(invitations) ? invitations.reverse() : []
    })
    builder.addCase(updateInvitationInBoardAPI.fulfilled, (state, action) => {
      const updatedInvitation = action.payload

      const getInvitation = state.currentNotifications.find(i => i._id === updatedInvitation._id)

      getInvitation.boardInvitation = updatedInvitation.boardInvitation
    })

  }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions

export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

export const notificationsReducer = notificationsSlice.reducer