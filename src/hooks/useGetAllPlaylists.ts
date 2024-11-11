import { playlistsState } from "@/atoms/playlistAtom";
import { useSpotify } from "@/hooks/useSpotify";
import { getPlaylistTracks, getUserPlaylists } from "@/spotify_utils";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export function useGetAllPlaylists() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setAllPlaylists = useSetRecoilState(playlistsState);
  const { isAuthenticated, user } = useSpotify();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    const fetchAllPlaylists = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get all playlists
        const playlists = await getUserPlaylists();

        // Filter playlists to only include those created by the current user
        const userPlaylists = playlists.filter(
          (playlist) => playlist.owner.id === user.id
        );

        // Fetch tracks for each playlist
        const playlistsWithTracks = await Promise.all(
          userPlaylists.map(async (playlist) => {
            const tracks = await getPlaylistTracks(playlist.id);
            return {
              id: playlist.id,
              name: playlist.name,
              imageUrl: playlist.images?.[0]?.url,
              description: playlist.description || undefined,
              owner: {
                id: playlist.owner.id,
                displayName: playlist.owner.display_name || "",
              },
              num_tracks: playlist.tracks.total,
              all_tracks: tracks.map((track) => track.track?.id || ""),
            };
          })
        );

        setAllPlaylists(playlistsWithTracks);
        console.log("playlistsWithTracks", playlistsWithTracks);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load playlists"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPlaylists();
  }, [isAuthenticated, user, setAllPlaylists]);

  return { isLoading, error };
}
