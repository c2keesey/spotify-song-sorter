import { SPOTIFY_API } from "./config";
import { enqueueRequest } from "./rateLimiter";

export const getCurrentUser = async () => {
  try {
    const response = await enqueueRequest(() => SPOTIFY_API.getMe());
    return response.body;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

export const getUserPlaylists = async () => {
  try {
    let allPlaylists = [];
    let response = await enqueueRequest(() =>
      SPOTIFY_API.getUserPlaylists({ limit: 50 })
    );
    allPlaylists = [...response.body.items];

    while (response.body.next) {
      response = await enqueueRequest(() =>
        SPOTIFY_API.getUserPlaylists({
          limit: 50,
          offset: allPlaylists.length,
        })
      );
      allPlaylists = [...allPlaylists, ...response.body.items];
    }

    return allPlaylists;
  } catch (error) {
    console.error("Get playlists error:", error);
    throw error;
  }
};

export const getArtistDetails = async (artistId: string) => {
  try {
    const response = await SPOTIFY_API.getArtist(artistId);
    return response.body;
  } catch (error) {
    console.error("Get artist details error:", error);
    throw error;
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const response = await SPOTIFY_API.getPlaylistTracks(playlistId);
    const tracks = response.body.items;

    const artistIds = new Set(
      tracks.flatMap(
        (item) => item.track?.artists.map((artist) => artist.id) ?? []
      )
    );

    const artistGenres = new Map();
    const batchSize = 50;
    const artistIdArray = Array.from(artistIds);

    for (let i = 0; i < artistIdArray.length; i += batchSize) {
      const batch = artistIdArray.slice(i, i + batchSize);
      const artistsResponse = await SPOTIFY_API.getArtists(batch);

      artistsResponse.body.artists.forEach((artist) => {
        artistGenres.set(artist.id, artist.genres);
      });
    }

    const tracksWithGenres = tracks.map((item) => {
      if (!item.track) return item;

      const genres = new Set(
        item.track.artists
          .map((artist) => artistGenres.get(artist.id) ?? [])
          .flat()
      );

      return {
        ...item,
        track: {
          ...item.track,
          genres: Array.from(genres),
        },
      };
    });

    return tracksWithGenres;
  } catch (error) {
    console.error("Get playlist tracks error:", error);
    throw error;
  }
};

export const addTracksToPlaylist = async (
  playlistId: string,
  uris: string[]
) => {
  try {
    const response = await enqueueRequest(() =>
      SPOTIFY_API.addTracksToPlaylist(playlistId, uris)
    );
    return response.body;
  } catch (error) {
    console.error("Add tracks to playlist error:", error);
    throw error;
  }
};

export const removeTracksFromPlaylist = async (
  playlistId: string,
  uris: string[]
) => {
  try {
    const response = await enqueueRequest(() =>
      SPOTIFY_API.removeTracksFromPlaylist(
        playlistId,
        uris.map((uri) => ({ uri }))
      )
    );
    return response.body;
  } catch (error) {
    console.error("Remove tracks from playlist error:", error);
    throw error;
  }
};
