import api from "@/lib/api";
import type { DeviceClaim, DeviceResponse } from "@/types";

export const deviceService = {
  claimDevice(data: DeviceClaim) {
    return api.post<DeviceResponse>("/devices/claim", data);
  },

  getMyDevices() {
    return api.get<DeviceResponse[]>("/devices/");
  },
};
