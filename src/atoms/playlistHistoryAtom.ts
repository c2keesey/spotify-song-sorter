import { atom } from "recoil";

export interface PlaylistAction {
  type: "add" | "remove" | "hidePlaylist";
  trackId?: string;
  playlistId: string;
  timestamp: number;
}

export const playlistHistoryState = atom<PlaylistAction[]>({
  key: "playlistHistoryState",
  default: [],
});
