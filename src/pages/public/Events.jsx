import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, ShieldAlert } from 'lucide-react';
import { eventAPI } from '../../services/api';
import Modal from '../../components/Modal';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventAPI.getEvents({ publicOnly: 'true' });
        setEvents(res.data || []);
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">School Life</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mt-1.5">
          Upcoming Events & Activities
        </h1>
        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
          Stay connected with our campus life. Mark your calendars and register for upcoming exhibitions, parent conferences, and tournaments.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedEvent(evt)}
            >
              {/* Event Image or placeholder */}
              <div className="h-44 bg-slate-900 relative">
                {evt.image ? (
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-950 to-slate-900 flex items-center justify-center text-white p-4">
                    <Calendar className="w-12 h-12 text-blue-500/80" />
                  </div>
                )}
                {evt.requiresRegistration && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow">
                    <Ticket className="w-3 h-3" /> RSVP Required
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-sm font-bold text-slate-950 mt-2 line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-400 font-bold uppercase">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {evt.startTime} - {evt.endTime}</span>
                  <span className="flex items-center gap-1.5 truncate"><MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold shadow-sm max-w-md mx-auto">
          No upcoming school events scheduled at this moment.
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-5 text-slate-700">
            {/* Ported image */}
            {selectedEvent.image && (
              <div className="h-48 rounded-lg overflow-hidden">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase border-y border-slate-100 py-3">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-600 shrink-0" /> {new Date(selectedEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-600 shrink-0" /> {selectedEvent.startTime} - {selectedEvent.endTime}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600 shrink-0" /> {selectedEvent.location}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
            </div>

            {selectedEvent.requiresRegistration && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-xs font-medium text-blue-900 mt-6">
                <Ticket className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-blue-950">RSVP Required</p>
                  <p className="text-blue-700 mt-1">
                    To register for this event, please log in to the Student Portal, navigate to the Events tab, and click Register.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
