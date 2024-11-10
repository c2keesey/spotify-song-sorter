import SPOTIFY_API, { pause, play } from "@/utils/spotify";
import { useCallback, useEffect, useState } from "react";

interface PlaybackState {
  isPlaying: boolean;
  track: SpotifyApi.TrackObjectFull | null;
  position: number;
  duration: number;
}

export function usePlayback() {
  const [initialLoad, setInitialLoad] = useState(true);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    track: null,
    position: 0,
    duration: 0,
  });

  const updatePlaybackState = useCallback(async () => {
    try {
      const state = await SPOTIFY_API.getMyCurrentPlaybackState();

      if (state.body) {
        setPlaybackState({
          isPlaying: initialLoad ? false : state.body.is_playing,
          track: state.body.item as SpotifyApi.TrackObjectFull,
          position: state.body.progress_ms || 0,
          duration: state.body.item?.duration_ms || 0,
        });

        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    } catch (error) {
      console.error("Playback state error:", error);
    }
  }, [initialLoad]);

  const togglePlayback = useCallback(async () => {
    console.log("togglePlayback", playbackState.isPlaying);
    try {
      if (playbackState.isPlaying) {
        await pause();
      } else {
        if (!playbackState.track) {
          const currentPlaylistUri = localStorage.getItem(
            "spotify_current_playlist_uri"
          );
          if (currentPlaylistUri) {
            await play({
              context_uri: currentPlaylistUri,
              offset: { position: 0 },
            });
          } else {
            await play(); // fallback to resume if no playlist context
          }
        } else {
          await play(); // resume current track
        }
      }
      await updatePlaybackState();
    } catch (error) {
      console.error("Playback control error:", error);
    }
  }, [playbackState.isPlaying, playbackState.track, updatePlaybackState]);

  const seek = useCallback(
    async (position: number) => {
      try {
        await seek(position);
        await updatePlaybackState();
      } catch (error) {
        console.error("Seek error:", error);
      }
    },
    [updatePlaybackState]
  );

  const skipToNext = useCallback(async () => {
    try {
      await SPOTIFY_API.skipToNext();
      setTimeout(updatePlaybackState, 300);
    } catch (error) {
      console.error("Skip error:", error);
    }
  }, [updatePlaybackState]);

  const skipToPrevious = useCallback(async () => {
    try {
      await SPOTIFY_API.skipToPrevious();
      setTimeout(updatePlaybackState, 300);
    } catch (error) {
      console.error("Skip error:", error);
    }
  }, [updatePlaybackState]);

  // Poll playback state
  useEffect(() => {
    // Initial update
    updatePlaybackState();

    // Set up polling interval
    const interval = setInterval(updatePlaybackState, 1000);

    return () => clearInterval(interval);
  }, [updatePlaybackState]);

  // Listen for track changes via Spotify Connect
  useEffect(() => {
    const checkForTrackChange = setInterval(async () => {
      try {
        const state = await SPOTIFY_API.getMyCurrentPlaybackState();
        if (state.body?.item?.id !== playbackState.track?.id) {
          updatePlaybackState();
        }
      } catch (error) {
        console.error("Track change check error:", error);
      }
    }, 2000);

    return () => clearInterval(checkForTrackChange);
  }, [playbackState.track?.id, updatePlaybackState]);

  return {
    ...playbackState,
    togglePlayback,
    seek,
    skipToNext,
    skipToPrevious,
  };
}
