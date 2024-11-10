import { playbackState } from "@/atoms/playbackAtom";
import SPOTIFY_API, { pause, play } from "@/utils/spotify";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

export function usePlayback() {
  const [playback, setPlayback] = useRecoilState(playbackState);

  const updatePlaybackState = useCallback(async () => {
    try {
      const state = await SPOTIFY_API.getMyCurrentPlaybackState();

      if (state.body) {
        setPlayback({
          isPlaying: state.body.is_playing,
          track: state.body.item as SpotifyApi.TrackObjectFull,
          position: state.body.progress_ms || 0,
          duration: state.body.item?.duration_ms || 0,
        });
      }
    } catch (error) {
      console.error("Playback state error:", error);
    }
  }, [setPlayback]);

  const togglePlayback = useCallback(async () => {
    try {
      if (playback.isPlaying) {
        await pause();
      } else {
        if (!playback.track) {
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
  }, [playback.isPlaying, playback.track, updatePlaybackState]);

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
        if (state.body?.item?.id !== playback.track?.id) {
          updatePlaybackState();
        }
      } catch (error) {
        console.error("Track change check error:", error);
      }
    }, 2000);

    return () => clearInterval(checkForTrackChange);
  }, [playback.track?.id, updatePlaybackState]);

  return {
    ...playback,
    togglePlayback,
    seek,
    skipToNext,
    skipToPrevious,
  };
}
