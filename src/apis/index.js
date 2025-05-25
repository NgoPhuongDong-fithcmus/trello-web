import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// export const fetchBoardDetailApi = async (boardId) => {
//   const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

//   return request.data
// }

export const updateBoardDetailApi = async (boardId, updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)

  return request.data
}

export const moveCardsToDifferentColumnApi = async (updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)

  return request.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const request = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)

  return request.data
}

export const updateColumnDetailApi = async (columnId, updateData) => {
  const request = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)

  return request.data
}

export const deleteColumnDetailApi = async (columnId) => {
  const request = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)

  return request.data
}
// End Columns


// Cards
export const createNewCardAPI = async (newCardData) => {
  const request = await axios.post(`${API_ROOT}/v1/cards`, newCardData)

  return request.data
}