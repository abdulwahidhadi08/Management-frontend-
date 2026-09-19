import React, { useState, useEffect } from 'react';
import { attendanceAPI, classAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Save } from 'lucide-react';

export const AttendanceManagement = () => {
  const { showToast } = useToast();
  
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('Grade 6');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [studentSheet, setStudentSheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load class list on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classAPI.getClasses();
        const data = res.data || [];
        setClassesList(data);
        if (data.length > 0) {
          setSelectedClass(data[0].name);
          setSelectedSection(data[0].section);
        }
      } catch (err) {
        console.warn('Failed to load class configuration');
      }
    };
    fetchClasses();
  }, []);

  const loadAttendanceSheet = async () => {
    if (!selectedClass || !selectedSection || !selectedDate) {
      showToast('Class, section, and date are required.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await attendanceAPI.getAttendanceSheet(selectedClass, selectedSection, selectedDate);
      setStudentSheet(res.data || []);
    } catch (err) {
      showToast('Failed to load attendance sheet.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudentSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleBulkMark = (status) => {
    setStudentSheet((prev) => prev.map((item) => ({ ...item, status })));
  };

  const handleSaveAttendance = async () => {
    setSaveLoading(true);
    try {
      const recordsPayload = studentSheet.map((item) => ({
        studentId: item.studentId,
        status: item.status,
      }));
      await attendanceAPI.saveAttendance(selectedDate, recordsPayload);
      showToast('Attendance sheet saved successfully!', 'success');
      loadAttendanceSheet();
    } catch (err) {
      showToast('Failed to save attendance.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-950 tracking-tight font-serif">Attendance Management Board</h1>
        <p className="text-xs text-slate-600 mt-1">
          Select grade metrics, toggle present status, and commit bulk attendance to database storage.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Class select */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Class Grade</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:outline-none min-w-[120px]"
            >
              {[...new Set(classesList.map((c) => c.name))].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Section select */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:outline-none min-w-[100px]"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={loadAttendanceSheet}
          disabled={loading}
          className="bg-[#044e36] hover:bg-[#022c22] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all mt-4 md:mt-0 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" /> Fetch Attendance Sheet
            </>
          )}
        </button>
      </div>

      {studentSheet.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-6">
          {/* Bulk buttons */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBulkMark('present')}
                className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleBulkMark('absent')}
                className="bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
              >
                Mark All Absent
              </button>
            </div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
              {studentSheet.length} Students Listed
            </span>
          </div>

          {/* Sheet Table */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Present</th>
                  <th className="px-6 py-3 text-center">Absent</th>
                  <th className="px-6 py-3 text-center">Leave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {studentSheet.map((record) => (
                  <tr key={record.studentId} className="hover:bg-slate-50/80">
                    <td className="px-6 py-3.5 font-mono">{record.rollNo}</td>
                    <td className="px-6 py-3.5 text-slate-950 font-bold">{record.fullName}</td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="radio"
                        name={`status-${record.studentId}`}
                        checked={record.status === 'present'}
                        onChange={() => handleStatusChange(record.studentId, 'present')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="radio"
                        name={`status-${record.studentId}`}
                        checked={record.status === 'absent'}
                        onChange={() => handleStatusChange(record.studentId, 'absent')}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <input
                        type="radio"
                        name={`status-${record.studentId}`}
                        checked={record.status === 'leave'}
                        onChange={() => handleStatusChange(record.studentId, 'leave')}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleSaveAttendance}
              disabled={saveLoading}
              className="bg-[#044e36] hover:bg-[#022c22] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {saveLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Attendance...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Attendance Sheet
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs font-semibold shadow-sm">
          No student sheets loaded. Select parameters and click Fetch above.
        </div>
      )}
    </div>
  );
};
export default AttendanceManagement;
