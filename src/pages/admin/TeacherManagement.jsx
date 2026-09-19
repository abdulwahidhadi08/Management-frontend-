import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const TeacherManagement = () => {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    assignedClass: 'None',
    status: 'active',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getTeachers({
        search,
        status: statusFilter,
      });
      setTeachers(res.data || []);
    } catch (err) {
      showToast('Failed to load teachers list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTeachers();
  };

  const openAddForm = () => {
    setSelectedTeacher(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      qualification: '',
      assignedClass: 'None',
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      qualification: teacher.qualification,
      assignedClass: teacher.assignedClass || 'None',
      status: teacher.status,
    });
    setIsFormOpen(true);
  };

  const openDeletePrompt = (teacher) => {
    setSelectedTeacher(teacher);
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
      if (selectedTeacher) {
        await teacherAPI.updateTeacher(selectedTeacher._id, formData);
        showToast('Teacher profile updated successfully!', 'success');
      } else {
        await teacherAPI.createTeacher(formData);
        showToast('New teacher added successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchTeachers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save teacher profile.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitLoading(true);
    try {
      await teacherAPI.deleteTeacher(selectedTeacher._id);
      showToast('Teacher record deleted successfully.', 'success');
      setIsDeleteOpen(false);
      fetchTeachers();
    } catch (err) {
      showToast('Failed to delete teacher.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Teacher Management Board</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search instructor profiles, verify assigned subjects, and edit qualifications.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Teacher Record
        </button>
      </div>

      {/* Filter toolbar */}
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
            placeholder="Search by name or subject..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
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
              setStatusFilter('');
              fetchTeachers();
            }}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Teacher List Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Teacher ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Assigned Class</th>
                  <th className="px-6 py-3">Qualification</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {teachers.map((tch) => (
                  <tr key={tch._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold tracking-wider">{tch.teacherId}</td>
                    <td className="px-6 py-4 text-slate-950 font-bold">{tch.fullName}</td>
                    <td className="px-6 py-4">{tch.subject}</td>
                    <td className="px-6 py-4">{tch.assignedClass || 'None'}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{tch.qualification}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{tch.email} | {tch.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        tch.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {tch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(tch)}
                        className="p-1 text-slate-500 hover:text-amber-800 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeletePrompt(tch)}
                        className="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                        title="Delete Record"
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
            No teacher records found matching filters.
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedTeacher ? 'Modify Teacher Profile' : 'Add New Teacher Profile'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Teacher Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleFormChange}
              required
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Subject Specialization *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                required
                placeholder="e.g. Mathematics"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Assigned Class</label>
              <input
                type="text"
                name="assignedClass"
                value={formData.assignedClass}
                onChange={handleFormChange}
                placeholder="e.g. Grade 6 - A"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
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

          <div>
            <label className="block font-bold text-slate-600 mb-1">Qualification Description *</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleFormChange}
              required
              placeholder="e.g. M.Sc. in Applied Mathematics"
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Status *</label>
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

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Teacher Record?"
        message={`Are you sure you want to permanently delete the profile for ${selectedTeacher?.fullName}?`}
        type="danger"
        onConfirm={handleDeleteConfirm}
        loading={submitLoading}
      />
    </div>
  );
};
export default TeacherManagement;
