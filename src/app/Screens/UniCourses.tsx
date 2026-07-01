import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Clock,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import {
  CourseService,
  type Course,
  type EnrolledCourse,
} from "../../services/course";
import { ApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { ErrorBanner } from "../components/courses/ErrorBanner";
import { CourseCard } from "../components/courses/CourseCard";
import { CourseDrawer } from "../components/courses/CourseDrawer";
import { CreateCourseForm } from "../components/courses/CreateCourseForm";

export function UniCourses() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isStudent = user?.role === "Student";

  const [tab, setTab] = useState<"catalog" | "create">("catalog");
  const [courses, setCourses] = useState<Course[] | EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);

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

  const loadMyEnrollments = useCallback(async () => {
    if (!user?.UserID) {
      console.warn("[UniCourses] No user.UserID available — current user object:", user);
      setError("Couldn't determine your student ID from your account. Check console for details.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await CourseService.getMyEnrollments(user.UserID);
      setCourses(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load your enrolled courses.");
    } finally {
      setLoading(false);
    }
  }, [user?.UserID]);

  const load = isStudent ? loadMyEnrollments : loadCatalog;

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

      {/* Tabs */}
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
              color: tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Catalog */}
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
                  style={{ borderColor: "var(--border)", background: "var(--muted)" }}
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
              <button onClick={load} className="text-xs text-primary hover:underline">
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleCourses.map((course) => (
                <CourseCard
                  key={course.CourseID}
                  course={course}
                  onClick={() => setSelected(course)}
                />
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