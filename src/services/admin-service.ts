import api from "@/lib/api";
import type {
  DeviceCreate,
  DeviceUpdate,
  DeviceResponse,
} from "@/types";

export const adminService = {
  getAllDevices() {
    return api.get<DeviceResponse[]>("/admin/devices/");
  },

  getDevice(deviceId: string) {
    return api.get<DeviceResponse>(`/admin/devices/${deviceId}`);
  },

  createDevice(data: DeviceCreate) {
    return api.post<DeviceResponse>("/admin/devices/", data);
  },

  updateDevice(deviceId: string, data: DeviceUpdate) {
    return api.put<DeviceResponse>(`/admin/devices/${deviceId}`, data);
  },

  deleteDevice(deviceId: string) {
    return api.delete(`/admin/devices/${deviceId}`);
  },

  getDeviceQr(deviceId: string) {
    return api.get(`/admin/devices/${deviceId}/qr`);
  },
};
