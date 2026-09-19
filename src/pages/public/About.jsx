import React from 'react';
import { ShieldCheck, Target, Heart, Eye } from 'lucide-react';

export const About = () => {
  const values = [
    { title: 'Academic Rigor', desc: 'Cultivating critical thinking, research skills, and lifelong learning behaviors.', icon: Target, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { title: 'Character & Integrity', desc: 'Guiding students to be honest, respectful, empathetic, and morally responsible.', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Community & Diversity', desc: 'Fostering an inclusive environment where unique stories and backgrounds enrich school life.', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { title: 'Global Vision', desc: 'Preparing students to be aware, proactive, and compassionate world citizens.', icon: Eye, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-700">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Who We Are</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mt-1.5">
          About Vanguard Academy
        </h1>
        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
          For over 25 years, we have provided premium primary and secondary education that empowers children to succeed in a complex world.
        </p>
      </div>

      {/* Intro & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Our Mission & Philosophy</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            At Horizon International School, we believe that education is more than academic transcripts. It is a holistic journey of discovering passions, building physical resilience, developing critical reasoning, and learning moral integrity.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our campus brings together state-of-the-art sciences facilities, coding suites, sports courts, and a library containing over 15,000 resources. Backed by an expert faculty, we nurture future leaders ready to make an active, positive difference.
          </p>
        </div>
        <div className="bg-slate-200 aspect-video rounded-xl overflow-hidden shadow-md flex items-center justify-center font-bold text-slate-400 text-sm">
          [Image: Modern School Campus]
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-10 tracking-tight">Our Core Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center mb-4 ${v.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
