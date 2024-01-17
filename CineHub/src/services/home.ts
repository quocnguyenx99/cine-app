import axios from "../shared/axiosClient";
import type { AxiosResponse } from "axios";

import type {
  HomeFilms,
  Item,
  DetailFilmItem,
  BannerInfo,
  GenreItemDetail,
  ItemsPage,
} from "../shared/types";

type Endpoints = {
  [key: string]: string;
};

type TranslationRes = {
  id: number;
  translations: TranslationItemDetail[];
};

type TranslationItemDetail = {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: {
    homepage: string;
    overview: string;
    runtime: number;
    tagline: string;
    title?: string;
    name?: string;
  };
};

///////////////// MOVIE TAB /////////////////////////////
export const getHomeMovies = async (): Promise<HomeFilms> => {
  const endpoints: Endpoints = {
    Trending: "/trending/movie/day",
    Popular: "/movie/popular",
    "Top Rated": "/movie/top_rated",
    Hot: "/trending/movie/day?page=2",
    Upcoming: "/movie/upcoming",
  };

  //   Get all responses from server
  const responses: AxiosResponse<ItemsPage>[] = await Promise.all(
    Object.entries(endpoints).map((endpoint) => axios.get(endpoint[1]))
  );

  // Add media_type follow kind of films for all responses
  const data = responses.reduce((final, curr, index) => {
    final[Object.entries(endpoints)[index][0]] = curr.data.results.map(
      (item: Item) => ({
        ...item,
        media_type: "movie",
      })
    );

    return final;
  }, {} as HomeFilms);

  return data;
};

export const getMovieBannerInfo = async (
  movies: Item[]
): Promise<BannerInfo[]> => {
  const detailRes: AxiosResponse<DetailFilmItem>[] = await Promise.all(
    movies.map((movie) => axios.get(`/movie/${movie.id}`))
  );

  const genres = detailRes.map((item) => {
    return item.data.genres.filter(
      (_: GenreItemDetail, index: number) => index < 3
    );
  });

  const translationRes: AxiosResponse<TranslationRes>[] = await Promise.all(
    movies.map((movie) => axios.get(`/movie/${movie.id}/translations`))
  );

  const translations = translationRes.map((item) =>
    item.data.translations
      .filter((translation: TranslationItemDetail) => {
        return ["vi", "fr", "ja", "pt", "ru", "es"].includes(
          translation.iso_639_1
        );
      })
      .reduce(
        (acc: TranslationItemDetail[], element: TranslationItemDetail) => {
          if (element.iso_639_1 === "vi") {
            return [element, ...acc];
          }
          return [...acc, element];
        },
        [] as TranslationItemDetail[]
      )
      .map((translation: TranslationItemDetail) => translation.data.title)
  );
  const data = genres.map((genre: GenreItemDetail[], index) => ({
    genre,
    translation: translations[index],
  })) as BannerInfo[];

  return data;
};

///////////////// TV TAB /////////////////////////////

export const getHomeTVs = async (): Promise<HomeFilms> => {
  const endpoints: Endpoints = {
    Trending: "/trending/tv/day",
    Popular: "/tv/popular",
    "Top Rated": "/tv/top_rated",
    Hot: "/trending/tv/day?page=2",
    "On the air": "/tv/on_the_air",
  };

  //   Get all responses from server
  const responses: AxiosResponse<ItemsPage>[] = await Promise.all(
    Object.entries(endpoints).map((endpoint) => axios.get(endpoint[1]))
  );

  // Add media_type follow kind of films for all responses
  const data = responses.reduce((final, curr, index) => {
    final[Object.entries(endpoints)[index][0]] = curr.data.results.map(
      (item: Item) => ({
        ...item,
        media_type: "tv",
      })
    );

    return final;
  }, {} as HomeFilms);

  return data;
};

export const getTVBannerInfo = async (tvs: Item[]): Promise<BannerInfo[]> => {
  const detailRes: AxiosResponse<DetailFilmItem>[] = await Promise.all(
    tvs.map((tv) => axios.get(`/tv/${tv.id}`))
  );

  const genres = detailRes.map((item) => {
    return item.data.genres.filter(
      (_: GenreItemDetail, index: number) => index < 3
    );
  });

  const translationRes: AxiosResponse<TranslationRes>[] = await Promise.all(
    tvs.map((tv) => axios.get(`/tv/${tv.id}/translations`))
  );

  const tranlations = translationRes.map((item) =>
    item.data.translations
      .filter((translation: TranslationItemDetail) => {
        ["vi", "fr", "ja", "pt", "ru", "es"].includes(translation.iso_639_1);
      })
      .reduce(
        (acc: TranslationItemDetail[], element: TranslationItemDetail) => {
          if (element.iso_639_1 === "vi") {
            return [element, ...acc];
          }
          return [...acc, element];
        },
        [] as TranslationItemDetail[]
      )
      .map((translation: TranslationItemDetail) => translation.data.name)
  );

  const data = genres.map((genre: GenreItemDetail[], index) => ({
    genre,
    translation: tranlations[index],
  })) as BannerInfo[];

  return data;
};

///////////////// TRENDING NOW /////////////////////////////
export const getTrendingNow = async (): Promise<Item[]> => {
  const data: Item[] = (await axios.get("/trending/all/day?page=2")).data
    .results;
  return data;
};
