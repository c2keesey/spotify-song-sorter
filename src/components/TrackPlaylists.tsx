import { playbackState } from "@/atoms/playbackAtom";
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
import { useRemoveTrackFromPlaylist } from "@/hooks/useRemoveTrackFromPlaylist";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { PlaylistCard } from "./PlaylistCard";

export function TrackPlaylists() {
  const playlists = useRecoilValue(trackPlaylistsSelector);
  const currentTrack = useRecoilValue(playbackState).track;
  const removeTrackFromPlaylist = useRemoveTrackFromPlaylist();
  const [removingFromPlaylist, setRemovingFromPlaylist] = useState<
    string | null
  >(null);

  if (playlists.length === 0) {
    return null;
  }

  const handleRemoveFromPlaylist = async (playlistId: string) => {
    if (!currentTrack) return;

    try {
      setRemovingFromPlaylist(playlistId);
      await removeTrackFromPlaylist(playlistId, currentTrack.id);
    } catch (error) {
      console.error("Failed to remove track from playlist:", error);
    } finally {
      setRemovingFromPlaylist(null);
    }
  };

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
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => handleRemoveFromPlaylist(playlist.id)}
                actions={
                  <Badge variant="secondary">
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
