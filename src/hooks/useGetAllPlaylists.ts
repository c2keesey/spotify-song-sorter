import { playlistsState, Track } from "@/atoms/playlistAtom";
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
            const trackData = await getPlaylistTracks(playlist.id);
            const tracks = trackData
              .map((item) => {
                const track = item.track;
                if (!track) return null;

                return {
                  id: track.id,
                  name: track.name,
                  album: {
                    name: track.album.name,
                  },
                  artists: track.artists.map((artist) => ({
                    name: artist.name,
                  })),
                  genres: track.genres || [],
                } as Track;
              })
              .filter((track): track is Track => track !== null);

            // Convert genres tracking from Map to sorted array with counts
            const genresMap = new Map<string, number>();
            tracks.forEach((track) => {
              if (track.genres) {
                track.genres.forEach((genre) => {
                  genresMap.set(genre, (genresMap.get(genre) || 0) + 1);
                });
              }
            });

            // Convert Map to array of objects and sort by count
            const genresList = Array.from(genresMap.entries()).map(
              ([name, count]) => ({
                name,
                count,
              })
            );

            return {
              id: playlist.id,
              name: playlist.name,
              images: playlist.images,
              imageUrl: playlist.images?.[0]?.url,
              description: playlist.description || undefined,
              owner: {
                id: playlist.owner.id,
                displayName: playlist.owner.display_name || "",
              },
              num_tracks: playlist.tracks.total,
              all_tracks: tracks,
              genres: genresList,
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
