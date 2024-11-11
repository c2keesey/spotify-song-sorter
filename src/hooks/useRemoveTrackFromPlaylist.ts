import { playlistsState } from "@/atoms/playlistAtom";
import { SPOTIFY_API } from "@/spotify_utils/config";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";

export function useRemoveTrackFromPlaylist() {
  const setPlaylists = useSetRecoilState(playlistsState);

  const removeTrackFromPlaylist = useCallback(
    async (playlistId: string, trackId: string) => {
      try {
        // Ensure the trackId is valid before making the API call
        if (!trackId || typeof trackId !== "string") {
          throw new Error("Invalid track ID");
        }

        await SPOTIFY_API.removeTracksFromPlaylist(playlistId, [
          { uri: `spotify:track:${trackId}` },
        ]);

        // Update local state
        setPlaylists((currentPlaylists) =>
          currentPlaylists.map((playlist) => {
            if (playlist.id === playlistId) {
              return {
                ...playlist,
                num_tracks: playlist.num_tracks - 1,
                all_tracks: playlist.all_tracks.filter((id) => id !== trackId),
              };
            }
            return playlist;
          })
        );
      } catch (error) {
        console.error("Failed to remove track from playlist:", error);
        throw error;
      }
    },
    [setPlaylists]
  );

  return removeTrackFromPlaylist;
}
