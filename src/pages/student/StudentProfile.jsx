import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, PhoneCall, Calendar } from 'lucide-react';

export const StudentProfile = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (!profile) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs font-semibold max-w-sm mx-auto">
        Unable to load student profile. Please contact the administrator.
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'family', label: 'Family & Guardians', icon: PhoneCall },
    { id: 'academic', label: 'Academic & Enrollment', icon: Calendar },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-700">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-900/30 shadow-sm"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#044e36] text-amber-400 border-2 border-amber-500/40 flex items-center justify-center font-bold text-3xl shadow">
            {profile.fullName.charAt(0)}
          </div>
        )}

        <div className="text-center sm:text-left flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-slate-950 truncate font-serif">{profile.fullName}</h1>
          <p className="text-xs text-amber-700 font-extrabold uppercase tracking-wider mt-1">
            Student Profile Registry
          </p>
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-[10px] font-extrabold uppercase">
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
              Class: {profile.class} - {profile.section}
            </span>
            <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-lg">
              Roll No: {profile.rollNo}
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
              {profile.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-xs font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#044e36] text-[#044e36] bg-white font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div className="p-6">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Full Name</span>
                <span className="font-extrabold text-slate-950">{profile.fullName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Registration ID</span>
                <span className="font-extrabold text-slate-950 font-mono tracking-wider">{profile.studentId}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Date of Birth</span>
                <span className="font-extrabold text-slate-950">
                  {new Date(profile.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Gender</span>
                <span className="font-extrabold text-slate-950 capitalize">{profile.gender}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Email Address</span>
                <span className="font-extrabold text-slate-950">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Phone Number</span>
                <span className="font-extrabold text-slate-950">{profile.phone}</span>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1 py-2.5">
                <span className="font-bold text-slate-600">Residential Address</span>
                <span className="font-bold text-slate-950 leading-relaxed mt-1">{profile.address}</span>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Father's Name</span>
                <span className="font-extrabold text-slate-950">{profile.fatherName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Mother's Name</span>
                <span className="font-extrabold text-slate-950">{profile.motherName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Primary Guardian</span>
                <span className="font-extrabold text-slate-950">{profile.guardianName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Guardian Contact</span>
                <span className="font-extrabold text-slate-950">{profile.guardianPhone}</span>
              </div>
              <div className="sm:col-span-2 flex justify-between items-center py-2.5">
                <span className="font-bold text-slate-600">Emergency Phone</span>
                <span className="font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg">
                  {profile.emergencyContact}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Current Class</span>
                <span className="font-extrabold text-slate-950">{profile.class}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Current Section</span>
                <span className="font-extrabold text-slate-950">{profile.section}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Class Roll Number</span>
                <span className="font-extrabold text-slate-950">#{profile.rollNo}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="font-bold text-slate-600">Enrollment Date</span>
                <span className="font-extrabold text-slate-950">
                  {new Date(profile.admissionDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
