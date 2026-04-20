import api from "@/lib/api";
import type { TelemetryResponse, PaginatedResponse } from "@/types";

export const telemetryService = {
  getLatest(deviceId: string) {
    return api.get<TelemetryResponse>(`/telemetry/latest/${deviceId}`);
  },

  getHistory(deviceId: string, page = 1, page_size = 20) {
    return api.get<PaginatedResponse<TelemetryResponse>>(
      `/telemetry/history/${deviceId}`,
      { params: { page, page_size } },
    );
  },
};
