import { PlaylistItem } from "@/types/spotify";
import { atom } from "recoil";

export const currentPlaylistState = atom<PlaylistItem | null>({
  key: "currentPlaylistState",
  default: null,
});

export const playlistTracksState = atom<SpotifyApi.PlaylistTrackObject[]>({
  key: "playlistTracksState",
  default: [],
});
