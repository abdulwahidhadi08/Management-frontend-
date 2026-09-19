import React, { useState, useEffect } from 'react';
import { eventAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, Ticket, Users, RefreshCw } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FileUpload } from '../../components/FileUpload';

export const EventsManagement = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [rosterLoading, setRosterLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    image: '',
    requiresRegistration: false,
    status: 'upcoming',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventAPI.getEvents();
      setEvents(res.data || []);
    } catch (err) {
      showToast('Failed to load events list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddForm = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '15:00',
      location: '',
      image: '',
      requiresRegistration: false,
      status: 'upcoming',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (evt) => {
    setSelectedEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      date: evt.date ? evt.date.split('T')[0] : '',
      startTime: evt.startTime,
      endTime: evt.endTime,
      location: evt.location,
      image: evt.image || '',
      requiresRegistration: evt.requiresRegistration,
      status: evt.status,
    });
    setIsFormOpen(true);
  };

  const openRoster = async (evt) => {
    setSelectedEvent(evt);
    setIsRosterOpen(true);
    setRosterLoading(true);
    try {
      const res = await eventAPI.getEventById(evt._id);
      setEventDetails(res.data);
    } catch (err) {
      showToast('Failed to load event rosters.', 'error');
      setIsRosterOpen(false);
    } finally {
      setRosterLoading(false);
    }
  };

  const openDeletePrompt = (evt) => {
    setSelectedEvent(evt);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBannerChange = (base64Str) => {
    setFormData((prev) => ({ ...prev, image: base64Str }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (selectedEvent) {
        await eventAPI.updateEvent(selectedEvent._id, formData);
        showToast('Event details updated successfully!', 'success');
      } else {
        await eventAPI.createEvent(formData);
        showToast('New event scheduled successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchEvents();
    } catch (err) {
      showToast('Failed to save event information.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitLoading(true);
    try {
      await eventAPI.deleteEvent(selectedEvent._id);
      showToast('Event record removed successfully.', 'success');
      setIsDeleteOpen(false);
      fetchEvents();
    } catch (err) {
      showToast('Failed to delete event.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-700 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Events & Activities Console</h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule science fairs, sports championships, parent meetings, and track student RSVPs.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule Event
        </button>
      </div>

      {/* Events table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Event Date</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Timing</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">RSVP</th>
                  <th className="px-6 py-3 text-center">Roster</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      {new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-950 font-bold max-w-xs truncate">{evt.title}</td>
                    <td className="px-6 py-4">{evt.startTime} - {evt.endTime}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal truncate max-w-[120px]">{evt.location}</td>
                    <td className="px-6 py-4 text-center">
                      {evt.requiresRegistration ? (
                        <span className="text-blue-900 text-[10px] font-extrabold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {evt.requiresRegistration ? (
                        <button
                          onClick={() => openRoster(evt)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1 mx-auto font-bold"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {evt.registrations?.length || 0} RSVPs
                        </button>
                      ) : (
                        <span className="text-slate-300 font-normal">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        evt.status === 'upcoming'
                          ? 'bg-blue-50 text-blue-800 border-blue-100'
                          : evt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(evt)}
                        className="p-1 text-slate-500 hover:text-amber-800 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeletePrompt(evt)}
                        className="p-1 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                        title="Delete Event"
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
            No events scheduled.
          </div>
        )}
      </div>

      {/* Roster Modal */}
      <Modal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        title="Event Registration RSVP Roster"
        size="lg"
      >
        {rosterLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : eventDetails ? (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 border p-3 rounded-lg flex justify-between items-center">
              <span className="font-bold text-slate-700">Event: {eventDetails.title}</span>
              <span className="font-mono text-slate-500 font-semibold">{eventDetails.registrations?.length || 0} Enrolled</span>
            </div>

            {eventDetails.registrations?.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">FullName</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2 text-center">Roll No</th>
                      <th className="px-4 py-2">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-semibold">
                    {eventDetails.registrations.map((std) => (
                      <tr key={std._id}>
                        <td className="px-4 py-2.5 font-mono text-slate-500">{std.studentId}</td>
                        <td className="px-4 py-2.5 text-slate-900 font-bold">{std.fullName}</td>
                        <td className="px-4 py-2.5">{std.class} - {std.section}</td>
                        <td className="px-4 py-2.5 text-center font-mono">#{std.rollNo}</td>
                        <td className="px-4 py-2.5 text-slate-400 font-normal">{std.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-6">No students have RSVP'd yet.</div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* CRUD Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedEvent ? 'Modify Event Details' : 'Schedule New Event'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6 text-xs text-slate-700">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Banner Column */}
            <div>
              <FileUpload
                value={formData.image}
                onChange={handleBannerChange}
                label="Event Banner Photo"
                maxSizeKB={300}
              />
            </div>

            {/* Input Columns */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Location Venue *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. School Auditorium"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Event Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none bg-white font-bold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Event Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
              rows="4"
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
            />
          </div>

          <div className="py-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                name="requiresRegistration"
                checked={formData.requiresRegistration}
                onChange={handleFormChange}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              Require RSVP Registration for Students (Yes)
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
              {submitLoading ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Event Schedule?"
        message={`Are you sure you want to permanently delete the event record for "${selectedEvent?.title}"?`}
        type="danger"
        onConfirm={handleDeleteConfirm}
        loading={submitLoading}
      />
    </div>
  );
};
export default EventsManagement;
