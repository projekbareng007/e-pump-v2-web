"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
  deviceCreateSchema,
  deviceUpdateSchema,
  type DeviceCreateForm,
  type DeviceUpdateForm,
} from "@/schemas/device.schema";
import { useCreateDevice, useUpdateDevice } from "@/hooks/use-device";
import type { DeviceResponse } from "@/types";
import OwnerSelect from "./owner-select";

interface DeviceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: DeviceResponse | null;
}

export default function DeviceFormDialog({
  open,
  onOpenChange,
  device,
}: DeviceFormDialogProps) {
  const isEdit = !!device;
  const createMutation = useCreateDevice();
  const updateMutation = useUpdateDevice();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeviceCreateForm | DeviceUpdateForm>({
    resolver: zodResolver(isEdit ? deviceUpdateSchema : deviceCreateSchema),
    defaultValues: {
      device_id: "",
      owner_id: null,
      status_pompa: false,
    },
  });

  const statusPompa = watch("status_pompa");

  useEffect(() => {
    if (device) {
      reset({
        owner_id: device.owner_id || null,
        status_pompa: device.status_pompa,
      });
    } else {
      reset({ device_id: "", owner_id: null, status_pompa: false });
    }
  }, [device, reset]);

  const onSubmit = (values: DeviceCreateForm | DeviceUpdateForm) => {
    if (isEdit) {
      updateMutation.mutate(
        {
          deviceId: device.device_id,
          data: {
            owner_id: (values as DeviceUpdateForm).owner_id,
            status_pompa: values.status_pompa,
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(values as DeviceCreateForm, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">
            {isEdit ? "Edit Device" : "Add New Device"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update device configuration and ownership."
              : "Register a new device to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!isEdit && (
            <div className="space-y-2">
              <Label
                htmlFor="device_id"
                className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
              >
                Device ID
              </Label>
              <Input
                id="device_id"
                placeholder="e.g. PUMP-001"
                {...register("device_id" as keyof DeviceCreateForm)}
                className="h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              {"device_id" in errors && errors.device_id && (
                <p className="text-xs text-red-500">
                  {errors.device_id.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="owner_id"
              className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Owner{" "}
              <span className="text-outline font-normal normal-case">
                (optional)
              </span>
            </Label>
            <OwnerSelect
              value={watch("owner_id") as string | null}
              onChange={(v) => setValue("owner_id", v)}
            />
            {errors.owner_id && (
              <p className="text-xs text-red-500">
                {(errors as any).owner_id.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 py-1">
            <Checkbox
              id="status_pompa"
              checked={statusPompa ?? false}
              onCheckedChange={(checked: boolean) =>
                setValue("status_pompa", checked)
              }
              className="size-5 rounded border-outline-variant bg-surface-container data-[state=checked]:bg-primary data-[state=checked]:text-on-primary"
            />
            <Label
              htmlFor="status_pompa"
              className="text-sm text-on-surface-variant font-body cursor-pointer"
            >
              Pump is active
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Device"
              ) : (
                "Create Device"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
