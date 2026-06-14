export function IconErrorOutlineRounded() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12.713 16.713Q13 16.425 13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17t.713-.288m0-4Q13 12.425 13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13t.713-.288M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
      ></path>
    </svg>
  );
}

export function IconProgressActivity() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="animate-spin" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M8.125 21.213q-1.825-.788-3.187-2.15t-2.15-3.188T2 11.988t.788-3.875t2.15-3.175t3.187-2.15T12 2q.425 0 .713.288T13 3t-.288.713T12 4Q8.675 4 6.337 6.338T4 12t2.338 5.663T12 20t5.663-2.337T20 12q0-.425.288-.712T21 11t.713.288T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15t-3.875.787t-3.887-.787"
      ></path>
    </svg>
  );
}

export function IconCheckCircleOutlineRounded() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
      ></path>
    </svg>
  );
}

export function IconCancelOutlineRounded() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="m12 13.4l2.9 2.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7t.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
      ></path>
    </svg>
  );
}

const STATUS_BADGE_LABELS = {
  ready: 'Done',
  loading: 'Streaming...',
  cancelled: 'Cancelled',
  error: 'Error',
};

const STATUS_BADGE_ICONS = {
  ready: IconCheckCircleOutlineRounded,
  loading: IconProgressActivity,
  cancelled: IconCancelOutlineRounded,
  error: IconErrorOutlineRounded,
};

const STATUS_BADGE_STYLES = {
  ready: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  loading: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 animate-pulse',
  cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

interface IStatusBadgeProps {
  status: 'ready' | 'loading' | 'cancelled' | 'error';
  isSmall: boolean;
}

export function StatusBadge({ status, isSmall }: IStatusBadgeProps) {
  return (
    <span
      className={`flex items-center justify-center rounded-full ${isSmall ? 'p-1' : 'px-2 py-1'} text-xs gap-1 font-medium ${STATUS_BADGE_STYLES[status]}`}
    >
      {STATUS_BADGE_ICONS[status]()}
      {!isSmall && STATUS_BADGE_LABELS[status]}
    </span>
  );
}
