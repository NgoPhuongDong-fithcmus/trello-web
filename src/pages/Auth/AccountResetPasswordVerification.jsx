import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoading from '~/components/Loading/PageLoading'
import { verifyUserResetPasswordAPI } from '~/apis'

function AccountResetPasswordVerification() {
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // console.log('email: ', email)
  // console.log('token: ', token)

  // tạo state để biết được là đã verify account hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để xác thực tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserResetPasswordAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to='/404'/>
  }

  if (!verified) {
    return <PageLoading message='Verifying your account, please wait...'/>
  }


  return <Navigate to={`/reset_password?verifiedEmail=${email}&token=${token}`}/>
}

export default AccountResetPasswordVerification