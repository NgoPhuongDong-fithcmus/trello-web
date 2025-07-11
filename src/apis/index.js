import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// export const fetchBoardDetailApi = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

//   return response.data
// }

export const createNewBoardAPI = async (newBoardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, newBoardData)
  toast.success('Board created successfully!', { theme: 'colored' })
  return response.data
}

export const updateBoardDetailApi = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)

  return response.data
}

export const moveCardsToDifferentColumnApi = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)

  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)

  return response.data
}

export const updateColumnDetailApi = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)

  return response.data
}

export const deleteColumnDetailApi = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)

  return response.data
}
// End Columns


// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)

  return response.data
}

export const updateCardDetailApi = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)

  return response.data
}

// Users
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Register successfully, please check your email to verify your account!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Your account has been verified successfully!', { theme: 'colored' })
  return response.data
}

export const verifyUserResetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify_resetPassword`, data)
  toast.success('Your account has been verified successfully!', { theme: 'colored' })
  return response.data
}

export const forgotPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/forgot_password`, data)

  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/reset_password`, data)
  toast.success('Your password has been reset successfully!', { theme: 'colored' })
  return response.data
}

export const refreshTokensAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_tokens`)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const inviteUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  return response.data
}

export const get2FA_QRCodeAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/${userId}/get2FA_qrcode`)
  return response.data
}

export const setup2FA_QRCodeAPI = async (userId, otpToken) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/${userId}/setup2FA_qrcode`, { otpToken })
  return response.data
}

export const verify2faAPI = async (userId, otpToken) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/${userId}/verify2fa`, { otpToken })
  return response.data
}

export const fetchUserDetailAPI = async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/${userId}`)
  return response.data
}