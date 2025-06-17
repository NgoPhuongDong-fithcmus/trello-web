import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'

import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { toast } from 'react-toastify'
import { forgotPasswordAPI } from '~/apis'

function ForgetPasswordForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const submitForgotPassword = async (data) => {
    setLoading(true)
    const { email } = data
    try {
      await toast.promise(
        forgotPasswordAPI({ email }),
        {
          pending: 'Sending reset link...',
          success: 'Yêu cầu đổi mật khẩu thành công! Vui lòng kiểm tra email.',
          error: {
            render({ data }) {
              return data?.response?.data?.message || 'Gửi link thất bại. Vui lòng thử lại!'
            }
          }
        }
      )
      setSuccess(true)
      reset() // reset form email nếu muốn
    } catch (error) {
      // error đã được toast xử lý rồi
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForgotPassword)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{ margin: '1em', display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <TrelloIcon />
            </Avatar>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Author: Ngô Phương Đông
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {success && (
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Yêu cầu đổi mật khẩu đã thành công.<br />Vui lòng kiểm tra email để hoàn tất đổi mật khẩu.
              </Alert>
            )}
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter your email..."
                type="email"
                variant="outlined"
                error={!!errors.email}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
                disabled={loading || success}
              />
              <FieldErrorAlert errors={errors} fieldName="email" />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading || success}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </CardActions>
          <Box sx={{ textAlign: 'center', padding: '0 1em 1em 1em' }}>
            <Typography>Already have an account?</Typography>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}
            >
              Back to login
            </Button>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default ForgetPasswordForm
