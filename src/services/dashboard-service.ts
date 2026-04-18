import api from "@/lib/api";
import type { CountResponse, DeviceFilter, UserFilter } from "@/types";

export const dashboardService = {
  usersCount(filter?: UserFilter) {
    return api.get<CountResponse>("/admin/dashboard/users/count", {
      params: filter ? { filter } : undefined,
    });
  },

  devicesCount(filter?: DeviceFilter) {
    return api.get<CountResponse>("/admin/dashboard/devices/count", {
      params: filter ? { filter } : undefined,
    });
  },
};
