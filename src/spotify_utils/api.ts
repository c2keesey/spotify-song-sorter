import { SPOTIFY_API } from "./config";

export const getCurrentUser = async () => {
  try {
    const response = await SPOTIFY_API.getMe();
    return response.body;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

export const getUserPlaylists = async () => {
  try {
    const response = await SPOTIFY_API.getUserPlaylists();
    return response.body.items;
  } catch (error) {
    console.error("Get playlists error:", error);
    throw error;
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const response = await SPOTIFY_API.getPlaylistTracks(playlistId);
    return response.body.items;
  } catch (error) {
    console.error("Get playlist tracks error:", error);
    throw error;
  }
};
