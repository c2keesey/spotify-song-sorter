import { keyBindingsState } from "@/atoms/keyBindingsAtom";
import { playbackState, removedPlaylistsState } from "@/atoms/playbackAtom";
import {
  PlaylistAction,
  playlistHistoryState,
} from "@/atoms/playlistHistoryAtom";
import { otherPlaylistsSelector } from "@/atoms/trackPlaylistsAtom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAddTrackToPlaylist } from "@/hooks/useAddTrackToPlaylist";
import { useRemoveTrackFromPlaylist } from "@/hooks/useRemoveTrackFromPlaylist";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlaylistCard } from "./PlaylistCard";

interface Props {
  className?: string;
}

export function OtherPlaylists({ className }: Props) {
  const playlists = useRecoilValue(otherPlaylistsSelector);
  const currentTrack = useRecoilValue(playbackState).track;
  const addTrackToPlaylist = useAddTrackToPlaylist();
  const removeTrackFromPlaylist = useRemoveTrackFromPlaylist();
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);
  const [playlistHistory, setPlaylistHistory] =
    useRecoilState(playlistHistoryState);
  const keyBindings = useRecoilValue(keyBindingsState);
  const [removedPlaylists, setRemovedPlaylists] = useRecoilState(
    removedPlaylistsState
  );

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!currentTrack) return;

    try {
      setAddingToPlaylist(playlistId);
      await addTrackToPlaylist(playlistId, currentTrack.id);
      setPlaylistHistory((prev) => [
        {
          type: "add",
          trackId: currentTrack.id,
          playlistId: playlistId,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Failed to add track to playlist:", error);
    } finally {
      setAddingToPlaylist(null);
    }
  };

  const handleUndoAction = async (lastAction: PlaylistAction) => {
    if (!currentTrack) return;

    try {
      setAddingToPlaylist(lastAction.playlistId);
      if (lastAction.type === "add") {
        await removeTrackFromPlaylist(
          lastAction.playlistId,
          lastAction.trackId!
        );
      } else if (lastAction.type === "remove") {
        await addTrackToPlaylist(lastAction.playlistId, lastAction.trackId!);
      } else if (lastAction.type === "hidePlaylist") {
        setRemovedPlaylists((prev) =>
          prev.filter((id) => id !== lastAction.playlistId)
        );
      }
      setPlaylistHistory((prev) => prev.slice(1));
    } catch (error) {
      console.error("Failed to undo action:", error);
    } finally {
      setAddingToPlaylist(null);
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (!currentTrack) return;

      const binding = keyBindings.find((kb) => kb.code === event.code);

      if (!binding) return;

      event.preventDefault();

      switch (binding.action) {
        case "addToFirstPlaylist": {
          const firstPlaylist = playlists[0];
          if (firstPlaylist) {
            try {
              setAddingToPlaylist(firstPlaylist.id);
              await addTrackToPlaylist(firstPlaylist.id, currentTrack.id);
              setPlaylistHistory((prev) => [
                {
                  type: "add",
                  trackId: currentTrack.id,
                  playlistId: firstPlaylist.id,
                  timestamp: Date.now(),
                },
                ...prev,
              ]);
            } catch (error) {
              console.error("Failed to add track to playlist:", error);
            } finally {
              setAddingToPlaylist(null);
            }
          }
          break;
        }
        case "removeFirstPlaylist": {
          const firstPlaylist = playlists[0];
          if (firstPlaylist) {
            setRemovedPlaylists((prev) => [...prev, firstPlaylist.id]);
            setPlaylistHistory((prev) => [
              {
                type: "hidePlaylist",
                playlistId: firstPlaylist.id,
                timestamp: Date.now(),
              },
              ...prev,
            ]);
          }
          break;
        }
        case "undoLastAction": {
          const lastAction = playlistHistory[0];
          if (lastAction) {
            await handleUndoAction(lastAction);
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    keyBindings,
    currentTrack,
    playlists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    playlistHistory,
    setPlaylistHistory,
    setRemovedPlaylists,
  ]);

  const filteredPlaylists = playlists;

  if (filteredPlaylists.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-6">
            {/* First playlist highlighted */}
            {filteredPlaylists[0] && (
              <div className="bg-muted/50 rounded-lg p-6 hover:bg-muted/70 transition-colors">
                <PlaylistCard
                  key={filteredPlaylists[0].id}
                  playlistId={filteredPlaylists[0].id}
                  onClick={() => handleAddToPlaylist(filteredPlaylists[0].id)}
                  size="large"
                  actions={
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-lg py-1"
                    >
                      {filteredPlaylists[0].num_tracks} tracks
                    </Badge>
                  }
                />
              </div>
            )}

            {/* Separator between first and rest */}
            {filteredPlaylists.length > 1 && <Separator className="my-4" />}

            {/* Rest of the playlists */}
            <div className="space-y-2">
              {filteredPlaylists.slice(1).map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlistId={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
