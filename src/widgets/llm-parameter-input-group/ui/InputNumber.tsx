interface IInputNumberProps {
  value: number | string;
  onChange: (newValue: number) => void;
  step?: number | string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function InputNumber({ value, onChange, step = 1, placeholder, className = '', disabled }: IInputNumberProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        onChange(Number(e.target.value));
      }}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      className={`flex-1 px-2 py-1.5 text-sm font-mono rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    />
  );
}
