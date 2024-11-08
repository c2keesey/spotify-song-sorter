export interface Song {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  bpm: number;
  genre: string;
}

export interface PlaylistItem {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  owner?: {
    id: string;
    displayName: string;
  };
  tracks?: {
    total: number;
    items?: SpotifyApi.PlaylistTrackObject[];
  };
}
