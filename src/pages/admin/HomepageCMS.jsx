import React, { useState, useEffect } from 'react';
import { contentAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FileUpload } from '../../components/FileUpload';
import { Save, RefreshCw, LayoutGrid, Globe, Phone, FileText, UserCheck } from 'lucide-react';

export const HomepageCMS = () => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: '',
    tagline: '',
    logo: '',
    heroHeading: '',
    heroDescription: '',
    heroImage: '',
    aboutHeading: '',
    aboutDescription: '',
    yearsOfExcellence: 25,
    principalName: '',
    principalDesignation: '',
    principalMessage: '',
    principalPhoto: '',
    headmasterName: '',
    headmasterMessage: '',
    headmasterPhoto: '',
    address: '',
    phone: '',
    email: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await contentAPI.getSchoolContent();
      if (res.data) {
        setFormData({
          schoolName: res.data.schoolName || '',
          tagline: res.data.tagline || '',
          logo: res.data.logo || '',
          heroHeading: res.data.heroHeading || '',
          heroDescription: res.data.heroDescription || '',
          heroImage: res.data.heroImage || '',
          aboutHeading: res.data.aboutHeading || '',
          aboutDescription: res.data.aboutDescription || '',
          yearsOfExcellence: res.data.yearsOfExcellence || 25,
          principalName: res.data.principalName || '',
          principalDesignation: res.data.principalDesignation || '',
          principalMessage: res.data.principalMessage || '',
          principalPhoto: res.data.principalPhoto || '',
          headmasterName: res.data.headmasterName || '',
          headmasterMessage: res.data.headmasterMessage || '',
          headmasterPhoto: res.data.headmasterPhoto || '',
          address: res.data.address || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
          facebookUrl: res.data.facebookUrl || '',
          twitterUrl: res.data.twitterUrl || '',
          instagramUrl: res.data.instagramUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
        });
      }
    } catch (err) {
      showToast('Failed to load CMS content configuration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (fieldName, base64Str) => {
    setFormData((prev) => ({ ...prev, [fieldName]: base64Str }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await contentAPI.updateSchoolContent(formData);
      showToast('Homepage and school details updated successfully!', 'success');
      fetchContent();
    } catch (err) {
      showToast('Failed to save CMS details.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sections = [
    { id: 'general', label: 'School Details', icon: Globe },
    { id: 'hero', label: 'Hero Banner', icon: LayoutGrid },
    { id: 'leadership', label: 'Leadership message', icon: UserCheck },
    { id: 'contact', label: 'Contacts Desk', icon: Phone },
  ];

  return (
    <div className="space-y-6 text-slate-700 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">Homepage Content Management (CMS)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Update descriptions, logos, principal letters, and banners visible to guests.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Navigation tabs */}
        <div className="md:w-56 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 pb-4 md:pb-0 overflow-x-auto">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeSection === sec.id
                    ? 'bg-blue-900 text-white shadow'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Inputs form */}
        <form onSubmit={handleSubmit} className="flex-grow bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          
          {activeSection === 'general' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 border-b pb-2 uppercase tracking-wide">General Identity</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">School Name *</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tagline Slogan *</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <FileUpload
                  value={formData.logo}
                  onChange={(base64) => handleFileUpload('logo', base64)}
                  label="School Logo"
                  maxSizeKB={100}
                />
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Years of Excellence *</label>
                  <input
                    type="number"
                    name="yearsOfExcellence"
                    value={formData.yearsOfExcellence}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'hero' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 border-b pb-2 uppercase tracking-wide">Hero Banner Configuration</h3>
              
              <div>
                <label className="block font-bold text-slate-600 mb-1">Main Heading Banner Title *</label>
                <input
                  type="text"
                  name="heroHeading"
                  value={formData.heroHeading}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Hero Description Banner Subtitle *</label>
                <textarea
                  name="heroDescription"
                  value={formData.heroDescription}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <FileUpload
                value={formData.heroImage}
                onChange={(base64) => handleFileUpload('heroImage', base64)}
                label="Hero Background portrait image (16:9 recommended)"
                maxSizeKB={400}
              />
            </div>
          )}

          {activeSection === 'leadership' && (
            <div className="space-y-6 text-xs text-slate-700">
              {/* Principal details */}
              <div className="space-y-4 border-b border-slate-100 pb-6">
                <h3 className="font-bold text-slate-900 border-b pb-2 uppercase tracking-wide">Principal message Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Principal Full Name *</label>
                    <input
                      type="text"
                      name="principalName"
                      value={formData.principalName}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Principal Designation Designation *</label>
                    <input
                      type="text"
                      name="principalDesignation"
                      value={formData.principalDesignation}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-600 mb-1">Letter of Message *</label>
                    <textarea
                      name="principalMessage"
                      value={formData.principalMessage}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <FileUpload
                    value={formData.principalPhoto}
                    onChange={(base64) => handleFileUpload('principalPhoto', base64)}
                    label="Principal Portrait"
                    maxSizeKB={150}
                  />
                </div>
              </div>

              {/* Headmaster details */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2 uppercase tracking-wide">Headmaster message Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Headmaster Full Name *</label>
                    <input
                      type="text"
                      name="headmasterName"
                      value={formData.headmasterName}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-600 mb-1">Letter of Message *</label>
                    <textarea
                      name="headmasterMessage"
                      value={formData.headmasterMessage}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <FileUpload
                    value={formData.headmasterPhoto}
                    onChange={(base64) => handleFileUpload('headmasterPhoto', base64)}
                    label="Headmaster Portrait"
                    maxSizeKB={150}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 border-b pb-2 uppercase tracking-wide">Contact Desk Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Contact Phone Desk *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Mailing Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Physical Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <h3 className="font-bold text-slate-900 border-b pb-1 mt-6 uppercase tracking-wide">Social Networks</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    placeholder="https://facebook.com/school"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Twitter URL</label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={fetchContent}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
            >
              Reset Details
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-5 py-2 rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              {saveLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save CMS Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
export default HomepageCMS;
