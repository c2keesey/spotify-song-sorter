import SpotifyWebApi from "spotify-web-api-node";
// @ts-expect-error it's actually there
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";

(
  SpotifyWebApi as unknown as { _addMethods: (fncs: unknown) => void }
)._addMethods(SpotifyWebApiServer);

export const SPOTIFY_API = new SpotifyWebApi({
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
});

// Initialize token from localStorage if available
const storedToken = localStorage.getItem("spotify_access_token");
if (storedToken) {
  SPOTIFY_API.setAccessToken(storedToken);
}

export default SPOTIFY_API;
