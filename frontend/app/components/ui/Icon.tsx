export default function Icon({ name, className = '', filled = false, size }: { name: string; className?: string; filled?: boolean, size?: number }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
        ...(size ? { fontSize: `${size}px` } : {})
      }}
    >
      {name}
    </span>
  );
}
