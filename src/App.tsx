import { currentPlaylistState } from "@/atoms/playlistAtom";
import { Player } from "@/components/Player";
import { PlaylistSearch } from "@/components/PlaylistSearch";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { SongInfo } from "@/components/SongInfo";
import { Button } from "@/components/ui/button";
import { useSpotify } from "@/hooks/useSpotify";
import { useRecoilValue } from "recoil";

function App() {
  const { isAuthenticated, login, user } = useSpotify();
  const currentPlaylist = useRecoilValue(currentPlaylistState);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Spotify Song Sorter
        </h1>
        <Button onClick={login} size="lg">
          Login with Spotify
        </Button>
      </main>
    );
  }

  if (!currentPlaylist) {
    return <PlaylistSelector />;
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Spotify Song Sorter</h1>
        <p className="text-muted-foreground">Welcome, {user?.display_name}</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <SongInfo />
        <Player />
        <PlaylistSearch />
      </div>
    </main>
  );
}

export default App;
