import { useEffect, useState } from "react";
import { PlayerContext } from "@/contexts/PlayerContext";

export function WebPlayback({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotify Song Sorter",
        getOAuthToken: (cb: (token: string) => void) => {
          const token = localStorage.getItem("spotify_access_token");
          cb(token || "");
        },
        volume: 0.5,
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });

      player.addListener("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        localStorage.setItem("spotify_device_id", device_id);
        setDeviceId(device_id);
        setIsReady(true);

        // Set this device as the active device
        const accessToken = localStorage.getItem("spotify_access_token");
        if (!accessToken) return;

        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        }).catch(console.error);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        localStorage.removeItem("spotify_device_id");
      });

      // Connect to the player
      player.connect().then((success) => {
        if (success) {
          console.log("Successfully connected to Spotify!");
        }
      });

      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
        localStorage.removeItem("spotify_device_id");
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <PlayerContext.Provider value={{ isReady, deviceId }}>
      {children}
    </PlayerContext.Provider>
  );
}
