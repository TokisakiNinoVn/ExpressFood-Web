import axios from 'axios';

// Đọc BASE_URL từ file .env
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor - thêm access token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và token hết hạn thì thử refresh
    if (
      error.response?.status === 401 &&
      error.response?.data?.tokenExpired &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // localStorage.clear();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(`${BASE_URL}/api/public/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;

        // Lưu token mới
        localStorage.setItem('accessToken', accessToken);

        // Gửi lại request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
