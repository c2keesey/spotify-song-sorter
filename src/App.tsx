import { currentPlaylistState } from "@/atoms/playlistAtom";
import { Player } from "@/components/Player";
import { PlaylistSearch } from "@/components/PlaylistSearch";
import { PlaylistSelector } from "@/components/PlaylistSelector";
import { SongInfo } from "@/components/SongInfo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebPlayback } from "@/components/WebPlayback";
import { useSpotify } from "@/hooks/useSpotify";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { useRecoilValue } from "recoil";

function App() {
  const { isAuthenticated, login, logout, user } = useSpotify();
  const currentPlaylist = useRecoilValue(currentPlaylistState);

  return (
    <>
      {isAuthenticated && <WebPlayback />}
      {!isAuthenticated ? (
        <main className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            Spotify Song Sorter
          </h1>
          <Button onClick={login} size="lg">
            Login with Spotify
          </Button>
        </main>
      ) : !currentPlaylist ? (
        <PlaylistSelector />
      ) : (
        <main className="container mx-auto p-4 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Spotify Song Sorter</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <img
                    src={user?.images?.[0]?.url}
                    alt={user?.display_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-muted-foreground">
                    {user?.display_name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() =>
                    window.open(user?.external_urls?.spotify, "_blank")
                  }
                  className="cursor-pointer"
                >
                  <PersonIcon className="mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <ExitIcon className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <SongInfo />
            <Player />
            <PlaylistSearch />
          </div>
        </main>
      )}
    </>
  );
}

export default App;
