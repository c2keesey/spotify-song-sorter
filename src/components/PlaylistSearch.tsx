import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlaylistItem } from "@/types/spotify";
import { useState } from "react";

interface PlaylistSearchProps {
  playlists?: PlaylistItem[];
  onSelect?: (playlist: PlaylistItem) => void;
}

export function PlaylistSearch({
  playlists = [],
  onSelect,
}: PlaylistSearchProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (playlist: PlaylistItem) => {
    onSelect?.(playlist);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Input
          className="w-full max-w-sm mx-auto"
          placeholder="Search playlists..."
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="p-0">
        <Command>
          <CommandInput placeholder="Search playlists..." />
          <CommandList>
            <CommandEmpty>No playlists found.</CommandEmpty>
            <CommandGroup heading="Playlists">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <CommandItem
                    key={playlist.id}
                    onSelect={() => handleSelect(playlist)}
                  >
                    {playlist.name}
                  </CommandItem>
                ))
              ) : (
                <>
                  <CommandItem>Liked Songs</CommandItem>
                  <CommandItem>Discover Weekly</CommandItem>
                  <CommandItem>Release Radar</CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
