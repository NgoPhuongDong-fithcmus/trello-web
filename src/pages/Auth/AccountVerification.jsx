import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoading from '~/components/Loading/PageLoading'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  let [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
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


  return <Navigate to={`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification

// có thể dùng thêm cách này
// const { email, token } = Object.fromEntries([ ...searchParams])