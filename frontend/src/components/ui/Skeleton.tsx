import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.05)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
