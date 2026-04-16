"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Printer } from "lucide-react";
import { adminService } from "@/services/admin-service";
import { toast } from "sonner";

interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
}

export default function QrCodeDialog({
  open,
  onOpenChange,
  deviceId,
}: QrCodeDialogProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !deviceId) return;
    let objectUrl: string | null = null;
    setLoading(true);
    adminService
      .getDeviceQr(deviceId)
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setQrUrl(objectUrl);
      })
      .catch((err: any) => {
        toast.error(
          err?.response?.data?.detail?.[0]?.msg ||
            err?.response?.data?.detail ||
            "Failed to generate QR code",
        );
        onOpenChange(false);
      })
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setQrUrl(null);
    };
  }, [open, deviceId, onOpenChange]);

  const handleDownload = () => {
    if (!qrUrl || !deviceId) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `${deviceId}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!qrUrl || !deviceId) return;
    const win = window.open("", "_blank", "width=600,height=600");
    if (!win) {
      toast.error("Unable to open print window. Please allow popups.");
      return;
    }
    win.document.write(`
      <html>
        <head>
          <title>QR Code - ${deviceId}</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
            img { max-width: 80%; height: auto; }
            h2 { margin-top: 20px; }
          </style>
        </head>
        <body>
          <img src="${qrUrl}" alt="QR Code" />
          <h2>${deviceId}</h2>
          <script>
            window.onload = () => { window.focus(); window.print(); };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">
            Device QR Code
          </DialogTitle>
          <DialogDescription>
            {deviceId ? `Scan or share the QR code for ${deviceId}.` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-6">
          {loading || !qrUrl ? (
            <div className="w-64 h-64 flex items-center justify-center bg-surface-container rounded-xl">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt={`QR code for ${deviceId}`}
              className="w-64 h-64 rounded-xl border border-outline-variant/20 bg-white p-3"
            />
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              disabled={!qrUrl}
            >
              <Printer className="size-4" />
              Print
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!qrUrl}
              className="bg-primary text-white"
            >
              <Download className="size-4" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
