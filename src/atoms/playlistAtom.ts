import { PlaylistItem } from "@/types/spotify";
import { atom } from "recoil";

export const currentPlaylistState = atom<PlaylistItem | null>({
  key: "currentPlaylistState",
  default: null,
});
