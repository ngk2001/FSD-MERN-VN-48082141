import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const searchFlights = async (params) => {
    const res = await api.get('/flights', { params });
    return res.data;
};

export const getMyBookings = async () => {
    const res = await api.get('/bookings/my-bookings');
    return res.data;
};

export const createBooking = async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
};

export const cancelBooking = async (bookingId) => {
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data;
};

export const getRescheduleOptions = async (bookingId) => {
    const res = await api.get(`/bookings/${bookingId}/reschedule-options`);
    return res.data;
};

export const rescheduleBooking = async (bookingId, newFlightId) => {
    const res = await api.put(`/bookings/${bookingId}/reschedule`, { newFlightId });
    return res.data;
};


export const getAdminFlights = async () => {
    const res = await api.get('/flights');
    return res.data;
};

export const createFlight = async (flightData) => {
    const res = await api.post('/flights', flightData);
    return res.data;
};

export const deleteFlight = async (flightId) => {
    const res = await api.delete(`/flights/${flightId}`);
    return res.data;
};

export const getAllBookings = async () => {
    const res = await api.get('/bookings');
    return res.data;
};

export const updateBooking = async (bookingId, status) => {
    const res = await api.put(`/bookings/${bookingId}`, { status });
    return res.data;
};

export const loginUser = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
};

export const registerUser = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
};

export const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
};

export default api;
