import { Card } from "@/components/ui/card";
import { Song } from "@/types/spotify";

interface SongInfoProps {
  song?: Song;
}

export function SongInfo({ song }: SongInfoProps) {
  const demoSong: Song = {
    title: "Song Title",
    artist: "Artist Name",
    album: "Album Name",
    albumArt: "https://picsum.photos/200",
    bpm: 120,
    genre: "Pop",
  };

  const currentSong = song || demoSong;

  return (
    <Card className="p-4 w-full max-w-2xl mx-auto">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={currentSong.albumArt}
            alt={`${currentSong.album} cover`}
            className="w-24 h-24 rounded-md object-cover"
          />
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <h2 className="text-2xl font-bold">{currentSong.title}</h2>
          <p className="text-gray-500">{currentSong.artist}</p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <span>{currentSong.album}</span>
            <span>{currentSong.bpm} BPM</span>
            <span>{currentSong.genre}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
