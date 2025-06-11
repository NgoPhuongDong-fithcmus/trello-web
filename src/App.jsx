import Board from './pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from './pages/404Page/NotFound'
import Auth from './pages/Auth/Auth'
import Settings from './pages/Settings/Settings'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Boards from './pages/Boards'
import AccountResetPasswordVerification from './pages/Auth/AccountResetPasswordVerification'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/boards" replace={true}/>
      }/>
      <Route element={<ProtectedRoute user={currentUser}/>}>
        <Route path='/boards/:boardId' element={<Board/>}/>
        <Route path='/boards' element={<Boards/>}/>
        <Route path='/settings/account' element={<Settings/>}/>
        <Route path='/settings/security' element={<Settings/>}/>
      </Route>

      <Route path='/login' element={<Auth/>}/>
      <Route path='/register' element={<Auth/>}/>
      <Route path='/forgot-password' element={<Auth/>}/>
      <Route path='/reset_password' element={<Auth/>}/>
      <Route path='/account/verification' element={<AccountVerification/>}/>
      <Route path='/account/reset-password' element={<AccountResetPasswordVerification/>}/>

      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}
export default App