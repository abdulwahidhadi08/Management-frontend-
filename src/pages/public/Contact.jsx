import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { contentAPI } from '../../services/api';

export const Contact = () => {
  const [schoolInfo, setSchoolInfo] = useState({
    address: '102 Academic Boulevard, Education District, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@horizonschool.com',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await contentAPI.getSchoolContent();
        if (res.data) {
          setSchoolInfo({
            address: res.data.address,
            phone: res.data.phone,
            email: res.data.email,
          });
        }
      } catch (err) {
        console.warn('Could not load school contact from API');
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock submit delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Contact Us</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mt-1.5">
          Connect With Our Campus
        </h1>
        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
          Have questions about registrations, classes, or fee structures? Drop us a line and our support desk will respond shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Contact info */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Contact Channels</h2>
          <div className="space-y-6 text-sm">
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Mailing Address</h3>
                <p className="text-slate-500 mt-1 leading-relaxed">{schoolInfo.address}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Phone Desk</h3>
                <p className="text-slate-500 mt-1 leading-relaxed">{schoolInfo.phone}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Support Email</h3>
                <p className="text-slate-500 mt-1 leading-relaxed">{schoolInfo.email}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right 2 Cols: Form */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Send Feedback or Query</h2>
          
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                Thank you. We have received your query. A school administrator will get in touch with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Inquiry about syllabus"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Message Description</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Explain your query in detail here..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-md transition-all disabled:opacity-55"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
