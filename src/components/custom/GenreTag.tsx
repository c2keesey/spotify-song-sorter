import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GenreTagProps {
  name: string;
  count: number;
  maxCount: number;
  className?: string;
  isMatching?: boolean;
}

const GENRE_COLORS = {
  rock: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  pop: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
  rap: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  hiphop: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  electronic: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  jazz: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  classical: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  metal: "bg-slate-700/10 text-slate-700 hover:bg-slate-700/20",
  indie: "bg-violet-500/10 text-violet-500 hover:bg-violet-500/20",
  folk: "bg-amber-600/10 text-amber-600 hover:bg-amber-600/20",
  blues: "bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20",
  country: "bg-brown-500/10 text-brown-500 hover:bg-brown-500/20",
  soul: "bg-rose-600/10 text-rose-600 hover:bg-rose-600/20",
  rnb: "bg-fuchsia-500/10 text-fuchsia-500 hover:bg-fuchsia-500/20",
  reggae: "bg-green-600/10 text-green-600 hover:bg-green-600/20",
  latin: "bg-orange-600/10 text-orange-600 hover:bg-orange-600/20",
  punk: "bg-red-700/10 text-red-700 hover:bg-red-700/20",
  alternative: "bg-purple-600/10 text-purple-600 hover:bg-purple-600/20",
  edm: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
  house: "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20",
  techno: "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20",
  lofi: "bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/20",
  dub: "bg-blue-700/10 text-blue-700 hover:bg-blue-700/20",
  dubstep: "bg-violet-700/10 text-violet-700 hover:bg-violet-700/20",
  "drum and bass": "bg-blue-800/10 text-blue-800 hover:bg-blue-800/20",
  dnb: "bg-blue-800/10 text-blue-800 hover:bg-blue-800/20",
  trance: "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20",
  downtempo: "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20",
  "glitch hop": "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20",
  psybass: "bg-violet-500/10 text-violet-500 hover:bg-violet-500/20",
  electro: "bg-cyan-600/10 text-cyan-600 hover:bg-cyan-600/20",
  bass: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
  breakbeat: "bg-sky-600/10 text-sky-600 hover:bg-sky-600/20",
  ambient: "bg-slate-400/10 text-slate-400 hover:bg-slate-400/20",
  experimental: "bg-purple-400/10 text-purple-400 hover:bg-purple-400/20",
  synthwave: "bg-pink-400/10 text-pink-400 hover:bg-pink-400/20",
} as const;

export function GenreTag({
  name,
  count,
  maxCount,
  className,
  isMatching = false,
}: GenreTagProps) {
  const normalizedCount = Math.max(0.4, count / maxCount);
  const baseColor = Object.entries(GENRE_COLORS).find(([key]) =>
    name.toLowerCase().includes(key)
  )?.[1];

  return (
    <div className="relative inline-flex">
      {isMatching && (
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all animate-[pulse-subtle_2s_ease-in-out_infinite]",
            baseColor?.replace("bg", "ring").replace("hover:bg", "ring"),
            !baseColor && "ring-gray-500",
            "ring-2 ring-offset-1 ring-offset-background"
          )}
        />
      )}

      <Badge
        variant="secondary"
        className={cn(
          "relative transition-all",
          baseColor,
          !baseColor && "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
          className
        )}
        style={{ opacity: normalizedCount }}
      >
        {name} ({count})
      </Badge>
    </div>
  );
}
