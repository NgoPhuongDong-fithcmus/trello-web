import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { Card as MuiCard, CardActions, Alert } from '@mui/material'
import Typography from '@mui/material/Typography'
import LockResetIcon from '@mui/icons-material/LockReset'
import Avatar from '@mui/material/Avatar'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { resetPasswordAPI } from '~/apis'
import { toast } from 'react-toastify'

function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('verifiedEmail')

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const onSubmit = (data) => {
    const { password, password_confirm } = data
    toast.promise(
      resetPasswordAPI({ password, password_confirm, email }),
      {
        pending: 'Resetting your password...',
        success: 'Password has been reset successfully!',
        error: {
          render({ data }) {
            return data?.response?.data?.message || 'Something went wrong!'
          }
        }
      }
    ).then(() => {
      navigate('/login')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', margin: '1em' }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockResetIcon />
            </Avatar>
          </Box>
          <Typography align="center" variant="h6" sx={{ mb: 1 }}>
            Reset Your Password
          </Typography>
          {email && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Yêu cầu đổi mật khẩu cho email <strong>{email}</strong> đã được xác nhận thành công. <br />
            Bây giờ bạn có thể đặt lại mật khẩu mới.
            </Alert>
          )}
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                error={!!errors.password}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="password" />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                variant="outlined"
                error={!!errors.password_confirm}
                {...register('password_confirm', {
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: value =>
                    value === watch('password') || 'Password Confirmation does not match!'
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="password_confirm" />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Reset Password
            </Button>
          </CardActions>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default ResetPasswordForm
