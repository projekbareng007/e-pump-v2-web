import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/services/admin-service";
import type { DeviceCreate, DeviceUpdate } from "@/types";

const DEVICE_KEYS = {
  all: ["devices"] as const,
  list: () => [...DEVICE_KEYS.all, "list"] as const,
  detail: (id: string) => [...DEVICE_KEYS.all, "detail", id] as const,
};

export function useDevices() {
  return useQuery({
    queryKey: DEVICE_KEYS.list(),
    queryFn: () => adminService.getAllDevices({ page_size: 100 }).then((r) => r.data.items),
    refetchInterval: 30_000,
  });
}

export function useCreateDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeviceCreate) => adminService.createDevice(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS.list() });
      toast.success("Device created successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to create device",
      );
    },
  });
}

export function useUpdateDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      deviceId,
      data,
    }: {
      deviceId: string;
      data: DeviceUpdate;
    }) => adminService.updateDevice(deviceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS.list() });
      toast.success("Device updated successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to update device",
      );
    },
  });
}

export function useDeleteDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => adminService.deleteDevice(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS.list() });
      toast.success("Device deleted successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to delete device",
      );
    },
  });
}
