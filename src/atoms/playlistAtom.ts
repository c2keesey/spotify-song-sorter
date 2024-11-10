import { PlaylistItem } from "@/types/spotify";
import { atom } from "recoil";

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
