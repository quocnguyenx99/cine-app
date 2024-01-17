import axios from "../shared/axiosClient";
import type { ItemsPage, ConfigType, Item } from "../shared/types";

export const getExploreMovie = async (
  page: number,
  config: ConfigType = {}
): Promise<ItemsPage> => {
  const data = (
    await axios.get("/discover/movie", {
      params: {
        ...config,
        page,
      },
    })
  ).data;

  const adjustedItems = data.results
    .filter((item: Item) => {
      return item.poster_path;
    })
    .map((item: Item) => ({
      ...item,
      media_type: "movie",
    }));

  return {
    ...data,
    results: adjustedItems,
  };
};

export const getExploreTV = async (
  page: number,
  config: ConfigType = {}
): Promise<ItemsPage> => {
  const data = (
    await axios.get("/discover/tv", {
      params: {
        ...config,
        page,
      },
    })
  ).data;

  const adjustedItems = data.results
    .filter((item: Item) => item.poster_path)
    .map((item: Item) => ({
      ...item,
      media_type: "tv",
    }));

  return {
    ...data,
    results: adjustedItems,
  };
};
