import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { CourseService, type CreateCourseBody } from "../../../services/course";
import { ApiError } from "../../../lib/api";
import { ErrorBanner } from "./ErrorBanner";

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

export function CreateCourseForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<CreateCourseBody>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

function field(key: keyof CreateCourseBody) {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));
  };
}

  async function submit() {
    if (!form.CourseID || !form.title || !form.FacultyID || !form.DepartmentID) {
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
        {[
          { label: "Course ID *", key: "CourseID", placeholder: "e.g. CS401" },
          { label: "Course Title *", key: "title", placeholder: "e.g. Advanced Algorithms" },
          { label: "Faculty ID *", key: "FacultyID", placeholder: "e.g. FAC-ENG" },
          { label: "Department ID *", key: "DepartmentID", placeholder: "e.g. DEPT-CS" },
          { label: "Lecturer ID", key: "LecturerID", placeholder: "e.g. LEC-001 (optional)" },
          { label: "Room", key: "room", placeholder: "e.g. Lab A201" },
          { label: "Schedule Days", key: "scheduleDays", placeholder: "e.g. Mon, Wed" },
          { label: "Schedule Time", key: "scheduleTime", placeholder: "e.g. 09:00–11:00" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="text-sm text-foreground block mb-1.5">{label}</label>
            <input
              placeholder={placeholder}
              value={(form[key as keyof CreateCourseBody] as string) ?? ""}
              onChange={field(key as keyof CreateCourseBody)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
            />
          </div>
        ))}

        <div>
          <label className="text-sm text-foreground block mb-1.5">Credit Units</label>
          <input
            type="number"
            min={1}
            max={12}
            value={form.credits}
            onChange={field("credits")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
          />
        </div>

        <div>
          <label className="text-sm text-foreground block mb-1.5">Level</label>
          <select
            value={form.level}
            onChange={field("level")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
          >
            {[100, 200, 300, 400, 500, 600].map((l) => (
              <option key={l} value={l}>Level {l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-foreground block mb-1.5">Semester</label>
          <select
            value={form.semester}
            onChange={field("semester")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
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
            style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
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
            style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Description</label>
          <textarea
            rows={3}
            placeholder="Brief course description…"
            value={form.description}
            onChange={field("description")}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            style={{ background: "var(--input-background)", borderColor: "var(--border)" }}
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