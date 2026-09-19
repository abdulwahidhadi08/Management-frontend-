import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, User, Users, MapPin, ClipboardList } from 'lucide-react';
import { admissionAPI } from '../../services/api';

export const ApplyAdmission = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'male',
    previousSchool: '',
    previousClass: '',
    applyingClass: 'Grade 6',
    phone: '',
    email: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const classesList = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];
  const genders = ['male', 'female', 'other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (
      !formData.studentName ||
      !formData.fatherName ||
      !formData.motherName ||
      !formData.dob ||
      !formData.applyingClass ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.guardianName ||
      !formData.guardianPhone
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await admissionAPI.apply(formData);
      setSuccessData({
        applicationId: res.data.applicationId,
        studentName: formData.studentName,
        applyingClass: formData.applyingClass,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-700">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Submitted Successfully!</h1>
        <p className="mt-2 text-sm text-slate-500 font-medium max-w-md mx-auto">
          Thank you for applying. Your application has been received and logged in our system.
        </p>

        {/* Receipt Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md max-w-sm mx-auto my-8 text-left divide-y divide-slate-100">
          <div className="pb-3 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Application Status</span>
            <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">Pending</span>
          </div>
          <div className="py-3 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Student Name</span>
            <span className="font-bold text-slate-900">{successData.studentName}</span>
          </div>
          <div className="py-3 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Applying Class</span>
            <span className="font-bold text-slate-900">{successData.applyingClass}</span>
          </div>
          <div className="pt-3 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Application Reference ID</span>
            <span className="font-black text-slate-950 font-mono tracking-wider">{successData.applicationId}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 max-w-md mx-auto font-medium">
          Please note down the **Application Reference ID**. You will need this reference ID to track your admission details.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/admissions"
            className="px-5 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
          >
            Go Back
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition-all shadow-md"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700">
      {/* Back button */}
      <Link
        to="/admissions"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admissions
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden">
        {/* Header banner */}
        <div className="bg-slate-950 px-8 py-6 text-white border-b border-slate-800">
          <h1 className="text-xl font-extrabold tracking-tight">Horizon International Admission Application</h1>
          <p className="text-[11px] text-slate-400 mt-1 font-medium uppercase tracking-wide">
            Please fill in the form carefully. Required fields are marked with *
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-b border-rose-100 px-8 py-4 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section 1: Student Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  {genders.map((g) => (
                    <option key={g} value={g} className="capitalize">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Applying Class *</label>
                <select
                  name="applyingClass"
                  value={formData.applyingClass}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  {classesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Previous School Name</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  placeholder="e.g. Springdale Primary"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Previous Completed Class</label>
                <input
                  type="text"
                  name="previousClass"
                  value={formData.previousClass}
                  onChange={handleChange}
                  placeholder="e.g. Grade 5"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Family & Contact */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Family & Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe Sr."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mother's Name *</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Mary Doe"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="parent@example.com"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Residential Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                placeholder="Full mailing address..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Guardian Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Primary Guardian Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Guardian Full Name *</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe Sr."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Guardian Phone *</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Extra info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" /> Additional Details
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Additional Information (Interests, Special Needs, etc.)</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
                placeholder="Mention any sports accomplishments, hobbies, medical needs..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Link
              to="/admissions"
              className="px-6 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
