import { Buffer } from "buffer";
// Add this line at the very top of the file, before other imports
globalThis.Buffer = Buffer;

import { SPOTIFY_API } from "./config";

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
    "streaming",
  ];

  const authUrl = SPOTIFY_API.createAuthorizeURL(scopes, state);
  return authUrl;
};

export const handleAuthCallback = async (
  code: string,
  state: string | null
) => {
  const storedState = localStorage.getItem("spotify_auth_state");

  if (!state || !storedState || state !== storedState) {
    console.error("State mismatch:", { received: state, stored: storedState });
    throw new Error("State mismatch");
  }

  localStorage.removeItem("spotify_auth_state");

  try {
    const data = await SPOTIFY_API.authorizationCodeGrant(code);
    SPOTIFY_API.setAccessToken(data.body.access_token);
    SPOTIFY_API.setRefreshToken(data.body.refresh_token);

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
