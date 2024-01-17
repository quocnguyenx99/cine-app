import { getRecommendGenres } from "../../services/search";
import type { getRecommnedGenresType } from "../../shared/types";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface RecommendGenresProps {
  currentTab: string;
}

function getRandomGenres(genres: { id: number; name: string }[]) {
  const myGenresIndex = [5, 2, 13, 14, 6, 7, 4];
  return myGenresIndex.map((genreIndex) => genres[genreIndex]);
}

function RecommendGenres({ currentTab }: RecommendGenresProps) {
  const [parent] = useAutoAnimate();
  const { data, isLoading, isError, error } = useQuery<
    getRecommnedGenresType,
    Error
  >({
    queryKey: ["genres"],
    queryFn: getRecommendGenres,
  });

  if (isError) return <div>ERROR: {error.message}</div>;

  if (isLoading)
    return (
      <div className="mt-36 mb-20 mx-auto h-10 w-10 rounded-full border-[5px] border-dark-lighten border-t-transparent animate-spin"></div>
    );

  const movieGenres = data?.movieGenres;
  const tvGenres = data?.tvGenres;

  const randomGenres = getRandomGenres(
    currentTab === "movie" && movieGenres
      ? movieGenres
      : tvGenres
      ? tvGenres
      : []
  );

  return (
    <>
      <h2 className="text-white font-medium text-xl">Recommend Genres</h2>
      <ul ref={parent} className="mt-10 flex flex-wrap gap-3 ">
        {randomGenres?.map((genre) => (
          <li key={genre.id} className="mb-4">
            <Link
              to={`/explore?genre=${String(genre.id)}`}
              className="px-4 py-2  bg-dark-light rounded-sm border border-gray-lighten hover:border-primary hover:brightness-110 hover:text-white transition duration-300"
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default RecommendGenres;
