import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 req là 10 phút
authorizedAxiosInstance.defaults.timeout = 1000*60*10
// withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi req lên BE (phục vụ việc lưu JWT tokens (refreshToken & accessToken) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Add a request interceptor: Can thiệp vào những req API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor: Can thiệp vào những res API
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây


  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)

  // Xử lí tập trung phần hiển thị thoogn báo lỗi trả về từ mọi API ở đây (chỉ viết code 1 lần)
  // Có thể console.log để thấy cấu trúc data tới message
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoài trừ mã 410 - GONE phục vụ việc tự dộng refresh lại tokens
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance