import { atom } from "recoil";

interface PlaybackState {
  isPlaying: boolean;
  track: SpotifyApi.TrackObjectFull | null;
  position: number;
  duration: number;
}

export const playbackState = atom<PlaybackState>({
  key: "playbackState",
  default: {
    isPlaying: false,
    track: null,
    position: 0,
    duration: 0,
  },
});
