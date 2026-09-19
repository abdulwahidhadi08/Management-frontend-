import React, { useState, useEffect } from 'react';
import { studentAPI, recordAPI, classAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AcademicRecordsManagement = () => {
  const { showToast } = useToast();

  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    subject: 'Mathematics',
    totalMarks: 100,
    obtainedMarks: '',
    examTerm: 'Mid-Term Examination 2026',
    remarks: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const subjectsList = ['Mathematics', 'English Literature', 'General Science', 'History'];
  const termsList = ['Mid-Term Examination 2026', 'Final-Term Examination 2026'];

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

  // Fetch students when class or section changes
  useEffect(() => {
    const fetchStudentsList = async () => {
      if (!selectedClass || !selectedSection) return;
      setStudentLoading(true);
      try {
        const res = await studentAPI.getStudents({
          class: selectedClass,
          section: selectedSection,
        });
        const data = res.data || [];
        setStudents(data);
        setSelectedStudent(null);
        setResults([]);
      } catch (err) {
        showToast('Failed to load students for class.', 'error');
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudentsList();
  }, [selectedClass, selectedSection]);

  const fetchStudentResults = async (studentId) => {
    setLoading(true);
    try {
      const res = await recordAPI.getStudentResults(studentId);
      setResults(res.data || []);
    } catch (err) {
      showToast('Failed to load student results sheet.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentResults(student._id);
  };

  const openAddForm = () => {
    if (!selectedStudent) {
      showToast('Please select a student first.', 'warning');
      return;
    }
    setSelectedRecord(null);
    setFormData({
      subject: 'Mathematics',
      totalMarks: 100,
      obtainedMarks: '',
      examTerm: 'Mid-Term Examination 2026',
      remarks: '',
    });
    setIsFormOpen(true);
  };

  const openDeletePrompt = (rec) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        studentId: selectedStudent._id,
      };
      await recordAPI.addResult(payload);
      showToast('Academic score recorded successfully!', 'success');
      setIsFormOpen(false);
      fetchStudentResults(selectedStudent._id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save academic score.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitLoading(true);
    try {
      await recordAPI.deleteResult(selectedRecord._id);
      showToast('Academic score record deleted.', 'success');
      setIsDeleteOpen(false);
      fetchStudentResults(selectedStudent._id);
    } catch (err) {
      showToast('Failed to delete grade record.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-950 tracking-tight font-serif">Academic Records Management</h1>
        <p className="text-xs text-slate-600 mt-1">
          Select class and section parameters, select a student to load report cards, and record/edit subject scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Selector bar & student list */}
        <div className="space-y-4">
          {/* Class Selectors */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Class Grade</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:outline-none"
              >
                {[...new Set(classesList.map((c) => c.name))].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:outline-none"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
          </div>

          {/* Student list */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-4">
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">Students Registry</h3>
            
            {studentLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="w-5 h-5 border-2 border-[#044e36] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {students.map((std) => (
                  <button
                    key={std._id}
                    onClick={() => handleStudentSelect(std)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all ${
                      selectedStudent?._id === std._id
                        ? 'bg-[#044e36] text-white shadow font-extrabold'
                        : 'text-slate-800 hover:bg-emerald-50 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{std.fullName}</span>
                      <span className={`font-mono text-[10px] ${selectedStudent?._id === std._id ? 'text-amber-300' : 'text-slate-500'}`}>
                        Roll: {std.rollNo}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-6 text-xs font-semibold">No students in class.</div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Report card table */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          {selectedStudent ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 font-serif">{selectedStudent.fullName}'s Grades Report</h3>
                  <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Roll No: {selectedStudent.rollNo} | ID: {selectedStudent.studentId}</p>
                </div>
                <button
                  onClick={openAddForm}
                  className="bg-[#044e36] hover:bg-[#022c22] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Score
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-6 h-6 border-2 border-[#044e36] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Subject</th>
                        <th className="px-4 py-2.5 text-center">Exam Term</th>
                        <th className="px-4 py-2.5 text-center">Marks</th>
                        <th className="px-4 py-2.5 text-center">Grade</th>
                        <th className="px-4 py-2.5">Remarks</th>
                        <th className="px-4 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {results.map((rec) => (
                        <tr key={rec._id}>
                          <td className="px-4 py-3 font-extrabold text-slate-950">{rec.subject}</td>
                          <td className="px-4 py-3 text-center text-slate-600 font-medium">{rec.examTerm}</td>
                          <td className="px-4 py-3 text-center font-mono font-bold">{rec.obtainedMarks} / {rec.totalMarks}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-extrabold">{rec.grade}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-normal leading-relaxed">{rec.remarks || '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => openDeletePrompt(rec)}
                              className="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-10 font-semibold">No grades registered for student.</div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs font-semibold shadow-sm">
              Please select a student from the registry to review report cards.
            </div>
          )}
        </div>
      </div>

      {/* Scoring Record Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Record Student Score Details"
        size="sm"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Subject Title *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 focus:outline-none bg-white"
            >
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Examination Term *</label>
            <select
              name="examTerm"
              value={formData.examTerm}
              onChange={handleFormChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 focus:outline-none bg-white"
            >
              {termsList.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Total Marks *</label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Obtained Marks *</label>
              <input
                type="number"
                name="obtainedMarks"
                value={formData.obtainedMarks}
                onChange={handleFormChange}
                required
                max={formData.totalMarks}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Teacher Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleFormChange}
              rows="3"
              placeholder="Good logic. Can improve handwriting..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-[#044e36] hover:bg-[#022c22] text-white font-bold px-5 py-2 rounded-lg shadow disabled:opacity-50"
            >
              {submitLoading ? 'Saving Score...' : 'Save Score Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Record Prompt */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Grade Record?"
        message={`Are you sure you want to delete the score record for ${selectedRecord?.subject} (${selectedRecord?.examTerm})?`}
        type="danger"
        onConfirm={handleDeleteConfirm}
        loading={submitLoading}
      />
    </div>
  );
};
export default AcademicRecordsManagement;
