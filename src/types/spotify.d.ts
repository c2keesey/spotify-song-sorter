declare global {
  interface Window {
    Spotify: {
      Player: new (config: SpotifyPlayerConfig) => Spotify.Player;
    };
  }
}

declare namespace Spotify {
  interface PlaybackState {
    context: {
      uri: string;
      metadata: any;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    duration: number;
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
      current_track: WebPlaybackTrack;
      next_tracks: WebPlaybackTrack[];
      previous_tracks: WebPlaybackTrack[];
    };
  }

  interface WebPlaybackTrack {
    uri: string;
    id: string;
    type: string;
    media_type: string;
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: { url: string }[];
    };
    artists: {
      uri: string;
      name: string;
    }[];
  }

  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    getCurrentState(): Promise<Spotify.PlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    addListener(
      event: "ready" | "not_ready",
      callback: (state: { device_id: string }) => void
    ): void;
    addListener(
      event: "player_state_changed",
      callback: (state: Spotify.PlaybackState) => void
    ): void;
    addListener(
      event:
        | "initialization_error"
        | "authentication_error"
        | "account_error"
        | "playback_error",
      callback: (state: { message: string }) => void
    ): void;
    removeListener(event: string, callback?: Function): void;
  }

  interface SpotifyPlayerConfig {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }
}

export {};
