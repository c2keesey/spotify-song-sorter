import { useContext } from "react";
import { SpotifyContext } from "@/contexts/SpotifyContext";

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
}
