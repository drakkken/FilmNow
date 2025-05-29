import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      console.log('Sending login request to:', `${API_URL}/users/login`);
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      console.log('Sending signup request to:', `${API_URL}/users/sign-up`);
      const response = await axios.post(`${API_URL}/users/sign-up`, userData);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  adminLogin: async (credentials) => {
    try {
      console.log('Sending admin login request to:', `${API_URL}/admin/admin-login`);
      const response = await axios.post(`${API_URL}/admin/admin-login`, credentials);
      console.log('Admin login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Movie services
export const movieService = {
  getAllMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },
  
  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
  
  addMovie: async (movieData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },
  
  updateMovie: async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
  },
  
  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  }
};

// Booking services
export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      console.log('Booking service response:', response);
      return response;
    } catch (error) {
      console.error('Booking service error:', error);
      throw error;
    }
  },
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
};

// User services
export const userService = {
  getAllUsers: () => api.get('/users/get-all-users'),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

export default api; 