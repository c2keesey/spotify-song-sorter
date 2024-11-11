import { playlistsState } from "@/atoms/playlistAtom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRecoilValue } from "recoil";

interface PlaylistCardProps {
  playlistId: string;
  onClick?: () => void;
  className?: string;
  size?: "default" | "large";
}

export function PlaylistCard({
  playlistId,
  onClick,
  className,
  size = "default",
}: PlaylistCardProps) {
  const playlists = useRecoilValue(playlistsState);
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-start gap-3 rounded-lg border p-2 hover:bg-accent/50 active:bg-accent transition-colors text-left",
        size === "large" && "p-3 gap-4",
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
              size === "default" && "h-12 w-12",
              size === "large" && "h-16 w-16"
            )}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "font-medium truncate",
                size === "large" && "text-xl"
              )}
            >
              {playlist.name}
              {playlist.num_tracks && (
                <span
                  className={cn(
                    "ml-2 font-normal text-muted-foreground",
                    size === "default" && "text-xs",
                    size === "large" && "text-sm"
                  )}
                >
                  · {playlist.num_tracks} tracks
                </span>
              )}
            </h4>
          </div>
          <p
            className={cn(
              "text-muted-foreground truncate",
              size === "default" && "text-sm",
              size === "large" && "text-base"
            )}
          >
            By {playlist.owner.displayName}
          </p>
        </div>
      </div>

      {playlist.genres && playlist.genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {[...playlist.genres]
            .sort((a, b) => b.count - a.count)
            .slice(0, size === "large" ? 20 : 10)
            .map((genre) => {
              const opacity = Math.max(
                0.3,
                genre.count / playlist.genres[0].count
              );
              return (
                <Badge
                  key={genre.name}
                  variant="secondary"
                  className={cn("text-xs", size === "large" && "text-sm")}
                  style={{ opacity }}
                >
                  {genre.name} ({genre.count})
                </Badge>
              );
            })}
        </div>
      )}
    </button>
  );
}
