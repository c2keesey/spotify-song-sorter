import { PlaylistItem } from "@/types/spotify";
import { atom, selector } from "recoil";

export interface PlaylistWithTracks extends PlaylistItem {
  num_tracks: number;
  all_tracks: string[];
}

export const playlistsState = atom<PlaylistWithTracks[]>({
  key: "playlistsState",
  default: [],
});

export const currentPlaylistIdState = atom<string | null>({
  key: "currentPlaylistIdState",
  default: null,
});

export const currentPlaylistState = selector<PlaylistWithTracks | undefined>({
  key: "currentPlaylistState",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    const currentId = get(currentPlaylistIdState);

    return playlists.find((playlist) => playlist.id === currentId);
  },
});
