import api from "@/lib/api";
import type { TelemetryResponse } from "@/types";

export const telemetryService = {
  getLatest(deviceId: string) {
    return api.get<TelemetryResponse>(`/telemetry/latest/${deviceId}`);
  },

  getHistory(deviceId: string, limit = 100) {
    return api.get<TelemetryResponse[]>(`/telemetry/history/${deviceId}`, {
      params: { limit },
    });
  },
};
