import { useState } from 'react';
import {
  Search, Plus, BookOpen, Users, Clock,
  ChevronRight, X, Filter
} from 'lucide-react';

const COURSES = [
  { id: 'CS401', title: 'Advanced Algorithms', faculty: 'Engineering', department: 'Computer Science', credits: 4, level: 400, semester: 2, lecturer: 'Prof. Margaret Thompson', students: 145, schedule: 'Mon, Wed 09:00–11:00', room: 'Lab A201', description: 'Analysis and design of advanced algorithms including dynamic programming, graph algorithms, and complexity theory.', status: 'Active', mode: 'In-person' },
  { id: 'CS510', title: 'Deep Learning & Neural Networks', faculty: 'Engineering', department: 'Computer Science', credits: 3, level: 500, semester: 2, lecturer: 'Prof. Margaret Thompson', students: 62, schedule: 'Tue, Thu 02:00–04:00', room: 'Lab A203', description: 'Foundational and advanced topics in deep learning, convolutional networks, transformers, and reinforcement learning.', status: 'Active', mode: 'Hybrid' },
  { id: 'FIN401', title: 'Corporate Finance', faculty: 'Business', department: 'Finance', credits: 3, level: 400, semester: 2, lecturer: 'Dr. Elena Novak', students: 212, schedule: 'Mon, Wed, Fri 10:00–11:00', room: 'Hall C', description: 'Capital structure, dividend policy, M&A, and financial derivatives with real-world case studies.', status: 'Active', mode: 'In-person' },
  { id: 'BCH302', title: 'Molecular Biology', faculty: 'Medicine', department: 'Biochemistry', credits: 4, level: 300, semester: 2, lecturer: 'Dr. Kwame Asante', students: 88, schedule: 'Tue, Thu 08:00–10:00', room: 'Lab M102', description: 'DNA replication, transcription, translation, gene regulation, and recombinant DNA technology.', status: 'Active', mode: 'In-person' },
  { id: 'CEE301', title: 'Structural Analysis', faculty: 'Engineering', department: 'Civil Engineering', credits: 4, level: 300, semester: 2, lecturer: 'Dr. Sarah Chen', students: 140, schedule: 'Wed, Fri 01:00–03:00', room: 'Hall E', description: 'Matrix methods, indeterminate structures, influence lines, and plastic analysis of civil structures.', status: 'Active', mode: 'In-person' },
  { id: 'PHY201', title: 'Classical Mechanics', faculty: 'Sciences', department: 'Physics', credits: 3, level: 200, semester: 2, lecturer: 'Prof. Ibrahim Hassan', students: 110, schedule: 'Mon, Wed 11:00–12:30', room: 'Hall B', description: 'Lagrangian and Hamiltonian mechanics, rigid body dynamics, oscillations, and special relativity.', status: 'Inactive', mode: 'Online' },
  { id: 'ART301', title: 'Modern Art Theory', faculty: 'Arts', department: 'Fine Arts', credits: 2, level: 300, semester: 2, lecturer: 'Prof. Antonio Rossi', students: 55, schedule: 'Fri 10:00–01:00', room: 'Studio R', description: 'Critical analysis of modernist and postmodernist art movements from 1850 to the present.', status: 'Active', mode: 'In-person' },
  { id: 'LAW402', title: 'International Law', faculty: 'Law', department: 'Public Law', credits: 3, level: 400, semester: 2, lecturer: 'Prof. Diana Osei', students: 78, schedule: 'Mon, Thu 03:00–04:30', room: 'Moot Court', description: 'Public international law, treaty interpretation, international organizations, and dispute resolution.', status: 'Active', mode: 'In-person' },
];

const CURRICULUM = [
  { code: 'CS101', title: 'Intro to Programming', year: 1, sem: 1, credits: 3, required: true },
  { code: 'CS102', title: 'Data Structures', year: 1, sem: 2, credits: 3, required: true },
  { code: 'MATH101', title: 'Calculus I', year: 1, sem: 1, credits: 3, required: true },
  { code: 'CS201', title: 'Algorithms', year: 2, sem: 1, credits: 4, required: true },
  { code: 'CS202', title: 'Database Systems', year: 2, sem: 2, credits: 3, required: true },
  { code: 'CS301', title: 'Operating Systems', year: 3, sem: 1, credits: 3, required: true },
  { code: 'CS302', title: 'Software Engineering', year: 3, sem: 2, credits: 3, required: false },
  { code: 'CS401', title: 'Advanced Algorithms', year: 4, sem: 1, credits: 4, required: true },
  { code: 'CS410', title: 'Capstone Project', year: 4, sem: 2, credits: 6, required: true },
];

function modeBadge(mode) {
  const map = {
    'In-person': { bg: '#dcfce7', text: '#15803d' },
    'Online': { bg: '#dbeafe', text: '#1d4ed8' },
    'Hybrid': { bg: '#fef9c3', text: '#a16207' },
  };
  const c = map[mode] ?? { bg: '#f1f5f9', text: '#64748b' };
  return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase" style={{ background: c.bg, color: c.text }}>{mode}</span>;
}

export default function UniCourses() {
  const [search, setSearch] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [tab, setTab] = useState('catalog');
  const [selected, setSelected] = useState(null);

  const filtered = COURSES.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.lecturer.toLowerCase().includes(q);
    const matchF = !filterFaculty || c.faculty === filterFaculty;
    return matchQ && matchF;
  });

  return (
    <div className="space-y-6 font-sans text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Course Management</h1>
          <p className="text-gray-500 text-sm mt-1">{COURSES.length} courses · {COURSES.reduce((a, c) => a + c.credits, 0)} total credit units</p>
        </div>
        <button onClick={() => setTab('create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-sm transition-colors bg-[#4361ee] hover:bg-[#3651cc]">
          <Plus size={16} strokeWidth={2.5} /> Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Active Courses', value: COURSES.filter(c => c.status === 'Active').length, color: '#4361ee', bg: '#eef2ff', icon: <BookOpen size={20} /> },
          { label: 'Total Students', value: COURSES.reduce((a, c) => a + c.students, 0).toLocaleString(), color: '#10b981', bg: '#ecfdf5', icon: <Users size={20} /> },
          { label: 'Credit Units', value: COURSES.reduce((a, c) => a + c.credits, 0), color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={20} /> },
          { label: 'Departments', value: new Set(COURSES.map(c => c.department)).size, color: '#8b5cf6', bg: '#f5f3ff', icon: <Filter size={20} /> },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] font-medium mb-0.5">{m.label}</div>
              <div className="text-gray-900 font-bold" style={{ fontSize: 24, lineHeight: 1 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 rounded-2xl w-fit bg-gray-50/80 border border-gray-100">
        {[{ id: 'catalog', label: 'Course Catalog' }, { id: 'curriculum', label: 'Curriculum' }, { id: 'create', label: 'Create Course' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-5 py-2 rounded-xl text-[14px] font-medium transition-all"
            style={{
              background: tab === t.id ? '#ffffff' : 'transparent',
              color: tab === t.id ? '#111827' : '#64748b',
              boxShadow: tab === t.id ? '0 2px 5px rgba(0,0,0,0.04)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'catalog' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee]/50 transition-all">
              <Search size={18} className="text-gray-400" />
              <input placeholder="Search courses by title, code, or lecturer…"
                className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-4 py-3 text-[14px] font-medium border border-gray-200 bg-white text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50"
              value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)}>
              <option value="">All Faculties</option>
              {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(course => (
              <div key={course.id}
                className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                onClick={() => setSelected(course)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold text-[#4361ee] bg-blue-50">
                    {course.id}
                  </div>
                  <div className="flex items-center gap-2">
                    {course.status === 'Active'
                      ? <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.2)]" />
                      : <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />}
                    {modeBadge(course.mode)}
                  </div>
                </div>
                
                <h3 className="text-gray-900 text-[16px] font-bold leading-snug mb-1.5 group-hover:text-[#4361ee] transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 mb-5 line-clamp-2 flex-1 text-[13px] leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-5 font-medium">
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-gray-400" />{course.students}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" />{course.credits} credits</span>
                  <span className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-600">L{course.level}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-[13px] font-medium text-gray-500 truncate">{course.lecturer}</div>
                  <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#4361ee] transition-colors">
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'curriculum' && (
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-gray-900 text-[16px] font-semibold">BSc Computer Science — Curriculum Plan</h3>
            <p className="text-gray-500 text-[13px] mt-1 font-medium">4 years · 120 credit units</p>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map(year => (
              <div key={year}>
                <div className="px-6 py-3 font-bold text-[12px] text-gray-500 uppercase tracking-wider bg-gray-50">
                  Year {year}
                </div>
                <div className="divide-y divide-gray-100">
                  {CURRICULUM.filter(c => c.year === year).map(c => (
                    <div key={c.code} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="w-20 font-mono text-[13px] font-semibold text-gray-500">{c.code}</div>
                      <div className="flex-1 text-[14px] font-medium text-gray-900">{c.title}</div>
                      <div className="text-[13px] text-gray-500">Sem {c.sem}</div>
                      <div className="text-[13px] font-bold text-gray-900 w-16 text-right">{c.credits} CU</div>
                      <div className="w-24 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${c.required ? 'text-[#4361ee] bg-blue-50' : 'text-[#8b5cf6] bg-purple-50'}`}>
                          {c.required ? 'Required' : 'Elective'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'create' && (
        <div className="bg-white rounded-[20px] border border-gray-100 p-8 shadow-sm max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="text-gray-900 text-lg font-semibold">Create New Course</h3>
            <p className="text-gray-500 text-[14px] mt-1">Add a new course to the university catalog.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Course Title', placeholder: 'e.g. Advanced Algorithms', col: 2 },
              { label: 'Course Code', placeholder: 'e.g. CS401', col: 1 },
              { label: 'Credit Units', placeholder: '3', col: 1 },
            ].map(f => (
              <div key={f.label} className={f.col === 2 ? 'md:col-span-2' : ''}>
                <label className="text-[13px] font-semibold text-gray-700 block mb-2">{f.label}</label>
                <input placeholder={f.placeholder}
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
              </div>
            ))}
            
            {[
              { label: 'Faculty', options: ['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'] },
              { label: 'Level', options: ['100', '200', '300', '400', '500', '600'] },
              { label: 'Semester', options: ['1', '2'] },
              { label: 'Mode', options: ['In-person', 'Online', 'Hybrid'] },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[13px] font-semibold text-gray-700 block mb-2">{f.label}</label>
                <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                  <option value="">Select {f.label.toLowerCase()}</option>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            
            <div className="md:col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Course Description</label>
              <textarea rows={4} placeholder="Provide a brief description of this course…"
                className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm resize-none" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white transition-colors shadow-sm bg-[#4361ee] hover:bg-[#3651cc]">
              Create Course
            </button>
          </div>
        </div>
      )}

      {/* Course detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h3 className="text-gray-900 font-semibold text-[16px]">Course Details</h3>
              <button onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div>
                <div className="px-3 py-1.5 w-fit rounded-lg text-[13px] font-mono font-bold mb-3 bg-blue-50 text-[#4361ee]">
                  {selected.id}
                </div>
                <h2 className="text-gray-900 font-bold text-2xl leading-tight">{selected.title}</h2>
                <p className="text-gray-600 text-[14px] mt-3 leading-relaxed">{selected.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Students', value: selected.students },
                  { label: 'Credits', value: `${selected.credits} CU` },
                  { label: 'Level', value: `Level ${selected.level}` },
                  { label: 'Semester', value: `Sem ${selected.semester}` },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl p-5 text-center bg-gray-50 border border-gray-100">
                    <div className="text-gray-900 font-bold text-2xl">{s.value}</div>
                    <div className="text-gray-500 text-[13px] font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-1">
                {[
                  { label: 'Faculty', value: selected.faculty },
                  { label: 'Department', value: selected.department },
                  { label: 'Lecturer', value: selected.lecturer },
                  { label: 'Schedule', value: selected.schedule },
                  { label: 'Room', value: selected.room },
                  { label: 'Mode', value: selected.mode },
                ].map((item, i) => (
                  <div key={item.label} className={`flex items-center justify-between py-3.5 ${i !== 0 ? 'border-t border-gray-100' : ''}`}>
                    <span className="text-gray-500 text-[14px] font-medium">{item.label}</span>
                    <span className="text-gray-900 text-[14px] font-semibold text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}