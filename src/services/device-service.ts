import api from "@/lib/api";
import type { DeviceClaim, DeviceResponse, PaginatedResponse, PaginatedQuery } from "@/types";

export const deviceService = {
  claimDevice(data: DeviceClaim) {
    return api.post<DeviceResponse>("/devices/claim", data);
  },

  getMyDevices(params?: PaginatedQuery) {
    return api.get<PaginatedResponse<DeviceResponse>>("/devices/", { params });
  },
};
