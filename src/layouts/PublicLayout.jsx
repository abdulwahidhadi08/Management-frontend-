import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, GraduationCap, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { contentAPI } from '../services/api';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: 'Vanguard Academy',
    tagline: 'Excellence in Education, Leadership in Character.',
    address: '102 Academic Boulevard, Education District, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@vanguardacademy.com',
    logo: '',
    facebookUrl: '#',
    twitterUrl: '#',
    instagramUrl: '#',
    linkedinUrl: '#',
  });

  const location = useLocation();

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await contentAPI.getSchoolContent();
        if (res.data) {
          setSchoolInfo(res.data);
        }
      } catch (err) {
        console.warn('Could not load school content from API, using defaults');
      }
    };
    fetchContent();
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/academics', label: 'Academics' },
    { path: '/admissions', label: 'Admissions' },
    { path: '/events', label: 'Events' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Banner Info Bar */}
      <div className="bg-[#022c22] text-slate-200 text-xs py-2.5 px-4 border-b border-emerald-900/50 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-5 text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {schoolInfo.phone}
            </span>
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {schoolInfo.email}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-none">{schoolInfo.address}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo / Brand Header */}
          <Link to="/" className="flex items-center gap-3.5 group py-1">
            {schoolInfo.logo ? (
              <img src={schoolInfo.logo} alt="School Logo" className="w-12 h-12 object-contain rounded-lg border border-slate-100 shadow-sm" />
            ) : (
              /* Custom Styled Academic Emblem */
              <div className="w-12 h-12 bg-gradient-to-br from-[#044e36] to-[#022c22] rounded-xl flex items-center justify-center text-amber-400 shadow-md border-2 border-amber-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <GraduationCap className="w-7 h-7 stroke-[2]" />
              </div>
            )}
            
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-[#044e36] transition-colors font-serif">
                {schoolInfo.schoolName}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-amber-700 font-extrabold tracking-wider uppercase leading-none mt-0.5">
                School Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#044e36] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#044e36] hover:bg-emerald-50/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Portal Login Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full text-xs font-extrabold transition-all shadow-md hover:shadow-lg transform active:scale-95 uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              Portal Login
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all focus:outline-none border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive ? 'bg-[#044e36] text-white shadow' : 'text-slate-700 hover:bg-emerald-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/login"
              className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4" />
              Portal Login
            </Link>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Structured School Footer */}
      <footer className="bg-[#022c22] text-slate-300 border-t border-emerald-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* School Blurb */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight font-serif">{schoolInfo.schoolName}</h2>
                  <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Collegiate Academy Portal</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-medium">
                {schoolInfo.tagline}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                A premier academic institution fostering innovation, strong character, and a lifelong pursuit of excellence in our scholars.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-amber-400 text-xs font-extrabold tracking-wider uppercase mb-4 border-b border-emerald-800/80 pb-2">Quick Links</h3>
              <ul className="space-y-2.5 text-xs font-semibold">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-slate-300 hover:text-amber-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">
                    Portal Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-amber-400 text-xs font-extrabold tracking-wider uppercase mb-4 border-b border-emerald-800/80 pb-2">Get In Touch</h3>
              <ul className="space-y-3.5 text-xs font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{schoolInfo.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-300">{schoolInfo.phone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-300">{schoolInfo.email}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="mt-14 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
            <p>&copy; {new Date().getFullYear()} {schoolInfo.schoolName}. All rights reserved.</p>
            <div className="flex gap-4">
              <a href={schoolInfo.facebookUrl} className="hover:text-amber-400 transition-colors">Facebook</a>
              <a href={schoolInfo.twitterUrl} className="hover:text-amber-400 transition-colors">Twitter</a>
              <a href={schoolInfo.instagramUrl} className="hover:text-amber-400 transition-colors">Instagram</a>
              <a href={schoolInfo.linkedinUrl} className="hover:text-amber-400 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
