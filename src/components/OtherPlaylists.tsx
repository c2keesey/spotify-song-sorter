import { otherPlaylistsSelector } from "@/atoms/trackPlaylistsAtom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecoilValue } from "recoil";
import { Badge } from "./ui/badge";

export function OtherPlaylists() {
  const playlists = useRecoilValue(otherPlaylistsSelector);

  if (playlists.length === 0) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col flex-1 overflow-auto">
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-6">
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
