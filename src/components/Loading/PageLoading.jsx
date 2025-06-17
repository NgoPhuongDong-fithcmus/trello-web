import { Box, CircularProgress, Typography } from '@mui/material'

function PageLoading({ content }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" mt={2}>
        {content || 'Loading...'}
      </Typography>
    </Box>
  )
}

export default PageLoading
