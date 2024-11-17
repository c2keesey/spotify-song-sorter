import {
  currentPlaylistIdState,
  playlistsState,
  PlaylistWithTracks,
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

import { LoadingDots } from "@/components/ui/loading-dots";
import { useGetAllPlaylists } from "@/hooks/useGetAllPlaylists";
import { SPOTIFY_API, waitForSpotifyDevice } from "@/spotify_utils";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface PlaylistSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlaylistSelector({
  open,
  onOpenChange,
}: PlaylistSelectorProps) {
  const playlists = useRecoilValue(playlistsState);
  const setCurrentPlaylistId = useSetRecoilState(currentPlaylistIdState);
  const { isLoading, error } = useGetAllPlaylists();

  const handleSelectPlaylist = async (playlist: PlaylistWithTracks) => {
    try {
      setCurrentPlaylistId(playlist.id);
      // Handle Spotify playback
      if (playlist.num_tracks > 0) {
        const deviceId = await waitForSpotifyDevice();
        await SPOTIFY_API.play({
          device_id: deviceId,
          context_uri: `spotify:playlist:${playlist.id}`,
          offset: { position: 0 },
        });
      }
    } catch (error) {
      console.error("Error starting playlist playback:", error);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <div className="flex items-center justify-center p-6">
                    <LoadingDots />
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
                            {playlist.num_tracks} tracks
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
          onClick={() => onOpenChange(false)}
          className="mt-2"
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
