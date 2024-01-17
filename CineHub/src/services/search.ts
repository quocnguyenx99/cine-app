import axios from "../shared/axiosClient";
import { Item, ItemsPage, getRecommnedGenresType } from "../shared/types";

type SearchItem = {
  id: number;
  name: string;
};

export const getSearchKeyword = async (query: string): Promise<string[]> => {
  return (
    await axios.get("/search/keyword", {
      params: {
        query,
      },
    })
  ).data.results
    .map((item: SearchItem) => item.name)
    .filter((_: SearchItem, index: number) => index < 5);
};

export const getRecommendGenres = async (): Promise<getRecommnedGenresType> => {
  const movieGenres = (await axios.get("/genre/movie/list")).data.genres;
  const tvGenres = (await axios.get("/genre/tv/list")).data.genres;

  return {
    movieGenres,
    tvGenres,
  };
};

export const getSearchResult = async (
  typeSearch: string,
  query: string,
  page: number
): Promise<ItemsPage> => {
  const data = (
    await axios.get(`/search/${typeSearch}`, {
      params: {
        query,
        page,
      },
    })
  ).data;

  const results = data?.results
    .map((item: Item) => ({
      ...item,
      ...(typeSearch !== "multi" && { media_type: typeSearch }),
    }))
    .filter((item: Item) => item.poster_path || item.profile_path);

  return {
    ...data,
    results,
  };
};
