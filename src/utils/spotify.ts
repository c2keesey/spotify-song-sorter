import SpotifyWebApi from "spotify-web-api-node";
// @ts-expect-error it's actually there
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";

(
  SpotifyWebApi as unknown as { _addMethods: (fncs: unknown) => void }
)._addMethods(SpotifyWebApiServer);

const SPOTIFY_API = new SpotifyWebApi({
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
});

// Generate a random string for state
const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
};

export const getAuthUrl = () => {
  const state = generateRandomString(16);
  // Store state in localStorage to verify later
  localStorage.setItem("spotify_auth_state", state);

  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-library-modify",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  const authUrl = SPOTIFY_API.createAuthorizeURL(scopes, state);
  console.log("Generated auth URL with state:", state); // Debug log
  return authUrl;
};

export const handleAuthCallback = async (
  code: string,
  state: string | null
) => {
  // Verify state
  const storedState = localStorage.getItem("spotify_auth_state");
  console.log("Comparing states:", { received: state, stored: storedState }); // Debug log

  if (!state || !storedState || state !== storedState) {
    console.error("State mismatch:", { received: state, stored: storedState }); // Debug log
    throw new Error("State mismatch");
  }

  // Clear state from localStorage
  localStorage.removeItem("spotify_auth_state");

  try {
    const data = await SPOTIFY_API.authorizationCodeGrant(code);
    SPOTIFY_API.setAccessToken(data.body.access_token);
    SPOTIFY_API.setRefreshToken(data.body.refresh_token);

    // Store tokens in localStorage
    localStorage.setItem("spotify_access_token", data.body.access_token);
    localStorage.setItem("spotify_refresh_token", data.body.refresh_token);
    localStorage.setItem(
      "spotify_token_expiry",
      String(Date.now() + data.body.expires_in * 1000)
    );

    return data.body;
  } catch (error) {
    console.error("Auth callback error:", error);
    throw error;
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  SPOTIFY_API.setRefreshToken(refreshToken);

  try {
    const data = await SPOTIFY_API.refreshAccessToken();
    SPOTIFY_API.setAccessToken(data.body.access_token);

    // Update stored access token
    localStorage.setItem("spotify_access_token", data.body.access_token);
    localStorage.setItem(
      "spotify_token_expiry",
      String(Date.now() + data.body.expires_in * 1000)
    );

    return data.body;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

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

// Initialize token from localStorage if available
const storedToken = localStorage.getItem("spotify_access_token");
if (storedToken) {
  SPOTIFY_API.setAccessToken(storedToken);
}

export default SPOTIFY_API;
