import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, ShieldAlert, Megaphone } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AnnouncementsManagement = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    isPublished: true,
    isImportant: false,
    date: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const categories = ['academic', 'admission', 'sports', 'general'];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementAPI.getAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      showToast('Failed to load announcements list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAddForm = () => {
    setSelectedAnn(null);
    setFormData({
      title: '',
      description: '',
      category: 'academic',
      isPublished: true,
      isImportant: false,
      date: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  const openEditForm = (ann) => {
    setSelectedAnn(ann);
    setFormData({
      title: ann.title,
      description: ann.description,
      category: ann.category,
      isPublished: ann.isPublished,
      isImportant: ann.isImportant,
      date: ann.date ? ann.date.split('T')[0] : '',
    });
    setIsFormOpen(true);
  };

  const openDeletePrompt = (ann) => {
    setSelectedAnn(ann);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (selectedAnn) {
        await announcementAPI.updateAnnouncement(selectedAnn._id, formData);
        showToast('Announcement updated successfully!', 'success');
      } else {
        await announcementAPI.createAnnouncement(formData);
        showToast('New announcement published successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchAnnouncements();
    } catch (err) {
      showToast('Failed to save announcement details.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitLoading(true);
    try {
      await announcementAPI.deleteAnnouncement(selectedAnn._id);
      showToast('Announcement record deleted successfully.', 'success');
      setIsDeleteOpen(false);
      fetchAnnouncements();
    } catch (err) {
      showToast('Failed to delete announcement.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Announcements notice board</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish school alerts, schedule updates, or academic guidelines for students and parents.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Publish Announcement
        </button>
      </div>

      {/* Announcements table list */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : announcements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Publish Date</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-center">Important</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {announcements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      {new Date(ann.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-950 font-bold max-w-xs truncate">{ann.title}</td>
                    <td className="px-6 py-4">
                      <span className="text-blue-900 uppercase font-extrabold text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {ann.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ann.isImportant ? (
                        <span className="inline-flex items-center gap-0.5 text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[9px] font-extrabold">
                          <ShieldAlert className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        ann.isPublished ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {ann.isPublished ? 'published' : 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(ann)}
                        className="p-1 text-slate-500 hover:text-amber-800 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeletePrompt(ann)}
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
            No announcements notices logged in the database.
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedAnn ? 'Modify Announcement details' : 'Publish Announcement Notice'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Notice Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Publish Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                required
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Notice Description Details *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
              rows="5"
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
            />
          </div>

          <div className="flex gap-6 py-2 border-t border-slate-100 mt-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              Mark as High Priority (Important Alert)
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              Publish Notice Immediately
            </label>
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
              {submitLoading ? 'Saving...' : 'Save & Publish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Prompt */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Announcement?"
        message={`Are you sure you want to permanently delete the notice: "${selectedAnn?.title}"?`}
        type="danger"
        onConfirm={handleDeleteConfirm}
        loading={submitLoading}
      />
    </div>
  );
};
export default AnnouncementsManagement;
