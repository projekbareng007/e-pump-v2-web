"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { timeLabels, chartHeights } from "./activity-constants";

export default function ActivityTrendChart() {
  const [activeRange, setActiveRange] = useState<"hourly" | "daily" | "weekly">("daily");

  return (
    <Card className="bg-surface-container-lowest border-none rounded-3xl shadow-sm border border-outline-variant/10 mb-10">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-bold font-heading text-on-surface">
              Activity Trends
            </h3>
            <p className="text-sm text-on-surface-variant">
              Hourly aggregate of system-wide user interactions
            </p>
          </div>
          <div className="flex gap-2">
            {(["hourly", "daily", "weekly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                  activeRange === range
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 flex items-end justify-between px-4 relative">
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-5">
            <div className="border-t border-on-surface w-full" />
            <div className="border-t border-on-surface w-full" />
            <div className="border-t border-on-surface w-full" />
            <div className="border-t border-on-surface w-full" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#003d7c" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M0 80 Q 125 70, 250 90 T 500 40 T 750 60 T 1000 20"
                fill="none"
                stroke="#003d7c"
                strokeWidth="4"
              />
              <path
                d="M0 80 Q 125 70, 250 90 T 500 40 T 750 60 T 1000 20 L 1000 100 L 0 100 Z"
                fill="url(#chartGradient)"
                opacity="0.1"
              />
            </svg>
          </div>

          {chartHeights.map((h, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 z-10"
              style={{ marginBottom: `${h}px` }}
            />
          ))}
        </div>
        <div className="flex justify-between px-4 mt-6 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
          {timeLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
