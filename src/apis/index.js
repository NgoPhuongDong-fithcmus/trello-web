import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchBoardDetailApi = async (boardId) => {
  const request = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  return request.data
}

export const createNewColumnAPI = async (newColumnData) => {
  const request = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)

  return request.data
}

export const createNewCardAPI = async (newCardData) => {
  const request = await axios.post(`${API_ROOT}/v1/cards`, newCardData)

  return request.data
}