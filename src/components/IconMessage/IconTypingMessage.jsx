import Box from '@mui/material/Box'

function IconTyping() {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'gray',
            animation: 'typingBounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}

      <style>
        {`
          @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  )
}

export default IconTyping
