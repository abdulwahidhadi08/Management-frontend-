import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, MapPin, Ticket, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/Modal';

export const StudentEvents = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeringId, setRegisteringId] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.getEvents({ publicOnly: 'true' });
      setEvents(res.data || []);
    } catch (err) {
      console.error('Error fetching events list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId, e) => {
    e.stopPropagation(); // prevent modal trigger
    setRegisteringId(eventId);
    try {
      await eventAPI.registerStudent(eventId);
      showToast('Successfully registered for event!', 'success');
      // Refresh list to show registration status
      await fetchEvents();
      // If modal is open, refresh selected event
      if (selectedEvent && selectedEvent._id === eventId) {
        const res = await eventAPI.getEventById(eventId);
        setSelectedEvent(res.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register for event.', 'error');
    } finally {
      setRegisteringId('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-900" /> Upcoming Campus Events & Activities
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review upcoming school exhibitions, science fairs, and RSVP.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => {
            const isRegistered = evt.registrations?.includes(profile?._id);
            return (
              <div
                key={evt._id}
                onClick={() => setSelectedEvent(evt)}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer justify-between"
              >
                {/* Event Photo Placeholder */}
                <div className="h-32 bg-slate-950 relative flex items-center justify-center">
                  {evt.image ? (
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <Calendar className="w-10 h-10 text-blue-500" />
                  )}
                  {isRegistered && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow">
                      <CheckCircle2 className="w-3 h-3" /> Registered
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(evt.date).toLocaleDateString()}
                    </span>
                    <h3 className="text-xs font-bold text-slate-950 mt-1.5 line-clamp-1">{evt.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-[10px] text-slate-400 font-bold">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /> {evt.startTime}</span>
                      <span className="flex items-center gap-1 max-w-[120px] truncate"><MapPin className="w-3 h-3 text-blue-600" /> {evt.location}</span>
                    </div>

                    {evt.requiresRegistration && evt.status === 'upcoming' && !isRegistered && (
                      <button
                        type="button"
                        disabled={registeringId === evt._id}
                        onClick={(e) => handleRegister(evt._id, e)}
                        className="bg-blue-900 hover:bg-blue-950 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all shadow shrink-0 disabled:opacity-50"
                      >
                        {registeringId === evt._id ? 'Registering...' : 'Register RSVP'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold">
          No upcoming events scheduled.
        </div>
      )}

      {/* Events Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-4 text-slate-700">
            {selectedEvent.image && (
              <div className="h-44 rounded-lg overflow-hidden">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wide border-y border-slate-100 py-3">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-600" /> {new Date(selectedEvent.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-600" /> {selectedEvent.startTime} - {selectedEvent.endTime}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> {selectedEvent.location}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
            </div>

            {selectedEvent.requiresRegistration && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Registration Details</h4>
                  <p className="text-[10px] text-slate-500 mt-1">This event requires RSVP to reserve a slot.</p>
                </div>
                {selectedEvent.status === 'upcoming' && (
                  selectedEvent.registrations?.includes(profile?._id) ? (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registered
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={registeringId === selectedEvent._id}
                      onClick={(e) => handleRegister(selectedEvent._id, e)}
                      className="bg-blue-900 hover:bg-blue-950 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-all shadow disabled:opacity-50"
                    >
                      {registeringId === selectedEvent._id ? 'Registering...' : 'Register RSVP'}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
