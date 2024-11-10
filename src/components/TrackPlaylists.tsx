import { trackPlaylistsSelector } from "@/atoms/trackPlaylistsAtom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecoilValue } from "recoil";

export function TrackPlaylists() {
  const playlists = useRecoilValue(trackPlaylistsSelector);

  if (playlists.length === 0) {
    return null;
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle className="text-lg">In Your Playlists</CardTitle>
        <CardDescription>
          This track appears in {playlists.length} playlist
          {playlists.length === 1 ? "" : "s"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100%-7rem)]">
          <div className="space-y-2 pr-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center gap-3 rounded-lg border p-2"
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
                <Badge variant="secondary">{playlist.num_tracks} tracks</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
