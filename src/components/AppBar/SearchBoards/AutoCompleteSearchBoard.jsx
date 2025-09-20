import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

/**
 * Hướng dẫn & ví dụ cái Autocomplele của MUI ở đây:
 * https://mui.com/material-ui/react-autocomplete/#asynchronous-requests
 */
function AutoCompleteSearchBoard() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) { setBoards(null) }
  }, [open])

  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return
    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    setLoading(true)
    fetchBoardsAPI(searchPath)
      .then((res) => {
        setBoards(res.boards || [])
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }
  const handleDebouncedInputChange = useDebounceFn(handleInputSearchChange, 1000)

  const handleSelectedBoard = (event, selectedBoard) => {
    navigate(`/boards/${selectedBoard._id}`)
    setOpen(false)
  }

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}

      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}

      getOptionLabel={(board) => board.title}

      options={boards || []}

      // Fix một cái warning của MUI, vì Autocomplete mặc định khi chúng ta chọn giá trị nó sẽ xảy ra sự so sánh object bên dưới, và mặc dù có 2 json objects trông như nhau trong JavaScript nhưng khi compare sẽ ra false. Vậy nên cần compare chuẩn với value dạng Primitive, ví dụ ở đây là dùng String _id thay vì compare toàn bộ cả cái json object board.
      // Link chi tiết: https://stackoverflow.com/a/65347275/8324172
      isOptionEqualToValue={(option, value) => option._id === value._id}

      loading={loading}

      onInputChange={handleDebouncedInputChange}

      onChange={handleSelectedBoard}

      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '.MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchBoard
