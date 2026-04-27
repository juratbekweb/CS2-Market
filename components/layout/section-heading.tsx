import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      <div className="text-xs font-semibold uppercase tracking-[0.35em] text-glow">{eyebrow}</div>
      <h2 className="font-heading text-3xl uppercase tracking-[0.12em] text-white sm:text-4xl">{title}</h2>
      <p className="text-sm leading-7 text-muted sm:text-base">{description}</p>
    </div>
  );
}
