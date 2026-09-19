import React, { useState, useEffect } from 'react';
import { BookOpen, ShieldAlert, Award, FileText, Bell, Sparkles } from 'lucide-react';
import { announcementAPI } from '../../services/api';

export const Academics = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementAPI.getAnnouncements({ publicOnly: 'true' });
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error('Error fetching announcements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const curriculum = [
    { title: 'Mathematics', desc: 'Pre-algebra, basic geometry, fractions, and logical problem solving.', icon: Award },
    { title: 'Science & Lab', desc: 'General biology, basic chemical reactions, and earth sciences with practical experiments.', icon: Sparkles },
    { title: 'English Literature', desc: 'Creative writing, reading comprehension, spelling, and analytical essay drafting.', icon: BookOpen },
    { title: 'History & Civics', desc: 'World civilisations, national history timelines, and basic community governance.', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Learning & notices</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mt-1.5">
          Academics & School Notice Board
        </h1>
        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
          Explore our curriculum structure and stay informed with published updates from the administration board.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Curriculum info */}
        <div className="col-span-1 lg:col-span-2 space-y-12">
          {/* Middle school structure */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight font-serif">Academic Curriculum (Grade 1 - Grade 12)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {curriculum.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-900 text-white rounded-xl p-8 shadow">
            <h3 className="text-base font-bold tracking-tight">Grading Criteria & Evaluations</h3>
            <p className="text-xs text-blue-200 mt-2 leading-relaxed">
              Horizon International operates on a term-by-term assessment system. Evaluations combine:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-blue-100 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Mid-Term Examinations (40%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Final-Term Examinations (50%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Class Attendance & Projects (10%)
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Announcements Notice Board */}
        <div>
          <div className="border-b border-slate-200 pb-3 mb-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-900" />
              Notice Board
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann._id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
                  {ann.isImportant && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg tracking-wide uppercase flex items-center gap-0.5">
                      <ShieldAlert className="w-2.5 h-2.5" /> Important
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(ann.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} | <span className="text-blue-600">{ann.category}</span>
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{ann.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                    {ann.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm text-center text-slate-400 text-xs font-semibold">
              No notices published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
