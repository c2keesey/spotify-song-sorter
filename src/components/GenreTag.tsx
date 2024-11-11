import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GenreTagProps {
  name: string;
  count: number;
  maxCount: number;
  className?: string;
}

const GENRE_COLORS = {
  rock: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  pop: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
  rap: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  hiphop: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  electronic: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  jazz: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  classical: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  // Add more genres as needed
} as const;

export function GenreTag({ name, count, maxCount, className }: GenreTagProps) {
  const normalizedCount = Math.max(0.4, count / maxCount);
  const baseColor = Object.entries(GENRE_COLORS).find(([key]) =>
    name.toLowerCase().includes(key)
  )?.[1];

  return (
    <Badge
      variant="secondary"
      className={cn(
        "transition-all",
        baseColor,
        !baseColor && `opacity-${Math.floor(normalizedCount * 100)}`,
        className
      )}
    >
      {name} ({count})
    </Badge>
  );
}
