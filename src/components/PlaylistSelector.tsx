import {
  currentPlaylistState,
  playlistTracksState,
} from "@/atoms/playlistAtom";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlaylistItem } from "@/types/spotify";
import SPOTIFY_API, {
  getPlaylistTracks,
  getUserPlaylists,
  waitForSpotifyDevice,
} from "@/utils/spotify";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export function PlaylistSelector() {
  const [open, setOpen] = useState(true);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setCurrentPlaylist = useSetRecoilState(currentPlaylistState);
  const setPlaylistTracks = useSetRecoilState(playlistTracksState);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const spotifyPlaylists = await getUserPlaylists();

        console.log("Raw response:", spotifyPlaylists);

        if (!spotifyPlaylists || !Array.isArray(spotifyPlaylists)) {
          throw new Error("Invalid playlist data received");
        }

        const formattedPlaylists: PlaylistItem[] = spotifyPlaylists.map(
          (playlist) => ({
            id: playlist.id,
            name: playlist.name,
            imageUrl: playlist.images?.[0]?.url,
            description: playlist.description || undefined,
            owner: {
              id: playlist.owner.id,
              displayName: playlist.owner.display_name || "",
            },
            tracks: {
              total: playlist.tracks.total,
            },
          })
        );

        console.log("Formatted playlists:", formattedPlaylists);
        setPlaylists(formattedPlaylists);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load playlists"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSelectPlaylist = async (playlist: PlaylistItem) => {
    try {
      const tracks = await getPlaylistTracks(playlist.id);
      setPlaylistTracks(tracks);
      setCurrentPlaylist(playlist);

      // Wait for device to be ready
      if (tracks.length > 0 && tracks[0].track) {
        const deviceId = await waitForSpotifyDevice();
        await SPOTIFY_API.play({
          device_id: deviceId,
          context_uri: `spotify:playlist:${playlist.id}`,
          offset: { position: 0 },
        });
      }
    } catch (error) {
      console.error("Error loading playlist tracks:", error);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to start sorting your songs
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="text-center p-4 text-red-500">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : (
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Search playlists..." />
            <CommandList>
              <CommandEmpty>No playlists found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading playlists...
                  </div>
                ) : (
                  playlists.map((playlist) => (
                    <CommandItem
                      key={playlist.id}
                      onSelect={() => handleSelectPlaylist(playlist)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{playlist.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {playlist.tracks?.total} tracks
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        )}

        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="mt-2"
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
