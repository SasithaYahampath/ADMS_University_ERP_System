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
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>{mode}</span>;
}

export  default function UniCourses() {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Course Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{COURSES.length} courses · {COURSES.reduce((a, c) => a + c.credits, 0)} total credit units</p>
        </div>
        <button onClick={() => setTab('create')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={15} /> Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Courses', value: COURSES.filter(c => c.status === 'Active').length, color: '#3b5bdb', bg: '#eef2ff', icon: <BookOpen size={18} /> },
          { label: 'Total Students', value: COURSES.reduce((a, c) => a + c.students, 0).toLocaleString(), color: '#10b981', bg: '#ecfdf5', icon: <Users size={18} /> },
          { label: 'Credit Units', value: COURSES.reduce((a, c) => a + c.credits, 0), color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={18} /> },
          { label: 'Departments', value: new Set(COURSES.map(c => c.department)).size, color: '#8b5cf6', bg: '#f5f3ff', icon: <Filter size={18} /> },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-2.5 rounded-xl" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5" style={{ fontSize: 20 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[{ id: 'catalog', label: 'Course Catalog' }, { id: 'curriculum', label: 'Curriculum' }, { id: 'create', label: 'Create Course' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id )}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color: tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'catalog' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground" />
              <input placeholder="Search courses by title, code, or lecturer…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)}>
              <option value="">All Faculties</option>
              {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(course => (
              <div key={course.id}
                className="bg-card rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
                style={{ borderColor: 'var(--border)' }}
                onClick={() => setSelected(course)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
                    style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
                    {course.id}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {course.status === 'Active'
                      ? <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      : <span className="w-2 h-2 rounded-full bg-gray-400" />}
                    {modeBadge(course.mode)}
                  </div>
                </div>
                <h3 className="text-foreground text-sm font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-3 line-clamp-2" style={{ fontSize: 12 }}>{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Users size={11} />{course.students}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{course.credits} credits</span>
                  <span>L{course.level}</span>
                </div>
                <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-xs text-muted-foreground truncate">{course.lecturer}</div>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'curriculum' && (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">BSc Computer Science — Curriculum Plan</h3>
            <p className="text-muted-foreground text-xs mt-0.5">4 years · 120 credit units</p>
          </div>
          {[1, 2, 3, 4].map(year => (
            <div key={year}>
              <div className="px-5 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider"
                style={{ background: 'var(--muted)' }}>
                Year {year}
              </div>
              {CURRICULUM.filter(c => c.year === year).map(c => (
                <div key={c.code} className="flex items-center gap-4 px-5 py-3.5 border-t hover:bg-muted/30 transition-colors"
                  style={{ borderColor: 'var(--border)' }}>
                  <div className="w-20 font-mono text-xs text-muted-foreground">{c.code}</div>
                  <div className="flex-1 text-sm text-foreground">{c.title}</div>
                  <div className="text-xs text-muted-foreground">Sem {c.sem}</div>
                  <div className="text-xs font-medium text-foreground">{c.credits} CU</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.required ? 'text-blue-700 bg-blue-50' : 'text-purple-700 bg-purple-50'}`}>
                    {c.required ? 'Required' : 'Elective'}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'create' && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground text-base">Create New Course</h3>
            <p className="text-muted-foreground text-sm mt-0.5">Add a new course to the university catalog.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Course Title', placeholder: 'e.g. Advanced Algorithms', col: 2 },
              { label: 'Course Code', placeholder: 'e.g. CS401', col: 1 },
              { label: 'Credit Units', placeholder: '3', col: 1 },
            ].map(f => (
              <div key={f.label} className={f.col === 2 ? 'md:col-span-2' : ''}>
                <label className="text-sm text-foreground block mb-1.5">{f.label}</label>
                <input placeholder={f.placeholder}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
              </div>
            ))}
            {[
              { label: 'Faculty', options: ['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'] },
              { label: 'Level', options: ['100', '200', '300', '400', '500', '600'] },
              { label: 'Semester', options: ['1', '2'] },
              { label: 'Mode', options: ['In-person', 'Online', 'Hybrid'] },
            ].map(f => (
              <div key={f.label}>
                <label className="text-sm text-foreground block mb-1.5">{f.label}</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                  <option value="">Select {f.label.toLowerCase()}</option>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Course Description</label>
              <textarea rows={3} placeholder="Provide a brief description of this course…"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              Cancel
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--primary)' }}>
              Create Course
            </button>
          </div>
        </div>
      )}

      {/* Course detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground">Course Details</h3>
              <button onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="px-2.5 py-1 w-fit rounded-lg text-xs font-mono font-semibold mb-2"
                  style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
                  {selected.id}
                </div>
                <h2 className="text-foreground font-semibold" style={{ fontSize: 18 }}>{selected.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">{selected.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Students', value: selected.students },
                  { label: 'Credits', value: `${selected.credits} CU` },
                  { label: 'Level', value: `Level ${selected.level}` },
                  { label: 'Semester', value: `Sem ${selected.semester}` },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--muted)' }}>
                    <div className="text-foreground font-bold" style={{ fontSize: 20 }}>{s.value}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              {[
                { label: 'Faculty', value: selected.faculty },
                { label: 'Department', value: selected.department },
                { label: 'Lecturer', value: selected.lecturer },
                { label: 'Schedule', value: selected.schedule },
                { label: 'Room', value: selected.room },
                { label: 'Mode', value: selected.mode },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-muted-foreground text-sm">{item.label}</span>
                  <span className="text-foreground text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

