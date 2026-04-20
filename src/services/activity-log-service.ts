import api from "@/lib/api";
import type {
  ActivityLogCountResponse,
  ActivityLogListQuery,
  ActivityLogResponse,
  PaginatedResponse,
} from "@/types";

export const activityLogService = {
  list(params: ActivityLogListQuery = {}) {
    return api.get<PaginatedResponse<ActivityLogResponse>>("/admin/activity-logs/", { params });
  },

  count(params: Pick<ActivityLogListQuery, "category" | "user_id"> = {}) {
    return api.get<ActivityLogCountResponse>("/admin/activity-logs/count", {
      params,
    });
  },
};
