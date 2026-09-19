import React, { useState } from 'react';
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  School,
  CalendarDays,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  FileCode,
  Globe,
  Award,
  ChevronRight,
  User,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, profile, logout, loading, isAdmin, isHeadmaster, isStudent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#044e36] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-600 font-bold">Verifying secure portal session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Enforce Role-Based Route Protection
  const currentPath = location.pathname;
  if (isStudent && (currentPath.startsWith('/admin') || currentPath.startsWith('/headmaster'))) {
    return <Navigate to="/student/dashboard" replace />;
  }
  if ((isAdmin || isHeadmaster) && currentPath.startsWith('/student')) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/headmaster/dashboard"} replace />;
  }

  // Define navigation items based on role
  const getNavLinks = () => {
    if (isAdmin) {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/students', label: 'Students', icon: Users },
        { path: '/admin/teachers', label: 'Teachers', icon: UserCheck },
        { path: '/admin/classes', label: 'Classes', icon: School },
        { path: '/admin/attendance', label: 'Attendance', icon: FileText },
        { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/admin/events', label: 'Events', icon: CalendarDays },
        { path: '/admin/admissions', label: 'Admissions', icon: FileCode },
        { path: '/admin/results', label: 'Academic Records', icon: Award },
        { path: '/admin/homepage', label: 'Homepage CMS', icon: Globe },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
      ];
    } else if (isHeadmaster) {
      return [
        { path: '/headmaster/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/headmaster/students', label: 'Students', icon: Users },
        { path: '/headmaster/attendance', label: 'Attendance', icon: FileText },
        { path: '/headmaster/classes', label: 'Classes', icon: School },
        { path: '/headmaster/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/headmaster/events', label: 'Events', icon: CalendarDays },
        { path: '/headmaster/admissions', label: 'Admissions', icon: FileCode },
        { path: '/headmaster/homepage', label: 'Homepage CMS', icon: Globe },
        { path: '/headmaster/settings', label: 'Settings', icon: Settings },
      ];
    } else if (isStudent) {
      return [
        { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/student/profile', label: 'My Profile', icon: User },
        { path: '/student/attendance', label: 'My Attendance', icon: FileText },
        { path: '/student/results', label: 'Academic Results', icon: Award },
        { path: '/student/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/student/events', label: 'Events', icon: CalendarDays },
        { path: '/student/settings', label: 'Settings', icon: Settings },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  // Get display name and secondary information
  const getHeaderInfo = () => {
    if (isAdmin) return { name: 'Principal / Admin', detail: 'System Root Authority' };
    if (isHeadmaster) return { name: profile?.fullName || 'Headmaster', detail: 'Academic Operations' };
    return { name: profile?.fullName || 'Student', detail: `Roll No: ${profile?.rollNo || '-'} | Class: ${profile?.class || '-'}` };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#022c22] text-slate-200 border-r border-emerald-900/50 shrink-0 shadow-xl">
        {/* Sidebar Brand Header */}
        <div className="h-20 flex items-center gap-3 px-5 border-b border-emerald-900/60 bg-[#011e17]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#044e36] to-emerald-900 rounded-xl flex items-center justify-center text-amber-400 font-bold border border-amber-500/40 shadow shrink-0">
            <GraduationCap className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-extrabold text-white tracking-tight truncate font-serif">Vanguard Academy</h2>
            <p className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase leading-none mt-0.5">
              Portal System
            </p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3.5 py-5 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md font-extrabold'
                      : 'text-slate-300 hover:bg-emerald-900/50 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar User Footer */}
        <div className="p-4 border-t border-emerald-900/60 bg-[#011e17] flex flex-col gap-2">
          <div className="flex items-center gap-3 px-1">
            {profile?.photo ? (
              <img src={profile.photo} alt="Avatar" className="w-8 h-8 rounded-lg object-cover border border-amber-500/40 shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                {headerInfo.name.charAt(0)}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{headerInfo.name}</p>
              <p className="text-[10px] text-slate-300 truncate">{headerInfo.detail}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors mt-1 border border-rose-900/40"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Menu Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/70 backdrop-blur-sm">
          <div className="w-64 bg-[#022c22] text-slate-200 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Mobile Sidebar Brand */}
            <div className="h-20 flex items-center justify-between px-5 border-b border-emerald-900/60 bg-[#011e17]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#044e36] to-emerald-900 rounded-xl flex items-center justify-center text-amber-400 font-bold border border-amber-500/40">
                  <GraduationCap className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold text-white font-serif">Vanguard Academy</h2>
                  <p className="text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">Portal System</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-emerald-900 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Sidebar Links */}
            <nav className="flex-1 px-3.5 py-5 space-y-1 overflow-y-auto" onClick={() => setSidebarOpen(false)}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive ? 'bg-amber-600 text-white shadow font-extrabold' : 'text-slate-300 hover:bg-emerald-900/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-emerald-900/60 bg-[#011e17] flex flex-col gap-2">
              <div className="flex items-center gap-3 px-1">
                {profile?.photo ? (
                  <img src={profile.photo} alt="Avatar" className="w-8 h-8 rounded-lg object-cover border border-amber-500/40" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
                    {headerInfo.name.charAt(0)}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{headerInfo.name}</p>
                  <p className="text-[10px] text-slate-300 truncate">{headerInfo.detail}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  logout();
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
              </button>
            </div>
          </div>
          {/* Backdrop Closer */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:hidden border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Header Brand Badge & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#044e36] text-amber-400 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0 border border-amber-500/30">
                <GraduationCap className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight font-serif">
                  Vanguard Academy
                </h1>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 leading-none mt-0.5">
                  <span className="text-slate-500">Portal</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-[#044e36] font-bold tracking-wide capitalize">
                    {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Public Website Button */}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-[#044e36]" />
              <span className="hidden sm:inline">Public Website</span>
            </Link>

            <span className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Profile badge */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-950 leading-tight">{headerInfo.name}</p>
                <p className="text-[10px] text-slate-600 font-semibold">{user.email}</p>
              </div>
              {profile?.photo ? (
                <img src={profile.photo} alt="Avatar" className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-sm" />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-[#044e36] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {headerInfo.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Outlet / Dashboard View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
