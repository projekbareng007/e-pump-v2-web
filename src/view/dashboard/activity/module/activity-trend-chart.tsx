"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { activityLogService } from "@/services/activity-log-service";

const BUCKET_COUNT = 6;
const BUCKET_HOURS = 4;
const WINDOW_HOURS = BUCKET_COUNT * BUCKET_HOURS;

function buildBuckets(logs: { created_at: string }[]) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_HOURS * 60 * 60 * 1000);

  const buckets = new Array(BUCKET_COUNT).fill(0);
  for (const log of logs) {
    const t = new Date(log.created_at).getTime();
    if (t < windowStart.getTime() || t > now.getTime()) continue;
    const hoursFromStart = (t - windowStart.getTime()) / (60 * 60 * 1000);
    const idx = Math.min(
      BUCKET_COUNT - 1,
      Math.floor(hoursFromStart / BUCKET_HOURS),
    );
    buckets[idx] += 1;
  }

  const labels: string[] = [];
  for (let i = 0; i <= BUCKET_COUNT; i += 1) {
    const d = new Date(windowStart.getTime() + i * BUCKET_HOURS * 60 * 60 * 1000);
    labels.push(
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
  }

  return { buckets, labels };
}

function buildPath(buckets: number[]): string {
  if (buckets.length === 0) return "";
  const max = Math.max(1, ...buckets);
  const step = 1000 / (buckets.length - 1 || 1);
  return buckets
    .map((v, i) => {
      const x = i * step;
      const y = 100 - (v / max) * 90;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function ActivityTrendChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs", "trend"],
    queryFn: async () =>
      (await activityLogService.list({ page: 1, page_size: 200 })).data.items,
  });

  const { buckets, labels, linePath, areaPath } = useMemo(() => {
    const { buckets, labels } = buildBuckets(data ?? []);
    const linePath = buildPath(buckets);
    const areaPath = linePath ? `${linePath} L 1000 100 L 0 100 Z` : "";
    return { buckets, labels, linePath, areaPath };
  }, [data]);

  return (
    <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-sm border border-outline-variant/10 mb-10">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-bold font-heading text-on-surface">
              Activity Trends
            </h3>
            <p className="text-sm text-on-surface-variant">
              Last {WINDOW_HOURS} hours, bucketed per {BUCKET_HOURS} hours
            </p>
          </div>
          {isLoading && (
            <Loader2 className="size-5 animate-spin text-outline" />
          )}
        </div>

        <div className="h-64 relative">
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-5">
            <div className="border-t border-on-surface w-full" />
            <div className="border-t border-on-surface w-full" />
            <div className="border-t border-on-surface w-full" />
            <div className="border-t border-on-surface w-full" />
          </div>

          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#003d7c" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {linePath && (
              <>
                <path
                  d={areaPath}
                  fill="url(#chartGradient)"
                  opacity="0.15"
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#003d7c"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {buckets.map((v, i) => {
                  const max = Math.max(1, ...buckets);
                  const step = 1000 / (buckets.length - 1 || 1);
                  const cx = i * step;
                  const cy = 100 - (v / max) * 90;
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill="#003d7c"
                      vectorEffect="non-scaling-stroke"
                    >
                      <title>{`${v} activities`}</title>
                    </circle>
                  );
                })}
              </>
            )}
          </svg>
        </div>
        <div className="flex justify-between px-1 mt-6 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
