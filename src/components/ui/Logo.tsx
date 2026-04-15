interface LogoProps {
  className?: string;
  height?: number;
}

export function Logo({ className = "", height = 28 }: LogoProps) {
  const width = Math.round(height * (704 / 473));
  return (
    <img
      src="/logo.svg"
      alt="MAPIN"
      width={width}
      height={height}
      className={className}
      style={{ height, width }}
    />
  );
}
