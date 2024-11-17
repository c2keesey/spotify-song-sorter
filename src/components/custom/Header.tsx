import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingDots } from "@/components/ui/loading-dots";
import { User } from "@/types/spotify";
import {
  ExitIcon,
  GearIcon,
  ListBulletIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { PlaylistSelector } from "./PlaylistSelector";
import { SettingsDialog } from "./SettingsDialog";

interface HeaderProps {
  user?: User;
  logout: () => void;
  isLoading?: boolean;
}

export function Header({ user, logout, isLoading }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-4xl font-bold">Spotify Song Sorter</h1>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingDots size="sm" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowPlaylistSelector(true)}
            >
              <ListBulletIcon className="w-4 h-4" />
              Change Playlist
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
            >
              <GearIcon className="w-5 h-5" />
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              {user?.images?.[0]?.url ? (
                <img
                  src={user.images[0].url}
                  alt={user?.display_name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <PersonIcon className="w-6 h-6" />
              )}
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
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      {showPlaylistSelector && (
        <PlaylistSelector
          open={showPlaylistSelector}
          onOpenChange={setShowPlaylistSelector}
        />
      )}
    </div>
  );
}
