import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

// cấu hình redux-persist
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

// cấu hình persist
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'] // định nghĩa các slice được phép duy trì qua mỗi lần f5 trình duyệt
}

// combine các reducers trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})

// thực hiện persisted reducer
const persistedReducers = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})