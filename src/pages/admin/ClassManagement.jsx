import React, { useState, useEffect } from 'react';
import { classAPI, teacherAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const ClassManagement = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: 'Grade 6',
    section: 'A',
    classTeacher: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await classAPI.getClasses();
      setClasses(res.data || []);
    } catch (err) {
      showToast('Failed to load classes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch teachers for selection dropdown
  useEffect(() => {
    const fetchTeachersList = async () => {
      try {
        const res = await teacherAPI.getTeachers();
        setTeachers(res.data || []);
      } catch (err) {
        console.warn('Failed to load teachers for selection');
      }
    };
    fetchTeachersList();
  }, []);

  const openAddForm = () => {
    setSelectedClass(null);
    setFormData({
      name: 'Grade 6',
      section: 'A',
      classTeacher: teachers[0]?._id || '',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      section: cls.section,
      classTeacher: cls.classTeacher?._id || cls.classTeacher || '',
    });
    setIsFormOpen(true);
  };

  const openDeletePrompt = (cls) => {
    setSelectedClass(cls);
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
      if (selectedClass) {
        await classAPI.updateClass(selectedClass._id, formData);
        showToast('Class configurations updated successfully!', 'success');
      } else {
        await classAPI.createClass(formData);
        showToast('New class successfully created!', 'success');
      }
      setIsFormOpen(false);
      fetchClasses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save class profile.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitLoading(true);
    try {
      await classAPI.deleteClass(selectedClass._id);
      showToast('Class deleted successfully.', 'success');
      setIsDeleteOpen(false);
      fetchClasses();
    } catch (err) {
      showToast('Failed to delete class.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Classes & Sections Panel</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure grades, assign class teachers, and verify section mappings.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Class Section
        </button>
      </div>

      {/* Class List Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Class Grade</th>
                  <th className="px-6 py-3">Section</th>
                  <th className="px-6 py-3">Class Teacher</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {classes.map((cls) => (
                  <tr key={cls._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-950 font-bold">{cls.name}</td>
                    <td className="px-6 py-4">{cls.section}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">
                      {cls.classTeacher?.fullName || (teachers.find((t) => t._id === cls.classTeacher)?.fullName) || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(cls)}
                        className="p-1 text-slate-500 hover:text-amber-800 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeletePrompt(cls)}
                        className="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                        title="Delete Class"
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
            No classes defined in the system.
          </div>
        )}
      </div>

      {/* Class Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedClass ? 'Modify Class configurations' : 'Create Class Section'}
        size="sm"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Class Grade *</label>
            <select
              name="name"
              value={formData.name}
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
            <label className="block font-bold text-slate-600 mb-1">Section Name *</label>
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
            <label className="block font-bold text-slate-600 mb-1">Class Teacher Assignment *</label>
            <select
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleFormChange}
              required
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white"
            >
              <option value="">Select Teacher...</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.fullName} ({t.subject})
                </option>
              ))}
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
              {submitLoading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Class Section?"
        message={`Are you sure you want to delete ${selectedClass?.name} - Section ${selectedClass?.section}? This cannot be undone.`}
        type="danger"
        onConfirm={handleDeleteConfirm}
        loading={submitLoading}
      />
    </div>
  );
};
export default ClassManagement;
