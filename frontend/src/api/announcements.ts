import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "./client";
import type {
  Announcement,
  AnnouncementFilters,
  ApiResponse,
  CreateAnnouncementInput,
} from "../types";

// TODO(candidate): build the query string from `filters` (search, targetRole,
// page, size — all optional, omit params that are empty/undefined) and call
// apiGet<ApiResponse<Announcement[]>>(`/announcements?${queryString}`).
//
// Then use it inside a React Query `useQuery` hook below. The query key MUST
// include `filters` so the list refetches whenever search/targetRole/page
// change.
export function useAnnouncements(filters: AnnouncementFilters) {
  return useQuery<ApiResponse<Announcement[]>>({
    queryKey: ["announcements", filters],
    queryFn: async () => {
      return await (async () => {
        const queryString = new URLSearchParams(
          Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, v.toString()])
        ).toString();
        const res = await apiGet<ApiResponse<Announcement[]>>(`/announcements?${queryString}`);
        return res;
      })();
    },
  });
}

// TODO(candidate): call apiPost<ApiResponse<Announcement>>("/announcements", input)
// inside the mutationFn below, and invalidate the ["announcements"] query key
// on success so the list refetches and shows the newly created announcement.
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Announcement>, Error, CreateAnnouncementInput>({
    mutationFn: async (_input) => {
      return await (async () => {
        const res = await apiPost<ApiResponse<Announcement>>("/announcements", _input);
        return res;
      })(); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
