import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getSearchResult } from "../../services/search";
import type { ItemsPage } from "../../shared/types";

import FilmItem from "../Common/FilmItem";
import Skeleton from "../Common/Skeleton";
import Pagination from "./Pagination";

interface SearchResultProps {
  currentTab: string;
  query: string;
  page: number;
}

function SearchResult({ currentTab, page, query }: SearchResultProps) {
  const { data, error, isPlaceholderData } = useQuery<ItemsPage, Error>({
    queryKey: ["search-result", currentTab, query, page],
    queryFn: () => getSearchResult(currentTab, query, page),
    placeholderData: keepPreviousData,
  });

  if (error) return <div>ERROR: {error.message}</div>;

  const changePageHandler = (page: number): string => {
    if (isPlaceholderData) return "";
    return `/search?query=${encodeURIComponent(query)}&page=${page}`;
  };

  return (
    <div className="md:mt-32 mt-7 px-[2vw]">
      <p className="text-white text-lg mb-6 md:text-xl">
        {`Search results for "${query}" (${data?.total_results} results found)`}
      </p>
      {data && data.results.length === 0 && (
        <div className="flex flex-col items-center mb-12">
          <LazyLoadImage
            alt="erorr-img"
            src="/error.png"
            effect="opacity"
            className="w-[600px]"
          />
          <p className="text-white text-3xl mt-5">There is no such films</p>
        </div>
      )}
      <ul className="grid grid-cols-sm md:grid-cols-lg gap-x-8 gap-y-10">
        {data &&
          data.results.map((item) => (
            <li key={item.id}>
              <FilmItem item={item} />
            </li>
          ))}

        {!data &&
          [...new Array(15)].map((_, index) => (
            <li key={index}>
              <Skeleton className="h-0 pb-[160%]" />
            </li>
          ))}
      </ul>

      {/* START PAGINATION */}
      <Pagination
        maxPage={data?.total_pages as number}
        currentPage={data?.page as number}
        onChangePage={changePageHandler}
      />
      {/* END PAGINATION */}
    </div>
  );
}

export default SearchResult;
