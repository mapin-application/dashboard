import { clsx } from "clsx";

interface TagProps {
  label: string;
  variant?: "primary" | "outline" | "gray";
  size?: "sm" | "md";
}

export function Tag({ label, variant = "outline", size = "sm" }: TagProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        variant === "primary" && "bg-[#FF7E64] text-white",
        variant === "outline" && "bg-[#FFEFEC] text-[#FF7E64] border border-[#FF7E64]/20",
        variant === "gray" && "bg-gray-100 text-gray-500"
      )}
    >
      {label}
    </span>
  );
}
