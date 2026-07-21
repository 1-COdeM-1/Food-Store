/**
 * FoodImagePlaceholder
 * Shown whenever a product has no image URL.
 * – Light mode: light-gray background
 * – Dark mode:  dark-gray background
 * Two food SVG icons (fork + knife & dish with dome) are centred inside.
 */

interface FoodImagePlaceholderProps {
  /** Extra Tailwind classes to add to the outer wrapper (e.g. rounded-2xl) */
  className?: string;
}

export function FoodImagePlaceholder({ className = '' }: FoodImagePlaceholderProps) {
  return (
    <div
      className={`
        w-full h-full
        flex flex-col items-center justify-center gap-3
        bg-gray-100 dark:bg-gray-800
        ${className}
      `}
      aria-label="لا توجد صورة للمنتج"
    >
      {/* Row of two food icons */}
      <div className="flex items-end gap-4">

        {/* Fork + Knife icon */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >
          {/* Fork tines */}
          <line x1="10" y1="6"  x2="10" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="6"  x2="14" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="6"  x2="18" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Fork handle arch */}
          <path d="M10 16 Q14 22 14 26 L14 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Knife blade */}
          <path d="M30 6 C30 6 36 10 36 18 L36 20 L30 20 L30 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Dish with dome icon */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >
          {/* Dome */}
          <path
            d="M8 26 C8 15 40 15 40 26"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Plate rim */}
          <line x1="4"  y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Plate base */}
          <path
            d="M8 30 Q8 36 24 36 Q40 36 40 30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Dome handle */}
          <circle cx="24" cy="20" r="2.5" fill="currentColor" />
        </svg>

      </div>

      {/* Subtle label */}
      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium tracking-wide select-none">
        لا توجد صورة
      </span>
    </div>
  );
}
