import { useState } from "react";
import { useAnnouncements } from "../api/announcements";
import type { TargetRole } from "../types";

// TODO(candidate): implement this component.
//
// Requirements:
//   - A text input bound to `search`, debounced or not (your choice), that
//     filters announcements by title (case-insensitive substring match — the
//     backend already does the matching, you just need to send the param).
//   - A <select> bound to `targetRole` with options: "" (all), "student",
//     "lecturer", "all".
//   - Call useAnnouncements({ search, targetRole }) and render:
//       - a loading state while the query is pending
//       - an error state if the query failed
//       - the list of announcements (title, content, target_role) once loaded
//       - an empty state ("No announcements found") when the list is empty
//   - Show the total count from the response's `meta.total` somewhere in the UI.
export function AnnouncementList() {
  const [search, setSearch] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole | "">("");

  const { data, isLoading, isError } = useAnnouncements({ search, targetRole });
  
  return (
    <div>
      <div>
        <input
          id="announcement-search"
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="announcement-target-role">Target Role</label>
        <select
          id="announcement-target-role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value as TargetRole | "")}
        >
          <option value="">All</option>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>
      </div>
      {isLoading && <p>Loading announcements...</p>}
      {isError && <p>Error loading announcements.</p>}
      {data && (
        <>
          <p>Total announcements: {data.meta?.total ?? 0}</p>
          {(data.data ?? []).length === 0 ? (
            <p>No announcements found.</p>
          ) : (
            <ul>
              {(data.data ?? []).map((announcement) => (
                <li key={announcement.id}>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                  <p>Target Role: {announcement.target_role}</p>
                </li>
              ))}
            </ul>
          )}  
        </>
      )}
    </div>
  );
}
