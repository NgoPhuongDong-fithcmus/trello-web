import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokensAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

// Dùng kĩ thuật Inject store để dùng dispatch trong interceptor
let axiosStore = null
export const injectStore = store => {
  axiosStore = store
}

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

let refreshTokenPromise = null

// Add a response interceptor: Can thiệp vào những respond API
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

  // Xử lí refresh token tự động
  // TH1: Nếu như lỗi là 401 thì gọi API đăng xuất luôn
  if (error.response?.status === 401) {
    axiosStore.dispatch(logoutUserAPI(false))
  }

  // TH2: Nếu như lỗi là 410 - GONE thì sẽ tự động gọi API refresh token để làm mới access token
  const originalRequest = error.config
  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true

    // Kiểm tra xem nếu chưa có refreshTokenPromise thì mới gọi API refresh token đồng thời gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokensAPI()
        .then((result) => {
          return result?.accessToken
        })
        .catch((_error) => {
          // Nếu như refresh token bị lỗi thì sẽ gọi API logout luôn
          axiosStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù có lỗi hay không thì cũng sẽ xóa refreshTokenPromise để lần sau gọi lại API refresh token
          refreshTokenPromise = null
        })
    }
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then((accessToken) => {
      /**
       * 1. Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc sessionStorage thì sẽ viết thêm code xử lí dưới đây
       * ví dụ: axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
       * Hiện tại dự án không cần lưu accessToken vào localStorage hay sessionStorage vì đã dùng cookie httpOnly để lưu trữ (từ BE) sau khi gọi api
       * refreshToken
       * thành công
       */
      // 2. Quan trọng: return axios instance kết hợp các originalRequest để gọi lại API ban đầu mà đã bị lỗi
      return authorizedAxiosInstance(originalRequest)
    })
  }
  // End Xử lí refresh token tự động


  // Xử lí tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (chỉ viết code 1 lần)
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