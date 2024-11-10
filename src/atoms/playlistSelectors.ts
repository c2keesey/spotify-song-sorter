import { selector } from "recoil";
import { currentPlaylistIdState, playlistsState } from "./playlistAtom";

export const currentPlaylistSelector = selector({
  key: "currentPlaylistSelector",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    const currentId = get(currentPlaylistIdState);

    if (!currentId) return null;
    return playlists.find((playlist) => playlist.id === currentId) || null;
  },
});
