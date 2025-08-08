import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

interface ErrorResponse {
  message: string;
  code: string;
}

export const axiosClient: AxiosInstance = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 10000,
    params: {
      apikey: import.meta.env.VITE_API_KEY,
    },
  });
})();

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      try {
        //get refresh token from URL (if any)
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`
        );

        const { accessToken } = response.data;

        // Update stored tokens => if not using cookies
        // if using cookies => will update automatically based on header

        // localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        // localStorage.setItem(
        //     STORAGE_KEYS.REFRESH_TOKEN,
        //     newRefreshToken
        // )

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Retry original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    const apiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

export default axiosClient;
