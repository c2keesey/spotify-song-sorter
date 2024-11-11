import { atom, selector } from "recoil";

export interface Track {
  id: string;
  name: string;
  album: {
    name: string;
  };
  artists: {
    name: string;
  }[];
  genres?: string[]; // Note: Spotify's track endpoint doesn't provide genres directly
}

export interface PlaylistWithTracks {
  id: string;
  name: string;
  images: { url: string; height: number | null; width: number | null }[];
  imageUrl?: string;
  description?: string;
  owner: {
    id: string;
    displayName: string;
  };
  num_tracks: number;
  all_tracks: Track[];
  genres: { name: string; count: number }[];
}

export const playlistsState = atom<PlaylistWithTracks[]>({
  key: "playlistsState",
  default: [],
});

export const currentPlaylistIdState = atom<string | null>({
  key: "currentPlaylistIdState",
  default: null,
});

export const currentPlaylistState = selector<PlaylistWithTracks | undefined>({
  key: "currentPlaylistState",
  get: ({ get }) => {
    const playlists = get(playlistsState);
    const currentId = get(currentPlaylistIdState);

    return playlists.find((playlist) => playlist.id === currentId);
  },
});
