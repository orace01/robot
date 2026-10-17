import Link from "next/link";
import { cn } from "@/lib/cn";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  secondary: "bg-white text-ink ring-1 ring-line hover:ring-ink/40",
  accent: "bg-accent text-white hover:bg-accent-strong",
  ghost: "text-ink hover:bg-ink/5",
  inverse: "bg-white text-ink hover:bg-white/85",
  outlineLight: "text-white ring-1 ring-white/35 hover:bg-white/10",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
} as const;

export interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function buttonClass({ variant = "primary", size = "md" }: ButtonStyleProps = {}, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & ButtonStyleProps) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />;
}
