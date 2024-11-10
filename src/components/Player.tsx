import {
  currentPlaylistState,
  playlistTracksState,
} from "@/atoms/playlistAtom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayback } from "@/hooks/usePlayback";
import {
  CaretLeftIcon,
  CaretRightIcon,
  PauseIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export function Player() {
  const currentPlaylist = useRecoilValue(currentPlaylistState);
  const playlistTracks = useRecoilValue(playlistTracksState);
  const {
    isPlaying,
    track,
    position,
    duration,
    togglePlayback,
    seek,
    skipToNext,
    skipToPrevious,
  } = usePlayback();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlayback();
          break;
        case "ArrowRight":
          event.preventDefault();
          seek(position + 5000); // Skip forward 5s
          break;
        case "ArrowLeft":
          event.preventDefault();
          seek(position - 5000); // Skip backward 5s
          break;
        case "KeyN":
          event.preventDefault();
          skipToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [togglePlayback, seek, skipToNext, position]);

  if (!currentPlaylist) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {track?.album.images[0] && (
            <img
              src={track.album.images[0].url}
              alt={track.album.name}
              className="w-16 h-16 rounded-md"
            />
          )}
          <div>
            <h3 className="font-semibold">
              {track?.name || "No track playing"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {track?.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {playlistTracks.length > 0 && (
            <span>
              Track{" "}
              {playlistTracks.findIndex((t) => t.track?.id === track?.id) + 1}{" "}
              of {playlistTracks.length}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Slider
          value={[position]}
          max={duration}
          step={1000}
          onValueChange={([value]) => seek(value)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={skipToPrevious}
          aria-label="Previous track"
        >
          <CaretLeftIcon className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={skipToNext}
          aria-label="Next track"
        >
          <CaretRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
