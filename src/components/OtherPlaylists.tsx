import { playbackState } from "@/atoms/playbackAtom";
import { otherPlaylistsSelector } from "@/atoms/trackPlaylistsAtom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAddTrackToPlaylist } from "@/hooks/useAddTrackToPlaylist";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { PlaylistCard } from "./PlaylistCard";
import { Badge } from "./ui/badge";

interface Props {
  className?: string;
}

export function OtherPlaylists({ className }: Props) {
  const playlists = useRecoilValue(otherPlaylistsSelector);
  const currentTrack = useRecoilValue(playbackState).track;
  const addTrackToPlaylist = useAddTrackToPlaylist();
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);

  if (playlists.length === 0) {
    return null;
  }

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!currentTrack) return;

    try {
      setAddingToPlaylist(playlistId);
      await addTrackToPlaylist(playlistId, currentTrack.id);
    } catch (error) {
      console.error("Failed to add track to playlist:", error);
    } finally {
      setAddingToPlaylist(null);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <ScrollArea className="h-full [&_[data-radix-scroll-area-scrollbar]]:!bg-muted [&_[data-radix-scroll-area-thumb]]:!bg-muted-foreground">
          <div className="space-y-2 p-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => handleAddToPlaylist(playlist.id)}
                actions={
                  <Badge variant="secondary" className="shrink-0">
                    {playlist.num_tracks} tracks
                  </Badge>
                }
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
