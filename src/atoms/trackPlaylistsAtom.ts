import { selector } from "recoil";
import { playbackState } from "./playbackAtom";
import { playlistsState } from "./playlistAtom";

export const trackPlaylistsSelector = selector({
  key: "trackPlaylistsSelector",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    const currentTrack = get(playbackState).track;

    if (!currentTrack) return [];

    return playlists.filter((playlist) =>
      playlist.all_tracks.includes(currentTrack.id)
    );
  },
});

export const otherPlaylistsSelector = selector({
  key: "otherPlaylistsSelector",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    const currentTrack = get(playbackState).track;

    if (!currentTrack) return [];

    return playlists.filter(
      (playlist) => !playlist.all_tracks.includes(currentTrack.id)
    );
  },
});
