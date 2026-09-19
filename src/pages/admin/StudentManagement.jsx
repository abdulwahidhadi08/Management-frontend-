import React, { useState, useEffect } from 'react';
import { studentAPI, classAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Edit2, Trash2, Eye, Calendar, Award, PhoneCall, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FileUpload } from '../../components/FileUpload';

export const StudentManagement = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState('personal');

  // Form inputs state
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'male',
    class: 'Grade 6',
    section: 'A',
    rollNo: '',
    phone: '',
    email: '',
    address: '',
    photo: '',
    guardianName: '',
    guardianPhone: '',
    emergencyContact: '',
    status: 'active',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getStudents({
        search,
        class: classFilter,
        section: sectionFilter,
        status: statusFilter,
      });
      setStudents(res.data || []);
    } catch (err) {
      showToast('Failed to load students list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classFilter, sectionFilter, statusFilter]);

  // Load class list on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classAPI.getClasses();
        setClassesList(res.data || []);
      } catch (err) {
        console.warn('Failed to load classes');
      }
    };
    fetchClasses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  // Open Add Student Modal
  const openAddForm = () => {
    setSelectedStudent(null);
    setFormData({
      fullName: '',
      fatherName: '',
      motherName: '',
      dob: '',
      gender: 'male',
      class: classesList[0]?.name || 'Grade 6',
      section: classesList[0]?.section || 'A',
      rollNo: '',
      phone: '',
      email: '',
      address: '',
      photo: '',
      guardianName: '',
      guardianPhone: '',
      emergencyContact: '',
      status: 'active',
    });
    setIsFormOpen(true);
  };

  // Open Edit Student Modal
  const openEditForm = (student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      fatherName: student.fatherName,
      motherName: student.motherName,
      dob: student.dob ? student.dob.split('T')[0] : '',
      gender: student.gender,
      class: student.class,
      section: student.section,
      rollNo: student.rollNo,
      phone: student.phone,
      email: student.email,
      address: student.address,
      photo: student.photo || '',
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      emergencyContact: student.emergencyContact,
      status: student.status,
    });
    setIsFormOpen(true);
  };

  // Open View Details Modal
  const openViewDetails = async (student) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
    setDetailsLoading(true);
    setActiveDetailsTab('personal');
    try {
      const res = await studentAPI.getStudentById(student._id);
      setStudentDetails(res.data);
    } catch (err) {
      showToast('Failed to load student details.', 'error');
      setIsViewOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Open Delete Dialog
  const openDeletePrompt = (student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (base64Str) => {
    setFormData((prev) => ({ ...prev, photo: base64Str }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (selectedStudent) {
        // Edit Mode
        await studentAPI.updateStudent(selectedStudent._id, formData);
        showToast('Student information updated successfully!', 'success');
      } else {
        // Add Mode
        await studentAPI.createStudent(formData);
        showToast('New student created successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save student profile.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitLoading(true);
    try {
      await studentAPI.deleteStudent(selectedStudent._id);
      showToast('Student account deleted successfully.', 'success');
      setIsDeleteOpen(false);
      fetchStudents();
    } catch (err) {
      showToast('Failed to delete student.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Student Management Board</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search active registry accounts, review files, and manage enrollment parameters.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Student Record
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or Student ID..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-slate-200 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none"
          >
            <option value="">All Classes</option>
            {classesList.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border border-slate-200 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setClassFilter('');
              setSectionFilter('');
              setStatusFilter('');
              fetchStudents();
            }}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Photo</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Section</th>
                  <th className="px-6 py-3 text-center">Roll No</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {students.map((std) => (
                  <tr key={std._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold tracking-wider">{std.studentId}</td>
                    <td className="px-6 py-4">
                      {std.photo ? (
                        <img src={std.photo} alt={std.fullName} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px]">
                          {std.fullName.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-950 font-bold">{std.fullName}</td>
                    <td className="px-6 py-4">{std.class}</td>
                    <td className="px-6 py-4 text-center sm:text-left">{std.section}</td>
                    <td className="px-6 py-4 text-center font-mono">{std.rollNo}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{std.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        std.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {std.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openViewDetails(std)}
                        className="p-1 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded transition-colors"
                        title="View File"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditForm(std)}
                        className="p-1 text-slate-500 hover:text-amber-800 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeletePrompt(std)}
                        className="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs py-12">
            No students found matching your filters.
          </div>
        )}
      </div>

      {/* CRUD Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedStudent ? 'Modify Student Record' : 'Add New Student Record'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6 text-xs text-slate-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Column */}
            <div>
              <FileUpload
                value={formData.photo}
                onChange={handlePhotoChange}
                label="Student Photo"
                maxSizeKB={200}
              />
            </div>

            {/* Fields Column */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 focus:outline-none bg-white"
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Section *</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleFormChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Roll Number *</label>
                <input
                  type="number"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Will create User Account"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Father's Name *</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Mother's Name *</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Primary Guardian Name *</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Guardian Phone *</label>
              <input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Emergency Contact Number *</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Account Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Residential Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              required
              rows="2"
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-5 py-2 rounded-lg shadow disabled:opacity-50"
            >
              {submitLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Profile Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Student Permanent Record file"
        size="lg"
      >
        {detailsLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : studentDetails ? (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Header brief */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              {studentDetails.student.photo ? (
                <img src={studentDetails.student.photo} alt="" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xl">
                  {studentDetails.student.fullName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900">{studentDetails.student.fullName}</h3>
                <p className="text-slate-400 mt-0.5">Registration Reference ID: <span className="font-mono font-bold text-slate-700">{studentDetails.student.studentId}</span></p>
              </div>
            </div>

            {/* Details tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveDetailsTab('personal')}
                className={`flex-1 py-2 px-3 text-center font-bold border-b-2 ${activeDetailsTab === 'personal' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveDetailsTab('attendance')}
                className={`flex-1 py-2 px-3 text-center font-bold border-b-2 ${activeDetailsTab === 'attendance' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
              >
                Attendance Rate
              </button>
              <button
                onClick={() => setActiveDetailsTab('results')}
                className={`flex-1 py-2 px-3 text-center font-bold border-b-2 ${activeDetailsTab === 'results' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
              >
                Academic Grades
              </button>
            </div>

            {/* Tab content */}
            <div className="pt-2">
              {activeDetailsTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Class & Section</span>
                    <span className="font-bold">{studentDetails.student.class} - {studentDetails.student.section}</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Class Roll No</span>
                    <span className="font-bold">#{studentDetails.student.rollNo}</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">DOB</span>
                    <span className="font-bold">{new Date(studentDetails.student.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Gender</span>
                    <span className="font-bold capitalize">{studentDetails.student.gender}</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Father Name</span>
                    <span className="font-bold">{studentDetails.student.fatherName}</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Mother Name</span>
                    <span className="font-bold">{studentDetails.student.motherName}</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Primary Guardian</span>
                    <span className="font-bold">{studentDetails.student.guardianName} ({studentDetails.student.guardianPhone})</span>
                  </div>
                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-400">Emergency Phone</span>
                    <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded">{studentDetails.student.emergencyContact}</span>
                  </div>
                  <div className="sm:col-span-2 py-2 flex flex-col">
                    <span className="font-semibold text-slate-400">Residential Address</span>
                    <span className="font-bold mt-1 leading-relaxed">{studentDetails.student.address}</span>
                  </div>
                </div>
              )}

              {activeDetailsTab === 'attendance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-slate-50 border p-3 rounded-lg">
                      <p className="font-bold text-slate-400">Total Days</p>
                      <p className="text-lg font-extrabold mt-1">{studentDetails.attendanceSummary.totalDays}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-emerald-800">
                      <p className="font-bold">Present</p>
                      <p className="text-lg font-extrabold mt-1">{studentDetails.attendanceSummary.present}</p>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-rose-800">
                      <p className="font-bold">Absent</p>
                      <p className="text-lg font-extrabold mt-1">{studentDetails.attendanceSummary.absent}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-amber-800">
                      <p className="font-bold">Leaves</p>
                      <p className="text-lg font-extrabold mt-1">{studentDetails.attendanceSummary.leave}</p>
                    </div>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 flex items-center justify-between">
                    <span className="font-bold text-slate-700">Cumulative Attendance Percentage</span>
                    <span className="text-lg font-black text-emerald-600">{studentDetails.attendanceSummary.attendancePercentage}%</span>
                  </div>
                </div>
              )}

              {activeDetailsTab === 'results' && (
                <div>
                  {studentDetails.academicRecords.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase">
                          <tr>
                            <th className="px-4 py-2">Subject</th>
                            <th className="px-4 py-2 text-center">Exam Term</th>
                            <th className="px-4 py-2 text-center">Score</th>
                            <th className="px-4 py-2 text-center">Grade</th>
                            <th className="px-4 py-2">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y font-semibold">
                          {studentDetails.academicRecords.map((rec) => (
                            <tr key={rec._id}>
                              <td className="px-4 py-2.5 text-slate-900 font-extrabold">{rec.subject}</td>
                              <td className="px-4 py-2.5 text-center font-normal text-slate-400">{rec.examTerm}</td>
                              <td className="px-4 py-2.5 text-center font-mono">{rec.obtainedMarks} / {rec.totalMarks}</td>
                              <td className="px-4 py-2.5 text-center">
                                <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-black">{rec.grade}</span>
                              </td>
                              <td className="px-4 py-2.5 text-slate-500 font-normal leading-relaxed">{rec.remarks || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-6">No academic records logged.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Student Record?"
        message={`Are you sure you want to permanently delete the profile for ${selectedStudent?.fullName}? This will also delete their login account, academic records, and attendance histories.`}
        type="danger"
        onConfirm={handleDeleteConfirm}
        loading={submitLoading}
      />
    </div>
  );
};
export default StudentManagement;
