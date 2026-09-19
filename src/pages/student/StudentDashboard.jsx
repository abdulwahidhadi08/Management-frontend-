import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { announcementAPI, eventAPI, attendanceAPI, recordAPI } from '../../services/api';
import { Calendar, Bell, Award, UserCheck, BookOpen, Clock } from 'lucide-react';

export const StudentDashboard = () => {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!profile?._id) return;
      try {
        const [annRes, eventRes, attRes, recRes] = await Promise.all([
          announcementAPI.getAnnouncements({ publicOnly: 'true' }),
          eventAPI.getEvents({ publicOnly: 'true' }),
          attendanceAPI.getStudentAttendance(profile._id),
          recordAPI.getStudentResults(profile._id),
        ]);

        setAnnouncements((annRes.data || []).slice(0, 3));
        
        // Find registered events or upcoming events
        const upcoming = (eventRes.data || []).filter((e) => e.status === 'upcoming');
        setEvents(upcoming.slice(0, 2));

        setAttendance(attRes.data.summary);
        setResults(recRes.data || []);
      } catch (err) {
        console.error('Error loading student dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-[#044e36] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate results GPA / Average
  const averageObtained = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.obtainedMarks, 0) / results.length)
    : null;

  const stats = [
    { label: 'Attendance Rate', value: `${attendance?.attendancePercentage || 100}%`, detail: `${attendance?.present || 0}/${attendance?.totalDays || 0} Days Present`, icon: UserCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Average Marks', value: averageObtained !== null ? `${averageObtained}%` : 'N/A', detail: `${results.length} Subjects Graded`, icon: Award, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Class Rank Roll', value: `#${profile?.rollNo || '-'}`, detail: `Grade: ${profile?.class || '-'} - ${profile?.section || '-'}`, icon: BookOpen, color: 'bg-emerald-50/70 text-emerald-900 border-emerald-200' },
  ];

  return (
    <div className="space-y-6 text-slate-700">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#044e36] to-[#065f46] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-serif text-white">Welcome back, {profile?.fullName}!</h1>
          <p className="text-xs text-amber-400 mt-1 font-semibold">
            Vanguard Academy Student Portal. Read notices and review your scores.
          </p>
        </div>
        <div className="bg-emerald-950/80 text-xs px-4 py-2 border border-amber-500/40 rounded-xl shadow-inner">
          <span className="font-semibold text-slate-300">Student ID:</span> <span className="font-bold text-amber-400 font-mono">{profile?.studentId}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                <h3 className="text-xl font-black text-slate-950 mt-0.5 leading-none">{s.value}</h3>
                <p className="text-[11px] text-slate-600 font-bold mt-1.5">{s.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Announcements list */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-950 tracking-tight flex items-center gap-2 mb-6 border-b border-slate-100 pb-3 font-serif">
              <Bell className="w-4 h-4 text-[#044e36]" />
              Notice Board Announcements
            </h2>

            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann._id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative overflow-hidden">
                    {ann.isImportant && (
                      <span className="absolute top-0 right-0 bg-rose-700 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                        Important
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {new Date(ann.date).toLocaleDateString()} • <span className="text-[#044e36] font-extrabold">{ann.category}</span>
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-950 mt-1">{ann.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{ann.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 text-xs py-8 font-semibold">No notices available.</div>
            )}
          </div>
        </div>

        {/* Right Column: Events */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-950 tracking-tight flex items-center gap-2 mb-6 border-b border-slate-100 pb-3 font-serif">
            <Calendar className="w-4 h-4 text-[#044e36]" />
            Upcoming Activities
          </h2>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((evt) => (
                <div key={evt._id} className="flex gap-3.5 items-start">
                  <div className="w-11 h-11 bg-[#044e36] text-white rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm border border-emerald-900">
                    <span className="text-sm font-bold leading-none font-serif">{new Date(evt.date).getDate()}</span>
                    <span className="text-[8px] font-extrabold uppercase mt-0.5 tracking-wider">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-950 truncate">{evt.title}</h3>
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-amber-700" /> {evt.startTime} | {evt.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs py-8 font-semibold">No upcoming events.</div>
          )}
        </div>
      </div>
    </div>
  );
};
