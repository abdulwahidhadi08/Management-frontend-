import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bell, ChevronRight, GraduationCap, Award, BookOpen, ShieldAlert } from 'lucide-react';
import { contentAPI, announcementAPI, eventAPI } from '../../services/api';

export const Home = () => {
  const [content, setContent] = useState(null);
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contentRes, statsRes, announcementsRes, eventsRes] = await Promise.all([
          contentAPI.getSchoolContent(),
          contentAPI.getSchoolStats(),
          announcementAPI.getAnnouncements({ publicOnly: 'true' }),
          eventAPI.getEvents({ publicOnly: 'true' }),
        ]);

        setContent(contentRes.data);
        setStats(statsRes.data);
        // Show up to 3 announcements
        setAnnouncements((announcementsRes.data || []).slice(0, 3));
        // Show up to 3 upcoming events (that are upcoming/not completed)
        const upcomingEvents = (eventsRes.data || [])
          .filter((e) => e.status === 'upcoming')
          .slice(0, 3);
        setEvents(upcomingEvents);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback default content if DB is empty or still booting
  const schoolName = content?.schoolName || 'Vanguard Academy';
  const tagline = content?.tagline || 'Excellence in Education, Leadership in Character.';
  const heroHeading = content?.heroHeading || 'Welcome to Vanguard Academy';
  const heroDescription = content?.heroDescription || 'A prestigious educational institution dedicated to cultivating academic excellence, leadership, and integrity in our scholars.';
  const heroImage = content?.heroImage || '/src/assets/hero.png'; // default fallback image
  
  const statsList = [
    { value: `${stats?.students || 0}+`, label: 'Active Students', icon: GraduationCap },
    { value: `${stats?.teachers || 0}+`, label: 'Expert Educators', icon: Award },
    { value: stats?.classes || 0, label: 'Course Classes', icon: BookOpen },
    { value: `${stats?.yearsOfExcellence || 25}+`, label: 'Years of Excellence', icon: Calendar },
  ];

  return (
    <div className="flex flex-col min-w-0">
      {/* 1. Hero Section */}
      <section className="relative bg-brand-primary-dark overflow-hidden min-h-[550px] flex items-center">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="School Campus"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021811] via-brand-primary-dark/95 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white w-full">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight font-serif">
              {heroHeading}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              {heroDescription}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/admissions/apply"
                className="bg-brand-accent hover:bg-brand-accent-light text-white text-xs font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
              >
                Apply for Admission
              </Link>
              <Link
                to="/login"
                className="bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs font-bold px-7 py-3.5 rounded-full transition-all uppercase tracking-wider"
              >
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white border border-brand-primary/10 py-10 relative z-10 -mt-12 max-w-5xl mx-auto w-[90%] rounded-2xl shadow-2xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-6 divide-y-2 lg:divide-y-0 lg:divide-x divide-slate-100">
          {statsList.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center text-center p-4 first:pt-4 pt-6 lg:pt-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Leadership Messages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight font-serif">Our School Leadership</h2>
          <p className="mt-2.5 text-sm text-slate-500 font-medium">{tagline}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Principal message */}
          {content?.principalName && (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-start">
              {content.principalPhoto ? (
                <img
                  src={content.principalPhoto}
                  alt={content.principalName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-100 shadow"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-brand-primary text-white shrink-0 flex items-center justify-center font-bold text-2xl shadow">
                  EC
                </div>
              )}
              <div className="flex-1">
                <span className="text-[10px] font-bold text-brand-accent tracking-wider uppercase">
                  {content.principalDesignation || 'Principal & Academic Director'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{content.principalName}</h3>
                <p className="mt-4 text-xs font-semibold text-slate-600 leading-relaxed italic border-l-2 border-brand-accent/50 pl-4 py-1">
                  "{content.principalMessage}"
                </p>
              </div>
            </div>
          )}

          {/* Headmaster message */}
          {content?.headmasterName && (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-start">
              {content.headmasterPhoto ? (
                <img
                  src={content.headmasterPhoto}
                  alt={content.headmasterName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-100 shadow"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-brand-primary-light text-white shrink-0 flex items-center justify-center font-bold text-2xl shadow">
                  AP
                </div>
              )}
              <div className="flex-1">
                <span className="text-[10px] font-bold text-brand-accent tracking-wider uppercase">
                  Headmaster & Admissions Board
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{content.headmasterName}</h3>
                <p className="mt-4 text-xs font-semibold text-slate-600 leading-relaxed italic border-l-2 border-brand-accent/50 pl-4 py-1">
                  "{content.headmasterMessage}"
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Announcements & Events Section */}
      <section className="bg-brand-bg-warm border-y border-slate-200/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Announcements */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-serif">
                <Bell className="w-5 h-5 text-brand-primary" />
                Latest Announcements
              </h2>
              <Link to="/academics" className="text-xs font-bold text-brand-accent hover:text-brand-accent-light flex items-center">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((ann, i) => (
                  <div key={ann._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
                    {ann.isImportant && (
                      <span className="absolute top-0 right-0 bg-rose-700 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-bl-lg tracking-wide uppercase flex items-center gap-0.5">
                        <ShieldAlert className="w-3 h-3" /> Important
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(ann.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      <span className="mx-2">•</span>
                      <span className="text-brand-primary font-extrabold">{ann.category}</span>
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{ann.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2.5 line-clamp-3">
                      {ann.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center text-slate-400 text-xs font-semibold">
                No recent announcements available.
              </div>
            )}
          </div>

          {/* Events */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-serif">
                <Calendar className="w-5 h-5 text-brand-primary" />
                Upcoming Events
              </h2>
              <Link to="/events" className="text-xs font-bold text-brand-accent hover:text-brand-accent-light flex items-center">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((evt, i) => (
                  <div key={evt._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-4 items-center hover:shadow-md transition-shadow">
                    {/* Date Block */}
                    <div className="w-14 h-14 bg-brand-primary text-white rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <span className="text-lg font-bold leading-none font-serif">
                        {new Date(evt.date).getDate()}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-1">
                        {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {evt.startTime} - {evt.endTime} | {evt.location}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 truncate">{evt.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center text-slate-400 text-xs font-semibold">
                No upcoming events scheduled.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5. CTA Footer Section */}
      <section className="bg-brand-primary-dark text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,95,70,0.15),transparent)] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">Admissions are Open for the Next Academic Year</h2>
          <p className="mt-4 text-sm text-brand-accent-light max-w-xl mx-auto leading-relaxed">
            Give your child the opportunity to learn, grow, and lead in a structured, values-based educational environment at Vanguard.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/admissions"
              className="bg-white hover:bg-brand-bg-warm text-brand-primary text-xs font-extrabold px-7 py-3.5 rounded-full shadow-lg transition-all uppercase tracking-wider"
            >
              Admissions Info
            </Link>
            <Link
              to="/admissions/apply"
              className="bg-brand-accent hover:bg-brand-accent-light text-white text-xs font-extrabold px-7 py-3.5 rounded-full shadow-lg transition-all uppercase tracking-wider"
            >
              Apply Online Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
