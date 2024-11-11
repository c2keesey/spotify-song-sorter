import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: {
    id: string;
    imageUrl?: string;
    name: string;
    owner: {
      displayName: string;
    };
    num_tracks: number;
  };
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "default" | "large";
}

export function PlaylistCard({
  playlist,
  actions,
  onClick,
  className,
  size = "default",
}: PlaylistCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-accent/50 active:bg-accent transition-colors text-left",
        size === "large" && "p-3 gap-4",
        className
      )}
    >
      {playlist.imageUrl && (
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          className={cn(
            "rounded-md object-cover",
            size === "default" && "h-12 w-12",
            size === "large" && "h-16 w-16"
          )}
        />
      )}
      <div className="flex-1 min-w-0">
        <h4
          className={cn("font-medium truncate", size === "large" && "text-xl")}
        >
          {playlist.name}
        </h4>
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
      {actions}
    </button>
  );
}
