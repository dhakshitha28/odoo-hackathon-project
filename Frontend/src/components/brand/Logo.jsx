export default function Logo({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#714B67" />
      <path
        d="M10 22c4-8 8-8 10 0s6 8 10 0"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="14" r="2.2" fill="#F4ECF2" />
    </svg>
  )
}
