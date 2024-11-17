import { playlistsState } from "@/atoms/playlistAtom";
import { SPOTIFY_API } from "@/spotify_utils";
import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export function useAddTrackToPlaylist() {
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
      await SPOTIFY_API.addTracksToPlaylist(playlistId, [
        `spotify:track:${trackId}`,
      ]);

      // Find the track details from any playlist that has it
      const trackDetails = playlists
        .flatMap((p) => p.all_tracks)
        .find((t) => t.id === trackId);

      if (!trackDetails) {
        console.error("Could not find track details");
        return;
      }

      // Update the playlists state
      setPlaylists(
        playlists.map((playlist) => {
          if (playlist.id === playlistId) {
            // Check if track is already in playlist to avoid duplicates
            if (playlist.all_tracks.some((t) => t.id === trackId)) {
              return playlist;
            }
            return {
              ...playlist,
              all_tracks: [...playlist.all_tracks, trackDetails],
              num_tracks: playlist.num_tracks + 1,
            };
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Failed to add track to playlist:", error);
      throw error;
    }
  };

  return addTrackToPlaylist;
}

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
