"use client";

import { useCallback, useRef } from "react";

interface Props {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
  formatLabel?: (v: number) => string;
  labelMin?: string;
  labelMax?: string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  formatLabel,
  labelMin,
  labelMax,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onChangeMin(Math.min(v, valueMax - step));
    },
    [onChangeMin, valueMax, step],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      onChangeMax(Math.max(v, valueMin + step));
    },
    [onChangeMax, valueMin, step],
  );

  const fmtMin = formatLabel ? formatLabel(valueMin) : String(valueMin);
  const fmtMax = formatLabel ? formatLabel(valueMax) : String(valueMax);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{labelMin ?? fmtMin}</span>
        <span>{labelMax ?? fmtMax}</span>
      </div>
      <div ref={trackRef} className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-neutral-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-600"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="range-thumb pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent"
          style={{ zIndex: pctMin > 50 ? 5 : 3 }}
          aria-label="Minimum"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="range-thumb pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent"
          style={{ zIndex: pctMax < 50 ? 5 : 4 }}
          aria-label="Maximum"
        />
      </div>
    </div>
  );
}
