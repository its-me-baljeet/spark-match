interface SingleSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  unit: string;
  step?: number;
}

export function SingleSlider({
  min,
  max,
  value,
  onChange,
  label,
  unit,
  step = 1,
}: SingleSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      {/* Added mb-2 and block for spacing */}
      <label className="text-sm font-semibold text-foreground mb-2 block">
        {label}: {value} {unit}
      </label>

      {/* Added pt-4 to avoid overlap */}
      <div className="relative px-3 pt-2">
        <div className="h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb top-2"
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
