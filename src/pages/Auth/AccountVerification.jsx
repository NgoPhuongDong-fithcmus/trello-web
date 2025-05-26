import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoading from '~/components/Loading/PageLoading'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // tạo state để biết được là đã verify account hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để xác thực tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])

  // Nếu không tồn tại 1 trong 2 email hoặc token thì ra 404 page
  if (!email || !token) {
    return <Navigate to='/404'/>
  }

  // Nếu chưa xác thực thì hiển thị loading
  if (!verified) {
    return <PageLoading message='Verifying your account, please wait...'/>
  }


  return <Navigate to={`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification

// có thể dùng thêm cách này
// const { email, token } = Object.fromEntries([ ...searchParams])