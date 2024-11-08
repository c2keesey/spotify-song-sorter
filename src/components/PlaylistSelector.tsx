import { currentPlaylistState } from "@/atoms/playlistAtom";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlaylistItem } from "@/types/spotify";
import { getUserPlaylists } from "@/utils/spotify";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export function PlaylistSelector() {
  const [open, setOpen] = useState(true);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setCurrentPlaylist = useSetRecoilState(currentPlaylistState);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const spotifyPlaylists = await getUserPlaylists();

        console.log("Raw response:", spotifyPlaylists);

        if (!spotifyPlaylists) {
          throw new Error("No playlists found");
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

  const handleSelectPlaylist = (playlist: PlaylistItem) => {
    setCurrentPlaylist(playlist);
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
            <CommandEmpty>No playlists found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading playlists...
                </div>
              ) : (
                playlists.map((playlist) => (
                  <CommandItem
                    key={playlist.id}
                    onSelect={() => handleSelectPlaylist(playlist)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    {playlist.imageUrl && (
                      <img
                        src={playlist.imageUrl}
                        alt={playlist.name}
                        className="w-10 h-10 rounded"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{playlist.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {playlist.tracks?.total} tracks
                      </span>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
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
