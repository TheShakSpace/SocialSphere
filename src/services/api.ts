import axios, { AxiosError } from "axios";

// Configure reusable Axios instance with baseURL
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("socialsphere_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses for token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and logout gracefully if unauthorized
      localStorage.removeItem("socialsphere_token");
      // Optional: Trigger custom event or reload to clear app state if not in guest context
      window.dispatchEvent(new Event("socialsphere_logout"));
    }
    return Promise.reject(error);
  }
);

// Reusable API modules
export const authApi = {
  register: async (payload: any) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },
  login: async (payload: any) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const userApi = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  updateProfile: async (payload: any) => {
    const response = await api.put("/users/profile", payload);
    return response.data;
  },
  followUser: async (userId: string) => {
    const response = await api.post(`/users/${userId}`);
    return response.data;
  },
  searchUsers: async (query: string) => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export const postApi = {
  getPosts: async () => {
    const response = await api.get("/posts");
    return response.data;
  },
  getPostById: async (postId: string) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },
  createPost: async (payload: { content: string; image?: string }) => {
    const response = await api.post("/posts", payload);
    return response.data;
  },
  likePost: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },
  addComment: async (postId: string, content: string) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },
  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
};

export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get("/users/notifications");
    return response.data;
  },
  markNotificationsRead: async () => {
    const response = await api.put("/users/notifications/read");
    return response.data;
  },
};
