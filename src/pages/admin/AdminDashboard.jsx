import React, { useState, useEffect } from 'react';
import { studentAPI, teacherAPI, admissionAPI, eventAPI, classAPI } from '../../services/api';
import { BarChart, DonutChart, AreaChart } from '../../components/Charts';
import { Users, UserCheck, FileCode, Calendar, School, ClipboardList } from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingAdmissions: 0,
    upcomingEvents: 0,
    presentToday: 4,
    absentToday: 1,
  });

  const [chartsData, setChartsData] = useState({
    enrollmentByClass: [],
    attendanceTrends: [],
    admissionStatus: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [studentsRes, teachersRes, admissionsRes, eventsRes, classesRes] = await Promise.all([
          studentAPI.getStudents(),
          teacherAPI.getTeachers(),
          admissionAPI.getAdmissions(),
          eventAPI.getEvents(),
          classAPI.getClasses(),
        ]);

        const students = studentsRes.data || [];
        const teachers = teachersRes.data || [];
        const admissions = admissionsRes.data || [];
        const events = eventsRes.data || [];
        const classes = classesRes.data || [];

        // Count pending admissions
        const pending = admissions.filter((a) => a.status === 'pending').length;
        const approved = admissions.filter((a) => a.status === 'approved').length;
        const rejected = admissions.filter((a) => a.status === 'rejected').length;

        // Count upcoming events
        const upcoming = events.filter((e) => e.status === 'upcoming').length;

        setMetrics({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalClasses: classes.length,
          pendingAdmissions: pending,
          upcomingEvents: upcoming,
          presentToday: 4, // Seeded mock daily attendance rates
          absentToday: 1,
        });

        // 1. Compile class distribution
        const classCounts = {};
        students.forEach((s) => {
          classCounts[s.class] = (classCounts[s.class] || 0) + 1;
        });
        const enrollment = Object.keys(classCounts).map((className) => ({
          label: className,
          value: classCounts[className],
        }));

        // 2. Compile admission distribution
        const admissionStats = [
          { label: 'Pending', value: pending, color: '#f59e0b' },
          { label: 'Approved', value: approved, color: '#10b981' },
          { label: 'Rejected', value: rejected, color: '#f43f5e' },
        ];

        // 3. Compile mock monthly attendance trends
        const attendance = [
          { label: 'Mon', value: 92 },
          { label: 'Tue', value: 95 },
          { label: 'Wed', value: 88 },
          { label: 'Thu', value: 94 },
          { label: 'Fri', value: 96 },
        ];

        setChartsData({
          enrollmentByClass: enrollment.length > 0 ? enrollment : [{ label: 'Grade 6', value: students.length }],
          admissionStatus: admissionStats,
          attendanceTrends: attendance,
        });
      } catch (err) {
        console.error('Error compiled dashboard charts', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: metrics.totalStudents, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Total Teachers', value: metrics.totalTeachers, icon: UserCheck, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { label: 'School Classes', value: metrics.totalClasses, icon: School, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: 'Pending Admissions', value: metrics.pendingAdmissions, icon: FileCode, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Present Today', value: metrics.presentToday, icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Upcoming Events', value: metrics.upcomingEvents, icon: Calendar, color: 'bg-sky-50 text-sky-600 border-sky-100' },
  ];

  return (
    <div className="space-y-8 text-slate-700">
      {/* Top Header Card */}
      <div>
        <h1 className="text-xl font-bold text-slate-950 tracking-tight">Principal Dashboard Console</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review core statistics, student enrollment distribution, and daily attendance logs.
        </p>
      </div>

      {/* Numerical Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${c.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{c.label}</p>
                <h3 className="text-lg font-black text-slate-900 mt-0.5 leading-none">{c.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Enrollment */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
            Enrollment by Class
          </h3>
          <div className="pt-2">
            <BarChart data={chartsData.enrollmentByClass} height={160} />
          </div>
        </div>

        {/* Chart 2: Attendance Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
            Attendance Rate Weekly (%)
          </h3>
          <div className="pt-2">
            <AreaChart data={chartsData.attendanceTrends} height={160} />
          </div>
        </div>

        {/* Chart 3: Admission Requests */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
            Admissions Board Applications
          </h3>
          <div className="pt-4">
            <DonutChart data={chartsData.admissionStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
