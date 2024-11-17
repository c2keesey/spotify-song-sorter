import { playlistsState } from "@/atoms/playlistAtom";
import { cn } from "@/lib/utils";
import { useRecoilValue } from "recoil";
import { GenreTag } from "./GenreTag";

interface PlaylistCardProps {
  playlistId: string;
  onClick?: () => void;
  className?: string;
  variant: "focus" | "ready" | "added";
}

export function PlaylistCard({
  playlistId,
  onClick,
  className,
  variant = "ready",
}: PlaylistCardProps) {
  const playlists = useRecoilValue(playlistsState);
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-start gap-3 rounded-lg border p-2 hover:bg-accent/50 active:bg-accent transition-colors text-left",
        variant === "focus" && "p-3 gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3 w-full">
        {playlist.images?.[0]?.url && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className={cn(
              "rounded-md object-cover",
              (variant === "ready" || variant === "added") && "h-12 w-12",
              variant === "focus" && "h-16 w-16"
            )}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "font-medium truncate",
                variant === "focus" && "text-xl"
              )}
            >
              {playlist.name}
              {playlist.num_tracks && (
                <span
                  className={cn(
                    "ml-2 font-normal text-muted-foreground",
                    (variant === "ready" || variant === "added") && "text-xs",
                    variant === "focus" && "text-sm"
                  )}
                >
                  · {playlist.num_tracks} tracks
                </span>
              )}
            </h4>
          </div>
        </div>
      </div>

      {playlist.genres && playlist.genres.length > 0 && variant !== "added" && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {[...playlist.genres]
            .sort((a, b) => b.count - a.count)
            .slice(0, variant === "focus" ? 20 : 10)
            .map((genre) => {
              const maxCount = Math.max(...playlist.genres.map((g) => g.count));
              return (
                <GenreTag
                  key={genre.name}
                  name={genre.name}
                  count={genre.count}
                  maxCount={maxCount}
                />
              );
            })}
        </div>
      )}
    </button>
  );
}
