import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// export const fetchBoardDetailApi = async (boardId) => {
//   const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

//   return request.data
// }

export const updateBoardDetailApi = async (boardId, updateData) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)

  return request.data
}

export const moveCardsToDifferentColumnApi = async (updateData) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)

  return request.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)

  return request.data
}

export const updateColumnDetailApi = async (columnId, updateData) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)

  return request.data
}

export const deleteColumnDetailApi = async (columnId) => {
  const request = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)

  return request.data
}
// End Columns


// Cards
export const createNewCardAPI = async (newCardData) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)

  return request.data
}

// Users
export const registerUserAPI = async (data) => {
  const request = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Register successfully, please check your email to verify your account!', { theme: 'colored' })
  return request.data
}

export const verifyUserAPI = async (data) => {
  const request = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Your account has been verified successfully!', { theme: 'colored' })
  return request.data
}