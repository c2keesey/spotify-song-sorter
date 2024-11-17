import { keyBindingsState } from "@/atoms/keyBindingsAtom";
import { playbackState, removedPlaylistsState } from "@/atoms/playbackAtom";
import { PlaylistWithTracks } from "@/atoms/playlistAtom";
import {
  PlaylistAction,
  playlistHistoryState,
} from "@/atoms/playlistHistoryAtom";
import { currentRankerState } from "@/atoms/rankingAtom";
import { otherPlaylistsSelector } from "@/atoms/trackPlaylistsAtom";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingDots } from "@/components/ui/loading-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAddTrackToPlaylist } from "@/hooks/useAddTrackToPlaylist";
import { useRemoveTrackFromPlaylist } from "@/hooks/useRemoveTrackFromPlaylist";
import { GenreMatchRanker } from "@/ranking/algorithms/GenreMatchRanker";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlaylistCard } from "./PlaylistCard";

interface Props {
  className?: string;
}

interface PlaylistScore {
  playlistId: string;
  score: number;
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
  const currentRanker = useRecoilValue(currentRankerState);
  const playbackData = useRecoilValue(playbackState);
  const [rankedPlaylists, setRankedPlaylists] = useState<PlaylistWithTracks[]>(
    []
  );
  const [isRanking, setIsRanking] = useState(false);
  const [rankingError, setRankingError] = useState<boolean>(false);
  const [playlistScores, setPlaylistScores] = useState<PlaylistScore[]>([]);

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

  // Move ranking logic to a useEffect
  useEffect(() => {
    const rankPlaylists = async () => {
      if (!playbackData.track || !filteredPlaylists.length || rankingError)
        return;

      setIsRanking(true);
      try {
        const rankingContext = {
          currentTrack: playbackData.track,
          genres: playbackData.genres,
        };

        const { playlists: ranked, genres: currentTrackGenres } =
          await currentRanker.rankPlaylists(filteredPlaylists, rankingContext);

        if (currentRanker instanceof GenreMatchRanker) {
          const scores = ranked.map((playlist) => ({
            playlistId: playlist.id,
            score: currentRanker.calculateGenreMatchScore(
              playlist,
              currentTrackGenres
            ),
          }));
          setPlaylistScores(scores);
        }

        setRankedPlaylists((prevRanked) => {
          const hasChanged =
            JSON.stringify(prevRanked) !== JSON.stringify(ranked);
          return hasChanged ? ranked : prevRanked;
        });
        setRankingError(false);
      } catch (error) {
        console.error("Error ranking playlists:", error);
        setRankedPlaylists(filteredPlaylists);
        setRankingError(true);
      } finally {
        setIsRanking(false);
      }
    };

    rankPlaylists();
  }, [playbackData.track?.id, filteredPlaylists.length, currentRanker]);

  if (filteredPlaylists.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-0 h-full">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-6">
            {isRanking ? (
              <div className="flex items-center justify-center p-4 gap-2">
                <LoadingDots />
              </div>
            ) : rankingError ? (
              <div className="space-y-2">
                {filteredPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlistId={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    variant="ready"
                    isLoading={addingToPlaylist === playlist.id}
                  />
                ))}
              </div>
            ) : (
              <>
                {/* First playlist highlighted */}
                {rankedPlaylists[0] && (
                  <div className="bg-muted/50 rounded-lg p-6 hover:bg-muted/70 transition-colors">
                    <PlaylistCard
                      key={rankedPlaylists[0].id}
                      playlistId={rankedPlaylists[0].id}
                      onClick={() => handleAddToPlaylist(rankedPlaylists[0].id)}
                      variant="focus"
                      score={
                        playlistScores.find(
                          (s) => s.playlistId === rankedPlaylists[0].id
                        )?.score
                      }
                      isLoading={addingToPlaylist === rankedPlaylists[0].id}
                    />
                  </div>
                )}

                {/* Separator between first and rest */}
                {rankedPlaylists.length > 1 && <Separator className="my-4" />}

                {/* Rest of the playlists */}
                <div className="space-y-2">
                  {rankedPlaylists.slice(1).map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlistId={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      variant="ready"
                      score={
                        playlistScores.find((s) => s.playlistId === playlist.id)
                          ?.score
                      }
                      isLoading={addingToPlaylist === playlist.id}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
