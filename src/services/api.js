import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://management-backend-rho.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

export const studentAPI = {
  getStudents: (params) => api.get('/students', { params }),
  getStudentById: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export const teacherAPI = {
  getTeachers: (params) => api.get('/teachers', { params }),
  getTeacherById: (id) => api.get(`/teachers/${id}`),
  createTeacher: (data) => api.post('/teachers', data),
  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/teachers/${id}`),
};

export const classAPI = {
  getClasses: () => api.get('/classes'),
  getClassById: (id) => api.get(`/classes/${id}`),
  createClass: (data) => api.post('/classes', data),
  updateClass: (id, data) => api.put(`/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/classes/${id}`),
};

export const attendanceAPI = {
  getAttendanceSheet: (className, section, date) =>
    api.get('/attendance', { params: { class: className, section, date } }),
  saveAttendance: (date, records) => api.post('/attendance', { date, records }),
  getStudentAttendance: (studentId) => api.get(`/attendance/student/${studentId}`),
};

export const announcementAPI = {
  getAnnouncements: () => api.get('/announcements'),
  getAnnouncementById: (id) => api.get(`/announcements/${id}`),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export const eventAPI = {
  getEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  registerStudent: (id) => api.post(`/events/${id}/register`),
};

export const admissionAPI = {
  apply: (data) => api.post('/admissions/apply', data),
  getAdmissions: (params) => api.get('/admissions', { params }),
  getAdmissionById: (id) => api.get(`/admissions/${id}`),
  updateStatus: (id, status) => api.put(`/admissions/${id}/status`, { status }),
};

export const recordAPI = {
  addResult: (data) => api.post('/records', data),
  getStudentResults: (studentId) => api.get(`/records/student/${studentId}`),
  deleteResult: (id) => api.delete(`/records/${id}`),
};

export const contentAPI = {
  getSchoolContent: () => api.get('/content'),
  getSchoolStats: () => api.get('/content/stats'),
  updateSchoolContent: (data) => api.put('/content', data),
};

export default api;
