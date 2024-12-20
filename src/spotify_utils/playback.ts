import { SPOTIFY_API } from "./config";
import { enqueueRequest } from "./rateLimiter";

export const play = async (options?: {
  context_uri?: string;
  offset?: { position: number };
}) => {
  const device_id = localStorage.getItem("spotify_device_id");
  const accessToken = localStorage.getItem("spotify_access_token");

  if (!device_id) {
    console.error("No device ID found - waiting for device to be ready");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const retriedDeviceId = localStorage.getItem("spotify_device_id");
    if (!retriedDeviceId) {
      throw new Error("No device ID found - please refresh the page");
    }
  }

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const url = `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`;

  try {
    await enqueueRequest(() =>
      fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: options ? JSON.stringify(options) : undefined,
      })
    );
  } catch (error) {
    console.error("Playback error:", error);
    throw error;
  }
};

export const pause = async () => {
  try {
    await enqueueRequest(() => SPOTIFY_API.pause());
  } catch (error) {
    console.error("Pause error:", error);
    throw error;
  }
};

export const seek = async (position_ms: number) => {
  try {
    await enqueueRequest(() => SPOTIFY_API.seek(position_ms));
  } catch (error) {
    console.error("Seek error:", error);
    throw error;
  }
};

export const waitForSpotifyDevice = async (
  maxAttempts = 10,
  interval = 1000
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkDevice = async () => {
      const deviceId = localStorage.getItem("spotify_device_id");

      if (deviceId) {
        resolve(deviceId);
      } else if (attempts >= maxAttempts) {
        reject(new Error("No Spotify device found after maximum attempts"));
      } else {
        attempts++;
        setTimeout(checkDevice, interval);
      }
    };

    checkDevice();
  });
};
