import type { PlaybackState } from "@/atoms/playbackAtom";
import type { PlaylistWithTracks } from "@/atoms/playlistAtom";

export interface RankingContext {
  currentTrack: PlaybackState["track"];
}

export interface PlaylistRanker {
  name: string;
  description: string;
  rankPlaylists(
    playlists: PlaylistWithTracks[],
    context: RankingContext
  ): Promise<{ playlists: PlaylistWithTracks[]; genres: string[] }>;
}
