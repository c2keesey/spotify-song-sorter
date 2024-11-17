import type { PlaylistWithTracks } from "@/atoms/playlistAtom";
import type { PlaylistRanker, RankingContext } from "../types";

export class GenreMatchRanker implements PlaylistRanker {
  name = "Genre Match";
  description =
    "Ranks playlists based on genre similarity with the current track";

  async rankPlaylists(
    playlists: PlaylistWithTracks[],
    context: RankingContext
  ): Promise<{ playlists: PlaylistWithTracks[]; genres: string[] }> {
    if (!context.currentTrack) {
      console.log("No current track, returning unsorted playlists");
      return { playlists, genres: [] };
    }

    const currentTrackGenres = context.genres || [];

    const sortedPlaylists = [...playlists].sort((a, b) => {
      const aScore = this.calculateGenreMatchScore(a, currentTrackGenres);
      const bScore = this.calculateGenreMatchScore(b, currentTrackGenres);
      return bScore - aScore;
    });

    return { playlists: sortedPlaylists, genres: currentTrackGenres };
  }

  calculateGenreMatchScore(
    playlist: PlaylistWithTracks,
    currentTrackGenres: string[]
  ): number {
    if (!playlist.genres || currentTrackGenres.length === 0) {
      return 0;
    }

    const totalTracks = playlist.all_tracks.length;
    const trackGenreTerms = new Set(
      currentTrackGenres.flatMap((genre) => genre.toLowerCase().split(/[\s-]+/))
    );

    // Calculate score based on matching genres
    const matchingGenreScore = playlist.genres.reduce(
      (score, playlistGenre) => {
        const playlistGenreTerms = playlistGenre.name
          .toLowerCase()
          .split(/[\s-]+/);

        console.log("Playlist genre terms:", playlistGenreTerms);
        // Calculate how many terms match
        const matchingTerms = playlistGenreTerms.filter((term) =>
          trackGenreTerms.has(term)
        ).length;

        if (matchingTerms > 0) {
          // Weight the score by:
          // 1. How many terms match (partial matches get lower scores)
          // 2. How prevalent this genre is in the playlist
          const matchQuality = matchingTerms / playlistGenreTerms.length;
          return (
            score + ((matchQuality * playlistGenre.count) / totalTracks) * 100
          );
        }
        return score;
      },
      0
    );

    // Return a score between 0-100
    return Math.min(matchingGenreScore, 100);
  }
}
