import api from "@/lib/api";
import type { ControlCommand, ControlResponse } from "@/types";

export const controlService = {
  sendCommand(deviceId: string, data: ControlCommand) {
    return api.post<ControlResponse>(`/control/${deviceId}`, data);
  },
};
