import { useGetAllPlaylists } from "@/hooks/useGetAllPlaylists";
import {
  getAuthUrl,
  getCurrentUser,
  handleAuthCallback,
  refreshAccessToken,
} from "@/utils/spotify";
import { useEffect, useState } from "react";
import { SpotifyContext } from "./SpotifyContext";

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if we're handling a callback
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const error = params.get("error");

        if (error) {
          console.error("Authentication error:", error);
          setIsLoading(false);
          return;
        }

        if (code && state) {
          try {
            await handleAuthCallback(code, state);
            const userData = await getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
            // Clean up URL
            window.history.replaceState({}, "", "/");
          } catch (error) {
            console.error("Authentication error:", error);
          }
          setIsLoading(false);
          return;
        }

        // If not handling callback, check for existing token
        const accessToken = localStorage.getItem("spotify_access_token");
        const tokenExpiry = localStorage.getItem("spotify_token_expiry");

        if (accessToken && tokenExpiry) {
          // Check if token is expired
          if (Number(tokenExpiry) <= Date.now()) {
            await refreshAccessToken();
          }

          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear potentially invalid tokens
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_token_expiry");
        localStorage.removeItem("spotify_auth_state");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up token refresh
  useEffect(() => {
    if (isAuthenticated) {
      const refreshToken = setInterval(async () => {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Token refresh error:", error);
          setIsAuthenticated(false);
          setUser(null);
        }
      }, 3000000); // Refresh every 50 minutes

      return () => clearInterval(refreshToken);
    }
  }, [isAuthenticated]);

  const login = () => {
    // Clear any existing auth state before starting new auth flow
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiry");
    localStorage.removeItem("spotify_auth_state");

    window.location.href = getAuthUrl();
  };

  const logout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiry");
    localStorage.removeItem("spotify_auth_state");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SpotifyContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </SpotifyContext.Provider>
  );
}
