import { useQuery } from "@tanstack/react-query";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSearchParams } from "react-router-dom";
import { getRecommendGenres } from "../../services/search";
import { getRecommnedGenresType } from "../../shared/types";

interface FilterByGenresProps {
  currentTab: string;
}

function FilterByGenres({ currentTab }: FilterByGenresProps) {
  const { data, isLoading, isError, error } = useQuery<
    getRecommnedGenresType,
    Error
  >({
    queryKey: ["genres"],
    queryFn: getRecommendGenres,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [parent] = useAutoAnimate();

  if (isError) return <div>ERROR: {error.message}</div>;

  if (isLoading)
    return (
      <div className="mt-36 mb-20 mx-auto h-10 w-10 rounded-full border-[5px] border-dark-lighten border-t-transparent animate-spin"></div>
    );

  const chooseGenre = (genreId: string) => {
    const existingGenres = searchParams.getAll("genre");
    if (existingGenres.includes(genreId)) {
      const updatedGenres = existingGenres.filter((genre) => genre !== genreId);
      searchParams.delete("genre");

      updatedGenres.forEach((genreId) => searchParams.append("genre", genreId));

      setSearchParams(searchParams);
    } else {
      searchParams.append("genre", genreId);
      setSearchParams(searchParams);
    }
  };

  return (
    <ul
      ref={parent}
      className="flex flex-wrap gap-3 max-h-[200px] overflow-y-auto"
    >
      {data &&
        data[currentTab === "movie" ? "movieGenres" : "tvGenres"].map(
          (genre) => (
            <li key={genre.id}>
              <button
                onClick={() => chooseGenre(String(genre.id))}
                className={`inline-block px-4 py-2 rounded-full border border-gray-light hover:text-white hover:border-primary transition duration-300 md:rounded-none md:bg-[#323232] ${
                  searchParams.getAll("genre").includes(String(genre.id)) &&
                  "bg-primary text-white border-none md:bg-primary"
                }`}
              >
                {genre.name}
              </button>
            </li>
          )
        )}
    </ul>
  );
}

export default FilterByGenres;
