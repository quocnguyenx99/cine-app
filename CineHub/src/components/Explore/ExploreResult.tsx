import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { ItemsPage, ConfigType } from "../../shared/types";
import { getExploreMovie, getExploreTV } from "../../services/explore";

import ExploreResultContent from "./ExploreResultContent";

interface ExploreResultProps {
  currentTab: string;
  config: ConfigType;
}

function ExploreResult({ currentTab, config }: ExploreResultProps) {
  const [parent] = useAutoAnimate();

  // GET DATA FOR MOVIE EXPLORE
  const {
    data: movies,
    fetchNextPage: fetchNextPageMovie,
    hasNextPage: hasNextPageMovie,
    error: errorMovies,
  } = useInfiniteQuery<ItemsPage, Error>({
    queryKey: ["explore-result-movie", config],
    queryFn: ({ pageParam = 1 }) =>
      getExploreMovie(pageParam as number, config),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page + 1 <= lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
  });

  // GET DATA FOR TV EXPLORE
  const {
    data: tvs,
    fetchNextPage: fetchNextPageTV,
    hasNextPage: hasNextPageTV,
    error: errorTVs,
  } = useInfiniteQuery<ItemsPage, Error>({
    queryKey: ["explore-result-tv", config],
    queryFn: ({ pageParam = 1 }) => getExploreTV(pageParam as number, config),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page + 1 <= lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
  });

  if (errorMovies) return <div>ERROR: {errorMovies.message}</div>;
  if (errorTVs) return <div>ERROR: {errorTVs.message}</div>;

  return (
    <div ref={parent}>
      {currentTab === "movie" && (
        <ExploreResultContent
          data={movies?.pages}
          fetchNext={fetchNextPageMovie}
          hasNextPage={hasNextPageMovie}
        />
      )}

      {currentTab === "tv" && (
        <ExploreResultContent
          data={tvs?.pages}
          fetchNext={fetchNextPageTV}
          hasNextPage={hasNextPageTV}
        />
      )}
    </div>
  );
}

export default ExploreResult;
