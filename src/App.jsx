import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Academics } from './pages/public/Academics';
import { Admissions } from './pages/public/Admissions';
import { ApplyAdmission } from './pages/public/ApplyAdmission';
import { Events } from './pages/public/Events';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentResults } from './pages/student/StudentResults';
import { StudentAnnouncements } from './pages/student/StudentAnnouncements';
import { StudentEvents } from './pages/student/StudentEvents';
import { Settings } from './pages/student/Settings';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { TeacherManagement } from './pages/admin/TeacherManagement';
import { ClassManagement } from './pages/admin/ClassManagement';
import { AttendanceManagement } from './pages/admin/AttendanceManagement';
import { AnnouncementsManagement } from './pages/admin/AnnouncementsManagement';
import { EventsManagement } from './pages/admin/EventsManagement';
import { AdmissionsManagement } from './pages/admin/AdmissionsManagement';
import { AcademicRecordsManagement } from './pages/admin/AcademicRecordsManagement';
import { HomepageCMS } from './pages/admin/HomepageCMS';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Visitor Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/admissions/apply" element={<ApplyAdmission />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Portal Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="attendance" element={<AttendanceManagement />} />
              <Route path="announcements" element={<AnnouncementsManagement />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="admissions" element={<AdmissionsManagement />} />
              <Route path="results" element={<AcademicRecordsManagement />} />
              <Route path="homepage" element={<HomepageCMS />} />
              <Route path="settings" element={<Settings />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Headmaster Portal Routes */}
            <Route path="/headmaster" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="attendance" element={<AttendanceManagement />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="announcements" element={<AnnouncementsManagement />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="admissions" element={<AdmissionsManagement />} />
              <Route path="homepage" element={<HomepageCMS />} />
              <Route path="settings" element={<Settings />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Student Portal Routes */}
            <Route path="/student" element={<DashboardLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="results" element={<StudentResults />} />
              <Route path="announcements" element={<StudentAnnouncements />} />
              <Route path="events" element={<StudentEvents />} />
              <Route path="settings" element={<Settings />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
