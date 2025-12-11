import { useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  label: string;
  step?: number;
  saving?: boolean;
}

export function RangeSlider({
  min,
  max,
  values,
  onChange,
  label,
  step = 1,
  saving,
}: RangeSliderProps) {
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= values[1]) {
      onChange([newMin, values[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= values[0]) {
      onChange([values[0], newMax]);
    }
  };

  const minPercent = ((values[0] - min) / (max - min)) * 100;
  const maxPercent = ((values[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground mb-2 block">
        {label}: {values[0]} - {values[1]} years
      </label>
      <div className="relative px-3 pt-2">
        <div className="relative h-2 bg-muted rounded-full">
          <div
            className="absolute h-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>
        <input
  type="range"
  min={min}
  max={max}
  value={values[0]}
  step={step}
  onChange={handleMinChange}
  onMouseDown={() => setDragging("min")}
  onMouseUp={() => setDragging(null)}
  className={`absolute w-full h-2 bg-transparent appearance-none slider-thumb top-2 pointer-events-none ${
    dragging === "min" ? "z-30" : "z-20"
  }`}
  disabled={saving}
/>

<input
  type="range"
  min={min}
  max={max}
  value={values[1]}
  step={step}
  onChange={handleMaxChange}
  onMouseDown={() => setDragging("max")}
  onMouseUp={() => setDragging(null)}
  className={`absolute w-full h-2 bg-transparent appearance-none slider-thumb top-2 pointer-events-none ${
    dragging === "max" ? "z-30" : "z-20"
  }`}
  disabled={saving}
/>

      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
      `}</style>
    </div>
  );
}
