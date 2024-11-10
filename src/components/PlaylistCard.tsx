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
}

export function PlaylistCard({
  playlist,
  actions,
  onClick,
}: PlaylistCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-lg border p-2 hover:bg-accent/50 active:bg-accent transition-colors text-left"
    >
      {playlist.imageUrl && (
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          className="h-12 w-12 rounded-md object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{playlist.name}</h4>
        <p className="text-sm text-muted-foreground truncate">
          By {playlist.owner.displayName}
        </p>
      </div>
      {actions}
    </button>
  );
}
