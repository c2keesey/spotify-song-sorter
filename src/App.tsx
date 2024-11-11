import { currentPlaylistIdState } from "@/atoms/playlistAtom";
import { Header } from "@/components/Header";
import { OtherPlaylists } from "@/components/OtherPlaylists";
import { Player } from "@/components/Player";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { Button } from "@/components/ui/button";
import { useGetAllPlaylists } from "@/hooks/useGetAllPlaylists";
import { useSpotify } from "@/hooks/useSpotify";
import { useRecoilValue } from "recoil";
import { TrackPlaylists } from "./components/TrackPlaylists";

function App() {
  const { isAuthenticated, login, logout, user } = useSpotify();
  const currentPlaylistId = useRecoilValue(currentPlaylistIdState);
  const { isLoading: isLoadingPlaylists } = useGetAllPlaylists();

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

  if (isLoadingPlaylists) {
    return <div>Loading playlists...</div>;
  }

  if (!currentPlaylistId) {
    return <PlaylistSelector />;
  }

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col">
      <Header user={user} logout={logout} />
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 flex-1 min-h-0">
        <div className="space-y-6 min-h-0 overflow-hidden flex flex-col">
          <Player />
          <OtherPlaylists className="flex-1 overflow-auto" />
        </div>
        <TrackPlaylists />
      </div>
    </main>
  );
}

export default App;
