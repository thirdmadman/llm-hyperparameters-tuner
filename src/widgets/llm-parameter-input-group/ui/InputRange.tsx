interface IInputRangeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  displayValue: number | string;
  onChange: (newValue: number) => void;
}

export function InputRange({ label, min, max, value, displayValue, onChange }: IInputRangeProps) {
  const rawStep = (max - min) / 100;
  const step = rawStep < 1 ? rawStep : 1;

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => {
          onChange(e.target.valueAsNumber);
        }}
        className="flex-1 accent-indigo-600"
      />
      <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-8 text-right">{displayValue}</span>
    </div>
  );
}
