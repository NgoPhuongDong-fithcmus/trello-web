// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { BrowserRouter } from 'react-router-dom'

// Cau hinh redux store
import { Provider } from 'react-redux'
import { store } from '~/redux/store.js'

// Cau hinh redux-persist
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

// Cấu hình kĩ thuật inject store
import { injectStore } from '~/utils/authorizeAxios.js'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          <App />
          <ToastContainer/>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
