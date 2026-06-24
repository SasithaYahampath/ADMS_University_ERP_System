import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Clock,
  Filter,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import {
  CourseService,
  type Course,
  type EnrolledCourse,
  type CourseEnrollment,
  type CourseExam,
  type CourseStats,
  type CreateCourseBody,
} from "../../services/course";
import { ApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function modeBadge(mode: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "In-person": { bg: "#dcfce7", text: "#15803d" },
    Online: { bg: "#dbeafe", text: "#1d4ed8" },
    Hybrid: { bg: "#fef9c3", text: "#a16207" },
  };
  const c = map[mode] ?? { bg: "#f1f5f9", text: "#64748b" };
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      {mode}
    </span>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl border"
      style={{ background: "#fef2f2", borderColor: "#fca5a5" }}
    >
      <AlertTriangle size={15} className="text-red-500 shrink-0" />
      <p className="text-red-700 text-sm flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
        >
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
}

// ─── Enroll Student Modal ─────────────────────────────────────────────────────

function EnrollStudentModal({
  course,
  onClose,
  onEnrolled,
}: {
  course: Course;
  onClose: () => void;
  onEnrolled: () => void;
}) {
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!studentId.trim()) {
      setError("Student ID is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await CourseService.enrollStudent(
        studentId.trim(),
        course.CourseID,
        semester,
      );
      onEnrolled();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to enroll student.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border shadow-xl w-full max-w-md mx-4"
        style={{ borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="text-xs text-muted-foreground font-mono">
              {course.CourseID}
            </p>
            <h3 className="text-foreground text-sm font-semibold">
              Enroll a student
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && <ErrorBanner message={error} />}

          {/* Student ID */}
          <div>
            <label className="text-sm text-foreground block mb-1.5">
              Student ID
            </label>
            <input
              placeholder="e.g. STU-2023-001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                background: "var(--input-background)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          {/* Semester */}
          <div>
            <label className="text-sm text-foreground block mb-1.5">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                background: "var(--input-background)",
                borderColor: "var(--border)",
              }}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
              style={{
                background: "var(--primary)",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              {saving ? "Enrolling…" : "Enroll student"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Course Detail Drawer ─────────────────────────────────────────────────────

function CourseDrawer({
  course,
  onClose,
  onDeleted,
  isAdmin,
}: {
  course: Course;
  onClose: () => void;
  onDeleted: () => void;
  isAdmin: boolean;
}) {
  const [tab, setTab] = useState<"details" | "enrollments" | "exams" | "stats">(
    "details",
  );
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [exams, setExams] = useState<CourseExam[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  // "Students" tab is only ever offered to admins (see drawerTabs below),
  // so this effect never runs the enrollments branch for non-admin viewers.
  useEffect(() => {
    if (tab === "details") return;
    setLoading(true);
    setError("");
    const fetch =
      tab === "enrollments"
        ? CourseService.getEnrollments(course.CourseID)
        : tab === "exams"
          ? CourseService.getExams(course.CourseID)
          : CourseService.getStats(course.CourseID);
    fetch
      .then((res) => {
        if (tab === "enrollments") setEnrollments((res as any).data);
        if (tab === "exams") setExams((res as any).data);
        if (tab === "stats") setStats((res as any).data);
      })
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Failed to load data."),
      )
      .finally(() => setLoading(false));
  }, [tab, course.CourseID]);

  async function handleDelete() {
    if (!confirm(`Delete course ${course.CourseID}?`)) return;
    setDeleting(true);
    try {
      await CourseService.deleteCourse(course.CourseID);
      onDeleted();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete course.");
      setDeleting(false);
    }
  }

  const drawerTabs = [
    { id: "details", label: "Details" },
    // Roster is admin/staff territory — the underlying endpoint isn't
    // meant for students, so the tab itself is hidden rather than shown
    // and then erroring when clicked.
    ...(isAdmin ? [{ id: "enrollments", label: "Students" }] : []),
    { id: "exams", label: "Exams" },
    { id: "stats", label: "Stats" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      {enrollModalOpen && (
        <EnrollStudentModal
          course={course}
          onClose={() => setEnrollModalOpen(false)}
          onEnrolled={() => {
            setEnrollModalOpen(false);
            setTab("details");
            setTimeout(() => setTab("enrollments"), 0);
          }}
        />
      )}

      <div
        className="w-full max-w-lg bg-card h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div
              className="px-2 py-0.5 w-fit rounded-lg text-xs font-mono font-semibold mb-1"
              style={{
                background: "var(--secondary)",
                color: "var(--primary)",
              }}
            >
              {course.CourseID}
            </div>
            <h3 className="text-foreground">{course.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub-tabs */}
        <div
          className="flex gap-1 p-2 border-b shrink-0"
          style={{ borderColor: "var(--border)", background: "var(--muted)" }}
        >
          {drawerTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.id ? "var(--card)" : "transparent",
                color:
                  tab === t.id
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && <ErrorBanner message={error} />}

          {/* Details */}
          {tab === "details" && (
            <>
              <p className="text-muted-foreground text-sm">
                {course.description}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Credits", value: `${course.credits} CU` },
                  { label: "Level", value: `Level ${course.level}` },
                  { label: "Semester", value: `Sem ${course.semester}` },
                  { label: "Mode", value: course.mode },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "var(--muted)" }}
                  >
                    <div
                      className="text-foreground font-bold"
                      style={{ fontSize: 18 }}
                    >
                      {s.value}
                    </div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              {[
                { label: "Faculty", value: course.FacultyName },
                { label: "Department", value: course.DepartmentName },
                { label: "Lecturer", value: course.LecturerName ?? "—" },
                { label: "Rank", value: course.rank ?? "—" },
                {
                  label: "Schedule",
                  value: `${course.ScheduleDays} · ${course.ScheduleTime}`,
                },
                { label: "Room", value: course.room },
                { label: "Status", value: course.status },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between py-2.5 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-muted-foreground text-sm">
                    {item.label}
                  </span>
                  <span className="text-foreground text-sm font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors mt-4"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  {deleting ? "Deleting…" : "Delete Course"}
                </button>
              )}
            </>
          )}

          {/* Enrollments (admin-only tab) */}
          {tab === "enrollments" &&
            (loading ? (
              <div className="flex justify-center py-12">
                <Loader2
                  size={20}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            ) : (
              <>
                {isAdmin && (
                  <button
                    onClick={() => setEnrollModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white w-full justify-center"
                    style={{ background: "var(--primary)" }}
                  >
                    <Plus size={14} /> Enroll student
                  </button>
                )}
                {enrollments.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-12">
                    No enrolled students.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {enrollments.map((e) => (
                      <div
                        key={e.EnrollmentID}
                        className="flex items-center gap-3 p-3 rounded-xl border"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "var(--primary)" }}
                        >
                          {e.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground text-sm font-medium truncate">
                            {e.name}
                          </div>
                          <div
                            className="text-muted-foreground font-mono"
                            style={{ fontSize: 11 }}
                          >
                            {e.StudentID} · {e.program}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-muted-foreground text-xs">
                            Level {e.level}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {e.EnrolledDate?.slice(0, 10)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ))}

          {/* Exams */}
          {tab === "exams" &&
            (loading ? (
              <div className="flex justify-center py-12">
                <Loader2
                  size={20}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            ) : exams.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">
                No exams scheduled.
              </p>
            ) : (
              <div className="space-y-3">
                {exams.map((ex) => (
                  <div
                    key={ex.ExamID}
                    className="p-4 rounded-xl border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-mono text-xs text-muted-foreground">
                        {ex.ExamID}
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background:
                            ex.status === "Completed" ? "#dcfce7" : "#fef9c3",
                          color:
                            ex.status === "Completed" ? "#15803d" : "#a16207",
                        }}
                      >
                        {ex.status}
                      </span>
                    </div>
                    <div className="text-foreground text-sm font-medium">
                      {ex.ExamDate?.slice(0, 10)} · {ex.ExamTime}
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {ex.hall} · {ex.duration} min · Cap: {ex.capacity}
                    </div>
                    {ex.name && (
                      <div className="text-muted-foreground text-xs mt-0.5">
                        Invigilator: {ex.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

          {/* Stats */}
          {tab === "stats" &&
            (loading ? (
              <div className="flex justify-center py-12">
                <Loader2
                  size={20}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            ) : (
              stats && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Enrolled Students",
                      value: stats.enrollmentCount,
                      color: "#3b5bdb",
                      bg: "#eef2ff",
                    },
                    {
                      label: "Scheduled Exams",
                      value: stats.scheduledExams,
                      color: "#f59e0b",
                      bg: "#fffbeb",
                    },
                    {
                      label: "Completed Exams",
                      value: stats.completedExams,
                      color: "#10b981",
                      bg: "#ecfdf5",
                    },
                    {
                      label: "Average Score",
                      value:
                        stats.averageScore != null
                          ? `${Number(stats.averageScore).toFixed(1)}%`
                          : "—",
                      color: "#8b5cf6",
                      bg: "#f5f3ff",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-5 text-center"
                      style={{ background: s.bg }}
                    >
                      <div
                        className="font-bold"
                        style={{ fontSize: 28, color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs mt-1" style={{ color: s.color }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Create Course Form ───────────────────────────────────────────────────────

const EMPTY_FORM: CreateCourseBody = {
  CourseID: "",
  title: "",
  FacultyID: "",
  DepartmentID: "",
  credits: 3,
  level: 100,
  semester: 1,
  LecturerID: "",
  room: "",
  scheduleDays: "",
  scheduleTime: "",
  description: "",
  status: "Active",
  mode: "In-person",
};

function CreateCourseForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<CreateCourseBody>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function field(key: keyof CreateCourseBody) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit() {
    if (
      !form.CourseID ||
      !form.title ||
      !form.FacultyID ||
      !form.DepartmentID
    ) {
      setError("Course ID, title, faculty and department are required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await CourseService.createCourse({
        ...form,
        credits: Number(form.credits),
        level: Number(form.level),
        semester: Number(form.semester),
        LecturerID: form.LecturerID || undefined,
      });
      setSuccess(`Course "${form.title}" created successfully.`);
      setForm(EMPTY_FORM);
      onCreated();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to create course.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="bg-card rounded-2xl border p-6 shadow-sm space-y-6"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <h3 className="text-foreground text-base">Create New Course</h3>
        <p className="text-muted-foreground text-sm mt-0.5">
          Submits to{" "}
          <code className="text-xs bg-muted px-1 rounded">
            POST /api/courses
          </code>
        </p>
      </div>
      {error && <ErrorBanner message={error} />}
      {success && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700"
          style={{ background: "#f0fdf4" }}
        >
          <CheckCircle2 size={14} className="shrink-0" />
          {success}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Course ID *
          </label>
          <input
            placeholder="e.g. CS401"
            value={form.CourseID}
            onChange={field("CourseID")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Course Title *
          </label>
          <input
            placeholder="e.g. Advanced Algorithms"
            value={form.title}
            onChange={field("title")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Faculty ID *
          </label>
          <input
            placeholder="e.g. FAC-ENG"
            value={form.FacultyID}
            onChange={field("FacultyID")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Department ID *
          </label>
          <input
            placeholder="e.g. DEPT-CS"
            value={form.DepartmentID}
            onChange={field("DepartmentID")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Credit Units
          </label>
          <input
            type="number"
            min={1}
            max={12}
            value={form.credits}
            onChange={field("credits")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Level</label>
          <select
            value={form.level}
            onChange={field("level")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          >
            {[100, 200, 300, 400, 500, 600].map((l) => (
              <option key={l} value={l}>
                Level {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Semester
          </label>
          <select
            value={form.semester}
            onChange={field("semester")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Mode</label>
          <select
            value={form.mode}
            onChange={field("mode")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          >
            {["In-person", "Online", "Hybrid"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={field("status")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Lecturer ID
          </label>
          <input
            placeholder="e.g. LEC-001 (optional)"
            value={form.LecturerID ?? ""}
            onChange={field("LecturerID")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Room</label>
          <input
            placeholder="e.g. Lab A201"
            value={form.room}
            onChange={field("room")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Schedule Days
          </label>
          <input
            placeholder="e.g. Mon, Wed"
            value={form.scheduleDays}
            onChange={field("scheduleDays")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">
            Schedule Time
          </label>
          <input
            placeholder="e.g. 09:00–11:00"
            value={form.scheduleTime}
            onChange={field("scheduleTime")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief course description…"
            value={form.description}
            onChange={field("description")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            style={{
              background: "var(--input-background)",
              borderColor: "var(--border)",
            }}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setForm(EMPTY_FORM)}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: "var(--border)" }}
        >
          Reset
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          style={{ background: "var(--primary)", opacity: saving ? 0.7 : 1 }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Creating…" : "Create Course"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UniCourses() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  // NOTE: confirm this string matches the role your AuthContext actually sets
  // for student accounts (e.g. it might be "student" lowercase elsewhere).
  const isStudent = user?.role === "Student";

  const [tab, setTab] = useState<"catalog" | "create">("catalog");
  const [courses, setCourses] = useState<Course[] | EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);

  // Admin/staff: full catalog, filtered server-side via query params.
  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await CourseService.listCourses({
        search: search || undefined,
        status: filterStatus || undefined,
        mode: filterMode || undefined,
      });
      setCourses(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterMode]);

  // Student: only the courses they're enrolled in. The backend SP doesn't
  // take search/status/mode, so those filters are applied client-side
  // below (see visibleCourses) instead of being passed to the request.
  const loadMyEnrollments = useCallback(async () => {
    // The field on AuthUser is `UserID` (capital), not `userId` —
    // confirmed via the console log in UniCourses below.
    if (!user?.UserID) {
      // Surface this instead of failing silently — if you're seeing this
      // error, `user.UserID` is missing/undefined and the API call never fires.
      // Check the real field name on your AuthContext's user object
      // (e.g. StudentID, UserID, _id) and use that instead.
      console.warn("[UniCourses] No user.UserID available — current user object:", user);
      setError(
        "Couldn't determine your student ID from your account. Check console for details.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await CourseService.getMyEnrollments(user.UserID);
      setCourses(res.data);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Failed to load your enrolled courses.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.UserID]);

  const load = isStudent ? loadMyEnrollments : loadCatalog;

  // Diagnostic: confirms what role/branch this render actually took.
  // Remove once the student flow is confirmed working.
  useEffect(() => {
    console.log("[UniCourses] user:", user, "| isAdmin:", isAdmin, "| isStudent:", isStudent);
  }, [user, isAdmin, isStudent]);

  useEffect(() => {
    if (tab !== "catalog" || isStudent) return;
    loadCatalog();
  }, [tab, isStudent, search, filterStatus, filterMode]);

  useEffect(() => {
    if (tab !== "catalog" || !isStudent) return;
    loadMyEnrollments();
  }, [tab, isStudent, user?.UserID]);

  // For students, filters narrow the already-fetched enrollment list
  // instead of triggering a refetch.
  const visibleCourses = isStudent
    ? courses.filter((c) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.CourseID.toLowerCase().includes(q);
        const matchesStatus = !filterStatus || c.status === filterStatus;
        const matchesMode = !filterMode || c.mode === filterMode;
        return matchesSearch && matchesStatus && matchesMode;
      })
    : courses;

  const activeCourses = courses.filter((c) => c.status === "Active").length;
  const departments = new Set(courses.map((c) => c.DepartmentName)).size;
  const totalCredits = courses.reduce((a, c) => a + Number(c.credits), 0);

  return (
    <div className="space-y-6">
      {selected && (
        <CourseDrawer
          course={selected}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onDeleted={load}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">
            {isStudent ? "My Courses" : "Course Management"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading
              ? "Loading…"
              : isStudent
                ? `Enrolled in ${courses.length} course${courses.length === 1 ? "" : "s"} · ${totalCredits} total credit units`
                : `${courses.length} courses · ${totalCredits} total credit units`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setTab("create")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={15} /> Add Course
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isStudent ? "Enrolled Courses" : "Total Courses",
            value: courses.length,
            color: "#3b5bdb",
            bg: "#eef2ff",
            icon: <BookOpen size={18} />,
          },
          {
            label: "Active Courses",
            value: activeCourses,
            color: "#10b981",
            bg: "#ecfdf5",
            icon: <Users size={18} />,
          },
          {
            label: "Credit Units",
            value: totalCredits,
            color: "#f59e0b",
            bg: "#fffbeb",
            icon: <Clock size={18} />,
          },
          {
            label: "Departments",
            value: departments,
            color: "#8b5cf6",
            bg: "#f5f3ff",
            icon: <Filter size={18} />,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="p-2.5 rounded-xl" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div
                className="text-foreground font-semibold mt-0.5"
                style={{ fontSize: 20 }}
              >
                {loading ? "—" : m.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs (students never see "Create Course") */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "var(--muted)" }}
      >
        {[
          { id: "catalog", label: isStudent ? "My Courses" : "Course Catalog" },
          ...(isAdmin ? [{ id: "create", label: "Create Course" }] : []),
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "var(--card)" : "transparent",
              color:
                tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Catalog / My Courses */}
      {tab === "catalog" && (
        <>
          {error && <ErrorBanner message={error} onRetry={load} />}

          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card"
              style={{ borderColor: "var(--border)" }}
            >
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                placeholder="Search by title or course code…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <select
              className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: "var(--border)" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: "var(--border)" }}
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
            >
              <option value="">All Modes</option>
              {["In-person", "Online", "Hybrid"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border p-5 h-48 animate-pulse"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--muted)",
                  }}
                />
              ))}
            </div>
          ) : visibleCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <BookOpen size={32} className="text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                {isStudent
                  ? "You're not enrolled in any matching courses."
                  : "No courses found."}
              </p>
              <button
                onClick={load}
                className="text-xs text-primary hover:underline"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleCourses.map((course) => (
                <div
                  key={course.CourseID}
                  className="bg-card rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => setSelected(course)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
                      style={{
                        background: "var(--secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {course.CourseID}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${course.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`}
                      />
                      {modeBadge(course.mode)}
                    </div>
                  </div>
                  <h3 className="text-foreground text-sm font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p
                    className="text-muted-foreground mb-3 line-clamp-2"
                    style={{ fontSize: 12 }}
                  >
                    {course.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {course.credits} credits
                    </span>
                    <span>L{course.level}</span>
                    <span>Sem {course.semester}</span>
                  </div>
                  <div
                    className="pt-3 border-t flex items-center justify-between"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="text-xs text-muted-foreground truncate">
                      {course.LecturerName ?? "No lecturer assigned"}
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create (admin only) */}
      {tab === "create" && isAdmin && (
        <CreateCourseForm
          onCreated={() => {
            setTab("catalog");
            load();
          }}
        />
      )}
    </div>
  );
}