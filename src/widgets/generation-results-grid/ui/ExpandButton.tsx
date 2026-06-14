import { ExpandIcon } from './ExpandIcon';

interface IExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function ExpandButton({ isExpanded, onToggle }: IExpandButtonProps) {
  const label = isExpanded ? 'Collapse' : 'Expand';
  const ariaLabel = isExpanded ? 'Collapse card' : 'Expand card';

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1 ${isExpanded ? 'px-2 py-1' : 'p-1'} text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer`}
      aria-label={ariaLabel}
    >
      <ExpandIcon isExpanded={isExpanded} />
      {isExpanded ? label : ''}
    </button>
  );
}
