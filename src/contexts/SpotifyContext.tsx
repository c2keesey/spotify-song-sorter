import { createContext } from "react";

interface SpotifyContextType {
  isAuthenticated: boolean;
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  login: () => void;
  logout: () => void;
}

export const SpotifyContext = createContext<SpotifyContextType | undefined>(
  undefined
);
