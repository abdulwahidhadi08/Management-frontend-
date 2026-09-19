import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recordAPI } from '../../services/api';
import { Award, FileSpreadsheet, Calendar } from 'lucide-react';

export const StudentResults = () => {
  const { profile } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!profile?._id) return;
      try {
        const res = await recordAPI.getStudentResults(profile._id);
        const data = res.data || [];
        setRecords(data);
        
        // Find unique terms and default to the first one available
        const terms = [...new Set(data.map((r) => r.examTerm))];
        if (terms.length > 0) {
          setSelectedTerm(terms[0]);
        }
      } catch (err) {
        console.error('Error fetching academic results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Get unique terms for selection tabs
  const terms = [...new Set(records.map((r) => r.examTerm))];

  // Filter records by selected term
  const termRecords = records.filter((r) => r.examTerm === selectedTerm);

  // Calculate totals
  const totalMarksSum = termRecords.reduce((sum, r) => sum + r.totalMarks, 0);
  const obtainedMarksSum = termRecords.reduce((sum, r) => sum + r.obtainedMarks, 0);
  const averagePercentage = totalMarksSum > 0 ? Math.round((obtainedMarksSum / totalMarksSum) * 100) : 0;

  // Derive overall grade
  const getOverallGrade = (pct) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  const overallGrade = getOverallGrade(averagePercentage);

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-900" /> Academic Results Report
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Review grade sheets, subject marks, and teacher remarks.
          </p>
        </div>
      </div>

      {terms.length > 0 ? (
        <>
          {/* Term Selection Tabs */}
          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
            {terms.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`py-3 px-5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  selectedTerm === t
                    ? 'border-blue-900 text-blue-900 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overall Marks</p>
              <h3 className="text-lg font-black text-slate-950 mt-1.5">{obtainedMarksSum} / {totalMarksSum}</h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Aggregated Exam Score</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Percentage</p>
              <h3 className="text-lg font-black text-slate-950 mt-1.5">{averagePercentage}%</h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Average Evaluation Rate</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overall Grade</p>
              <h3 className="text-lg font-black text-blue-700 mt-1.5">{overallGrade}</h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Derived Performance Class</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3 text-center">Total Marks</th>
                    <th className="px-6 py-3 text-center">Obtained Marks</th>
                    <th className="px-6 py-3 text-center">Grade</th>
                    <th className="px-6 py-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {termRecords.map((rec) => (
                    <tr key={rec._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-900 font-extrabold">{rec.subject}</td>
                      <td className="px-6 py-4 text-center font-mono">{rec.totalMarks}</td>
                      <td className="px-6 py-4 text-center font-mono text-slate-900">{rec.obtainedMarks}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rec.grade === 'A+' || rec.grade === 'A'
                            ? 'bg-blue-50 text-blue-800'
                            : rec.grade === 'B'
                            ? 'bg-emerald-50 text-emerald-800'
                            : rec.grade === 'C' || rec.grade === 'D'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}>
                          {rec.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-normal leading-relaxed">{rec.remarks || 'No remarks provided.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold shadow-sm">
          No exam results or academic report records are available for your profile.
        </div>
      )}
    </div>
  );
};
