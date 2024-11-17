import { GenreMatchRanker } from "@/ranking/algorithms/GenreMatchRanker";
import type { PlaylistRanker } from "@/ranking/types";
import { atom } from "recoil";

// Register all ranking algorithms here
const ranker = new GenreMatchRanker();
export const availableRankers: PlaylistRanker[] = [
  ranker,
  // Add more rankers here
];

export const currentRankerState = atom<PlaylistRanker>({
  key: "currentRankerState",
  default: ranker,
});
