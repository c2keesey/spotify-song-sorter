import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/spotify";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";

interface HeaderProps {
  user?: User;
  logout: () => void;
}

export function Header({ user, logout }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-4xl font-bold">Spotify Song Sorter</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <img
              src={user?.images?.[0]?.url}
              alt={user?.display_name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-muted-foreground">{user?.display_name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => window.open(user?.external_urls?.spotify, "_blank")}
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
  );
}
