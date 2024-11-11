import { GenreCard } from "./GenreCard";

interface TopGenresProps {
  genres: Array<{
    name: string;
    songCount: number;
    percentage: number;
  }>;
}

export function TopGenres({ genres }: TopGenresProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {genres.map((genre) => (
        <GenreCard
          key={genre.name}
          genre={genre.name}
          songCount={genre.songCount}
          percentage={genre.percentage}
        />
      ))}
    </div>
  );
}
