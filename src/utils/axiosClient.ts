import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const axiosClient = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials: true, // Enable cookies for HTTP-only cookies
});

axiosClient.interceptors.request.use(
  (config) => {
    // For admin auth, we rely on HTTP-only cookies, no need to manually add Authorization header
    // The server will automatically read cookies from the request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401) {
      // Don't retry if the original request is already a refresh token request
      if (originalRequest.url?.includes('/auth/refresh')) {
        console.error("Refresh token failed, redirecting to login");
        if (typeof window !== 'undefined') {
          window.location.href = '/connect';
        }
        return Promise.reject(error);
      }
      
      // If it's a 401 and we haven't already tried to refresh
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const refreshResponse = await axiosClient.post('/auth/refresh');
          if (refreshResponse.status === 200) {
            // Retry the original request
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          console.error("Token refresh failed:", refreshError);
          if (typeof window !== 'undefined') {
            window.location.href = '/connect';
          }
        }
      } else {
        // Already tried to refresh, redirect to login
        console.error("Lỗi 401: Unauthorized");
        if (typeof window !== 'undefined') {
          window.location.href = '/connect';
        }
      }
    } else if (error.code === "ERR_NETWORK") {
      console.log("Server is not responding. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
export { axiosClient };
