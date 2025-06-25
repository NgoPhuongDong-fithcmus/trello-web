
// export const API_ROOT = 'https://trello-api-m3ay.onrender.com'
export const API_ROOT = 'http://localhost:8017'


let apiRoot = ''

if (process.env.NODE_ENV === 'production') {
  apiRoot = 'https://trello-api-m3ay.onrender.com'
}
else {
  apiRoot = 'http://localhost:8017'
}

export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 10

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}