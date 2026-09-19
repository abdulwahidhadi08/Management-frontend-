import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../../services/api';
import { Bell, ShieldAlert } from 'lucide-react';
import Modal from '../../components/Modal';

export const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnn, setSelectedAnn] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementAPI.getAnnouncements({ publicOnly: 'true' });
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error('Error loading notices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

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
          <Bell className="w-5 h-5 text-blue-900" /> Published Announcements Notices
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review warnings, event news, and schedule updates from school administration.
        </p>
      </div>

      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              onClick={() => setSelectedAnn(ann)}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              {ann.isImportant && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-bl-md uppercase">
                  Important
                </span>
              )}
              <span className="text-[9px] text-slate-400 font-bold uppercase">
                {new Date(ann.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                <span className="mx-2">•</span>
                <span className="text-blue-600 font-extrabold">{ann.category}</span>
              </span>
              <h3 className="text-xs font-bold text-slate-950 mt-2 line-clamp-1">{ann.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{ann.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold">
          No notices have been published.
        </div>
      )}

      {/* Announcement Modal */}
      <Modal
        isOpen={!!selectedAnn}
        onClose={() => setSelectedAnn(null)}
        title={selectedAnn?.title || 'Notice Board Details'}
        size="md"
      >
        {selectedAnn && (
          <div className="space-y-4">
            <div className="flex gap-2 items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
              <span>Date: {new Date(selectedAnn.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-blue-600 font-extrabold">Category: {selectedAnn.category}</span>
              {selectedAnn.isImportant && (
                <>
                  <span>•</span>
                  <span className="text-red-600 font-extrabold flex items-center gap-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> High Priority Notice
                  </span>
                </>
              )}
            </div>

            <div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedAnn.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
