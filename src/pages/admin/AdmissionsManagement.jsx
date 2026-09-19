import React, { useState, useEffect } from 'react';
import { admissionAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Eye, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const AdmissionsManagement = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedApp, setSelectedApp] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await admissionAPI.getAdmissions({
        search,
        class: classFilter,
        status: statusFilter,
      });
      setApplications(res.data || []);
    } catch (err) {
      showToast('Failed to fetch admissions list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [classFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
      await admissionAPI.updateStatus(id, status);
      showToast(`Application successfully marked as ${status}!`, 'success');
      // If modal is open, refresh selected application status
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp((prev) => ({ ...prev, status }));
      }
      fetchApplications();
    } catch (err) {
      showToast('Failed to update application status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6 text-slate-700">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Admissions Intake Board</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted online admission registration forms, verify guardian contacts, and process approvals.
          </p>
        </div>
      </div>

      {/* Filters */}
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
            placeholder="Search by name or reference ID..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border border-slate-300 rounded-lg py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:outline-none"
            >
              <option value="">All Applying Classes</option>
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setClassFilter('');
              setStatusFilter('');
              fetchApplications();
            }}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Reference ID</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Applying Class</th>
                  <th className="px-6 py-3">Previous School</th>
                  <th className="px-6 py-3">Guardian Name</th>
                  <th className="px-6 py-3">Contact Phone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold tracking-wider">{app.applicationId}</td>
                    <td className="px-6 py-4 text-slate-950 font-bold">{app.studentName}</td>
                    <td className="px-6 py-4">{app.applyingClass}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{app.previousSchool}</td>
                    <td className="px-6 py-4">{app.guardianName}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{app.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-100'
                          : 'bg-amber-50 text-amber-800 border-amber-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-1.5">
                      <button
                        onClick={() => openDetails(app)}
                        className="p-1 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded transition-colors"
                        title="View Application Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleStatusUpdate(app._id, 'approved')}
                            className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-slate-100 rounded transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-slate-100 rounded transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs py-12">
            No admission registrations loaded.
          </div>
        )}
      </div>

      {/* Details Viewer Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Admission Application File"
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Status header banner */}
            <div className="flex justify-between items-center bg-slate-50 border p-4 rounded-xl">
              <div>
                <p className="font-extrabold text-slate-900">Reference ID: <span className="font-mono text-blue-900">{selectedApp.applicationId}</span></p>
                <p className="text-[10px] text-slate-500 mt-1">Submitted Date: {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded border uppercase font-extrabold text-[10px] ${
                selectedApp.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                  : selectedApp.status === 'rejected'
                  ? 'bg-rose-50 text-rose-800 border-rose-100'
                  : 'bg-amber-50 text-amber-800 border-amber-100'
              }`}>
                {selectedApp.status}
              </span>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <h3 className="sm:col-span-2 font-bold text-slate-900 border-b pb-1 text-xs uppercase tracking-wider">Student Profile Details</h3>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">FullName</span>
                <span className="font-bold">{selectedApp.studentName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">DOB</span>
                <span className="font-bold">{new Date(selectedApp.dob).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Gender</span>
                <span className="font-bold capitalize">{selectedApp.gender}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Applying Class</span>
                <span className="font-bold text-blue-900">{selectedApp.applyingClass}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Previous School</span>
                <span className="font-bold">{selectedApp.previousSchool}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Previous Grade</span>
                <span className="font-bold">{selectedApp.previousClass}</span>
              </div>

              <h3 className="sm:col-span-2 font-bold text-slate-900 border-b pb-1 mt-4 text-xs uppercase tracking-wider">Family Contacts</h3>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Father Name</span>
                <span className="font-bold">{selectedApp.fatherName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Mother Name</span>
                <span className="font-bold">{selectedApp.motherName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Guardian Name</span>
                <span className="font-bold">{selectedApp.guardianName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Guardian Contact</span>
                <span className="font-bold">{selectedApp.guardianPhone}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Email Address</span>
                <span className="font-bold">{selectedApp.email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-semibold text-slate-400">Primary Contact Phone</span>
                <span className="font-bold">{selectedApp.phone}</span>
              </div>

              <div className="sm:col-span-2 flex flex-col py-1 mt-2">
                <span className="font-semibold text-slate-400">Residential Address</span>
                <span className="font-bold leading-relaxed mt-1">{selectedApp.address}</span>
              </div>

              <div className="sm:col-span-2 flex flex-col py-1 mt-2">
                <span className="font-semibold text-slate-400">Additional Information</span>
                <span className="font-semibold leading-relaxed mt-1 text-slate-500 bg-slate-50 border p-3 rounded-lg whitespace-pre-wrap">
                  {selectedApp.additionalInfo || 'No additional specifications provided.'}
                </span>
              </div>
            </div>

            {/* Actions Panel */}
            {selectedApp.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate(selectedApp._id, 'rejected')}
                  className="px-4 py-2 border border-rose-200 text-rose-700 font-semibold rounded-lg hover:bg-rose-50/50"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate(selectedApp._id, 'approved')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg shadow"
                >
                  Approve Application
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AdmissionsManagement;
