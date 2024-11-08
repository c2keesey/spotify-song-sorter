import SPOTIFY_API from "@/utils/spotify";
import { useCallback, useEffect, useState } from "react";

interface PlaybackState {
  isPlaying: boolean;
  track: SpotifyApi.TrackObjectFull | null;
  position: number;
  duration: number;
}

export function usePlayback() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    track: null,
    position: 0,
    duration: 0,
  });

  const togglePlayback = useCallback(async () => {
    try {
      if (playbackState.isPlaying) {
        await SPOTIFY_API.pause();
      } else {
        await SPOTIFY_API.play();
      }
    } catch (error) {
      console.error("Playback control error:", error);
    }
  }, [playbackState.isPlaying]);

  const seek = useCallback(async (position: number) => {
    try {
      await SPOTIFY_API.seek(position);
    } catch (error) {
      console.error("Seek error:", error);
    }
  }, []);

  const skipToNext = useCallback(async () => {
    try {
      await SPOTIFY_API.skipToNext();
    } catch (error) {
      console.error("Skip error:", error);
    }
  }, []);

  const skipToPrevious = useCallback(async () => {
    try {
      await SPOTIFY_API.skipToPrevious();
    } catch (error) {
      console.error("Skip error:", error);
    }
  }, []);

  // Poll playback state
  useEffect(() => {
    const pollPlayback = async () => {
      try {
        const state = await SPOTIFY_API.getMyCurrentPlaybackState();
        if (state.body) {
          setPlaybackState({
            isPlaying: state.body.is_playing,
            track: state.body.item as SpotifyApi.TrackObjectFull,
            position: state.body.progress_ms || 0,
            duration: state.body.item?.duration_ms || 0,
          });
        }
      } catch (error) {
        console.error("Playback state error:", error);
      }
    };

    const interval = setInterval(pollPlayback, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...playbackState,
    togglePlayback,
    seek,
    skipToNext,
    skipToPrevious,
  };
}
