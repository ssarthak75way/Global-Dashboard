import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Extend AxiosRequestConfig to include _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

let isRefreshing = false;

interface FailedRequest {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        try {
            // Check if user exists in localStorage
            if (localStorage.getItem("user")) {
                const token = window.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (e) {
            console.error("Error checking user from localStorage", e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Skip retry for auth endpoints to prevent infinite loops
        const isAuthRequest = originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/signup");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await api.get("/auth/refresh");
                const { accessToken } = data;
                window.accessToken = accessToken;
                processQueue(null, accessToken);
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("user");
                window.accessToken = null;
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
