import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI } from '../../services/api';
import { CheckCircle, XCircle, Info, Calendar } from 'lucide-react';

export const StudentAttendance = () => {
  const { profile } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!profile?._id) return;
      try {
        const res = await attendanceAPI.getStudentAttendance(profile._id);
        setAttendance(res.data.summary);
        setRecords(res.data.records || []);
      } catch (err) {
        console.error('Error fetching student attendance details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const attendanceRate = attendance ? attendance.attendancePercentage : 100;

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      {/* Overview Dashboard */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        {/* Circle Progress */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500"
              strokeDasharray={`${attendanceRate}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black text-slate-900">{attendanceRate}%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Present</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Days</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{attendance?.totalDays || 0}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Present</p>
            <p className="text-xl font-bold text-emerald-800 mt-1">{attendance?.present || 0}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
            <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wide">Absent</p>
            <p className="text-xl font-bold text-rose-800 mt-1">{attendance?.absent || 0}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-center">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Leaves</p>
            <p className="text-xl font-bold text-amber-800 mt-1">{attendance?.leave || 0}</p>
          </div>
        </div>
      </div>

      {/* Attendance Log */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-900" />
            Attendance History Log
          </h2>
        </div>

        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((rec) => {
                  const statusColors = {
                    present: 'bg-emerald-50 text-emerald-800 border-emerald-100',
                    absent: 'bg-rose-50 text-rose-800 border-rose-100',
                    leave: 'bg-amber-50 text-amber-800 border-amber-100',
                  }[rec.status];

                  return (
                    <tr key={rec._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-900">
                        {new Date(rec.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded border uppercase text-[9px] font-bold ${statusColors}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {rec.status === 'present' ? 'Attended class' : rec.status === 'absent' ? 'Absent from session' : 'Granted leave approval'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs py-8">
            No attendance records exist in the database.
          </div>
        )}
      </div>
    </div>
  );
};
