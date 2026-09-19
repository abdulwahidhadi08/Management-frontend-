import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

export const Admissions = () => {
  const steps = [
    { title: 'Online Application', desc: 'Submit the application form with personal, academic, and guardian details.' },
    { title: 'Documents Review', desc: 'Admissions team reviews the submitted transcripts and birth documents.' },
    { title: 'Interactive Interview', desc: 'A short interaction session with the student and parents on campus.' },
    { title: 'Final Admission', desc: 'If approved, pay the admission fee and complete class enrollment.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Enrollment Board</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mt-1.5">
          Admission Guidelines & Registration
        </h1>
        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
          Follow our clear, step-by-step procedure to enroll your child for the upcoming academic session.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Left 2 Cols: Details */}
        <div className="col-span-1 lg:col-span-2 space-y-10">
          {/* Eligibility & Info */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Eligibility Criteria</h2>
            <div className="space-y-3.5 text-sm text-slate-600">
              <p className="leading-relaxed">
                Admissions are open for Grade 1 through Grade 12, subject to vacancy availability and academic evaluation performance.
              </p>
              <div className="flex gap-2.5 items-start bg-slate-50 p-4 border border-slate-200/50 rounded-lg text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-[#044e36] shrink-0" />
                <div>
                  <p className="text-slate-800 font-bold">Age & Academic Progression Requirements:</p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 font-medium text-slate-600">
                    <li>Primary Division (Grades 1 – 5): 5 to 10 years of age</li>
                    <li>Middle School Division (Grades 6 – 8): 11 to 13 years of age</li>
                    <li>High School Division (Grades 9 – 10): 14 to 15 years of age</li>
                    <li>Collegiate Division (Grades 11 – 12): 16 to 18 years of age</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-900" />
              Required Documentation Checklist
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <li className="flex items-center gap-2.5 bg-white border border-slate-100 p-3.5 rounded-lg shadow-sm">
                <BookOpen className="w-4 h-4 text-blue-600" /> State Birth Certificate (Copy)
              </li>
              <li className="flex items-center gap-2.5 bg-white border border-slate-100 p-3.5 rounded-lg shadow-sm">
                <BookOpen className="w-4 h-4 text-blue-600" /> Previous Year School Transcripts
              </li>
              <li className="flex items-center gap-2.5 bg-white border border-slate-100 p-3.5 rounded-lg shadow-sm">
                <BookOpen className="w-4 h-4 text-blue-600" /> Passport Size Photos (x4)
              </li>
              <li className="flex items-center gap-2.5 bg-white border border-slate-100 p-3.5 rounded-lg shadow-sm">
                <BookOpen className="w-4 h-4 text-blue-600" /> Guardian Identity Card Copy
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Process Timeline */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Admissions Procedure</h3>
          <div className="relative pl-6 border-l border-slate-100 space-y-8">
            {steps.map((s, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className="absolute right-full mr-2.5 w-6 h-6 rounded-full bg-blue-900 border-4 border-white flex items-center justify-center text-[10px] font-bold text-white -translate-y-1">
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply CTA Section */}
      <div className="bg-slate-950 rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Ready to start the application?</h2>
          <p className="text-xs text-slate-400 leading-relaxed mt-2.5 max-w-md mx-auto">
            Our online portal allows you to easily submit student records and track approval status in real-time.
          </p>
          <div className="mt-8">
            <Link
              to="/admissions/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-8 py-3 rounded-lg shadow transition-all"
            >
              Start Online Application Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
