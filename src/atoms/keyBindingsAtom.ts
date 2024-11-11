import { atom } from "recoil";

export interface KeyBinding {
  action: string;
  key: string;
  code: string;
  requiresShift?: boolean;
  description: string;
}

// Make defaultKeyBindings exportable
export const defaultKeyBindings: KeyBinding[] = [
  {
    action: "togglePlayback",
    key: "Space",
    code: "Space",
    description: "Play/Pause",
  },
  {
    action: "seekBackward",
    key: "X",
    code: "KeyX",
    description: "Rewind 5 seconds",
  },
  {
    action: "seekForward",
    key: "S",
    code: "KeyS",
    description: "Forward 5 seconds",
  },
  {
    action: "seekBackward30",
    key: "C",
    code: "KeyC",
    description: "Rewind 30 seconds",
  },
  {
    action: "seekForward30",
    key: "D",
    code: "KeyD",
    description: "Forward 30 seconds",
  },
  {
    action: "nextTrack",
    key: "F",
    code: "KeyF",
    description: "Next track",
  },
  {
    action: "previousTrack",
    key: "V",
    code: "KeyV",
    description: "Previous track",
  },
  {
    action: "addToFirstPlaylist",
    key: "J",
    code: "KeyJ",
    description: "Add to first available playlist",
  },
  {
    action: "removeFirstPlaylist",
    key: "K",
    code: "KeyK",
    description: "Remove first playlist",
  },
  {
    action: "undoLastAction",
    key: "L",
    code: "KeyL",
    description: "Undo last playlist action",
  },
];

// Load saved keybindings from localStorage or use defaults
const getSavedKeyBindings = () => {
  const saved = localStorage.getItem("keyBindings");
  return saved ? JSON.parse(saved) : defaultKeyBindings;
};

export const keyBindingsState = atom<KeyBinding[]>({
  key: "keyBindingsState",
  default: getSavedKeyBindings(),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem("keyBindings", JSON.stringify(newValue));
      });
    },
  ],
});
