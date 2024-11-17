import { playlistsState } from "@/atoms/playlistAtom";
import { SPOTIFY_API } from "@/spotify_utils";
import { useRecoilState } from "recoil";

export function useRemoveTrackFromPlaylist() {
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

  const removeTrackFromPlaylist = async (
    playlistId: string,
    trackId: string
  ) => {
    try {
      await SPOTIFY_API.removeTracksFromPlaylist(playlistId, [
        { uri: `spotify:track:${trackId}` },
      ]);

      // Update the playlists state
      setPlaylists(
        playlists.map((playlist) => {
          if (playlist.id === playlistId) {
            return {
              ...playlist,
              all_tracks: playlist.all_tracks.filter(
                (track) => track.id !== trackId
              ),
              num_tracks: Math.max(0, playlist.num_tracks - 1),
            };
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Failed to remove track from playlist:", error);
      throw error;
    }
  };

  return removeTrackFromPlaylist;
}
