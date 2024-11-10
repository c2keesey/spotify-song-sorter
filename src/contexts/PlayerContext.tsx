import { createContext, useContext } from "react";

interface PlayerContextType {
  isReady: boolean;
  deviceId: string | null;
}

export const PlayerContext = createContext<PlayerContextType>({
  isReady: false,
  deviceId: null,
});

export const usePlayer = () => useContext(PlayerContext);
