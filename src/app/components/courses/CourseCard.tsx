import { Clock, ChevronRight } from "lucide-react";
import { type Course } from "../../../services/course";
import { modeBadge } from "./modeBadge";

export function CourseCard({
  course,
  onClick,
}: {
  course: Course;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-card rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
      style={{ borderColor: "var(--border)" }}
      onClick={onClick}
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
            className={`w-2 h-2 rounded-full ${
              course.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
            }`}
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
        <ChevronRight size={14} className="text-muted-foreground shrink-0" />
      </div>
    </div>
  );
}