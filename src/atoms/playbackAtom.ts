import { atom } from "recoil";

export interface PlaybackState {
  isPlaying: boolean;
  track: SpotifyApi.TrackObjectFull | null;
  position: number;
  duration: number;
  genres: string[];
}

export const playbackState = atom<PlaybackState>({
  key: "playbackState",
  default: {
    isPlaying: false,
    track: null,
    position: 0,
    duration: 0,
    genres: [],
  },
});

// New atom for removed playlists
export const removedPlaylistsState = atom<string[]>({
  key: "removedPlaylistsState",
  default: [],
});
