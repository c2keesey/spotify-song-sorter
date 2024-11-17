import { keyBindingsState } from "@/atoms/keyBindingsAtom";
import { playbackState } from "@/atoms/playbackAtom";
import { currentPlaylistState } from "@/atoms/playlistAtom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayback } from "@/hooks/usePlayback";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PauseIcon,
  PlayIcon,
  TrackNextIcon,
  TrackPreviousIcon,
} from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { GenreTag } from "@/components/custom/GenreTag";

export function Player() {
  const currentPlaylist = useRecoilValue(currentPlaylistState);
  const playback = useRecoilValue(playbackState);
  const keyBindings = useRecoilValue(keyBindingsState);
  const { togglePlayback, seek, skipToNext, skipToPrevious } = usePlayback();

  const { isPlaying, track, position, duration } = playback;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      const binding = keyBindings.find(
        (kb) =>
          kb.code === event.code &&
          (!kb.requiresShift || (kb.requiresShift && event.shiftKey))
      );

      if (!binding) return;

      event.preventDefault();

      switch (binding.action) {
        case "togglePlayback":
          togglePlayback();
          break;
        case "seekBackward":
          seek(position - 5000);
          break;
        case "seekForward":
          seek(position + 5000);
          break;
        case "seekBackward30":
          seek(position - 30000);
          break;
        case "seekForward30":
          seek(position + 30000);
          break;
        case "nextTrack":
          console.log("nextTrack");
          skipToNext();
          break;
        case "previousTrack":
          skipToPrevious();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyBindings, togglePlayback, seek, skipToNext, skipToPrevious, position]);

  if (!currentPlaylist) {
    return null;
  }

  const handleSeek = (seconds: number) => {
    const newPosition = position + seconds * 1000;
    seek(Math.max(0, Math.min(newPosition, duration)));
  };

  return (
    <div className="space-y-4 flex-shrink-0">
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
            {currentPlaylist.num_tracks > 0 && (
              <span>
                Track{" "}
                {currentPlaylist.all_tracks.findIndex(
                  (t) => t.id === track?.id
                ) + 1}{" "}
                of {currentPlaylist.num_tracks}
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
            onClick={() => handleSeek(-30)}
            aria-label="Rewind 30 seconds"
            title="Rewind 30 seconds"
          >
            <div className="relative">
              <DoubleArrowLeftIcon className="h-4 w-4" />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px]">
                30
              </span>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSeek(-5)}
            aria-label="Rewind 5 seconds"
            title="Rewind 5 seconds"
          >
            <div className="relative">
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px]">
                5
              </span>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={skipToPrevious}
            aria-label="Previous track"
          >
            <TrackPreviousIcon className="h-4 w-4" />
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
            <TrackNextIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSeek(5)}
            aria-label="Forward 5 seconds"
            title="Forward 5 seconds"
          >
            <div className="relative">
              <ChevronRightIcon className="h-4 w-4" />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px]">
                5
              </span>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSeek(30)}
            aria-label="Forward 30 seconds"
            title="Forward 30 seconds"
          >
            <div className="relative">
              <DoubleArrowRightIcon className="h-4 w-4" />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px]">
                30
              </span>
            </div>
          </Button>
        </div>

        {playback.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {playback.genres.map((genre) => (
              <GenreTag key={genre} name={genre} count={1} maxCount={1} />
            ))}
          </div>
        )}
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
