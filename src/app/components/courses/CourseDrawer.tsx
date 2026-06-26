import { useState, useEffect } from "react";
import { X, Plus, Loader2, Trash2 } from "lucide-react";
import {
  CourseService,
  type Course,
  type CourseEnrollment,
  type CourseExam,
  type CourseStats,
} from "../../../services/course";
import { ApiError } from "../../../lib/api";
import { ErrorBanner } from "./ErrorBanner";
import { EnrollStudentModal } from "./EnrollStudentModal";

export function CourseDrawer({
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

          {/* Enrollments */}
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