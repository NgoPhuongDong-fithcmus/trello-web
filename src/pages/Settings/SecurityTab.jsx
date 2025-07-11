/* eslint-disable no-console */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import changePasswordIcon from '../../assets/changePassword.png'

import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice'
import Swal from 'sweetalert2'

function SecurityTab() {
  const dispatch = useDispatch()

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  // Ôn lại: https://www.npmjs.com/package/material-ui-confirm
  const submitChangePassword = (data) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to change password? Click yes to continue?',
      imageUrl: changePasswordIcon,
      imageWidth: 50,
      imageHeight: 50,
      showCancelButton: true,
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const { current_password, new_password, new_password_confirmation } = data
        toast.promise(
          dispatch(updateUserAPI({ current_password, new_password, new_password_confirmation })), {
            pending: 'Updating...',
            error: {
              render({ data }) {
                return data.response?.data?.message || 'Something went wrong, please try again!'
              }
            }
          }
        ).then(res => {
          const user = res.payload
          if (user) {
            toast.success('Password has been changed successfully! Please login again.')
            dispatch(logoutUserAPI(false))
          }
        })
      }
    }).catch(() => {})
  }

  // const submitChangePassword = (data) => {
  //   confirmChangePassword({
  //     // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
  //     title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //       <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
  //     </Box>,
  //     description: 'You have to login again after successfully changing your password. Continue?',
  //     confirmationText: 'Confirm',
  //     cancellationText: 'Cancel'
  //   }).then(() => {
  //     const { current_password, new_password, new_password_confirmation } = data
  //     console.log('current_password: ', current_password)
  //     console.log('new_password: ', new_password)
  //     console.log('new_password_confirmation: ', new_password_confirmation)

  //     // Gọi API...
  //   }).catch(() => {})
  // }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box>
          <Typography variant="h5">Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'current_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password Confirmation"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('new_password_confirmation', {
                  validate: (value) => {
                    if (value === watch('new_password')) return true
                    return 'Password confirmation does not match.'
                  }
                })}
                error={!!errors['new_password_confirmation']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth>
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SecurityTab
