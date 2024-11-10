import { currentPlaylistIdState } from "@/atoms/playlistAtom";
import { Header } from "@/components/Header";
import { Player } from "@/components/Player";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { Button } from "@/components/ui/button";
import { useGetAllPlaylists } from "@/hooks/useGetAllPlaylists";
import { useSpotify } from "@/hooks/useSpotify";
import { useRecoilValue } from "recoil";

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
    <main className="container mx-auto p-4 space-y-8">
      <Header user={user} logout={logout} />
      <div className="max-w-2xl mx-auto space-y-6">
        <Player />
      </div>
    </main>
  );
}

export default App;
