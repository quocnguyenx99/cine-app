import axios from "../shared/axiosClient";
import type {
  FilmInfo,
  Item,
  Review,
  Video,
  getWatchReturnType,
} from "../shared/types";

export const getMovieDetail = async (id: number): Promise<FilmInfo> => {
  const response = await Promise.all([
    axios.get(`/movie/${id}`),
    axios.get(`/movie/${id}/credits`),
    axios.get(`/movie/${id}/reviews`),
    axios.get(`/movie/${id}/similar`),
    axios.get(`/movie/${id}/videos`),
  ]);
  const movieInfo = response.reduce((acc, curr, index) => {
    switch (index) {
      case 0: {
        acc.detail = { ...curr.data, media_type: "movie" };
        break;
      }
      case 1: {
        acc.credits = curr.data?.cast.slice(0, 6);
        break;
      }
      case 2: {
        acc.reviews = curr.data.results.filter(
          (item: Review) => item.author !== "MSB"
        );
        break;
      }
      case 3: {
        acc.similar = curr.data.results.map((item: Item) => ({
          ...item,
          media_type: "movie",
        }));
        break;
      }
      case 4: {
        acc.videos = curr.data.results
          .filter((item: Video) => item.site === "YouTube")
          .reduce((acc: Video[], curr: Video) => {
            if (curr.type === "Trailer") return [curr, ...acc];
            return [...acc, curr];
          }, [] as Video[]);
        break;
      }
    }

    return acc;
  }, {} as FilmInfo);

  return movieInfo;
};

export const getWatchMovie = async (
  id: number
): Promise<getWatchReturnType> => {
  const response = await Promise.all([
    axios.get(`/movie/${id}`),
    axios.get(`/movie/${id}/recommendations`),
  ]);

  const data: getWatchReturnType = {
    detail: response[0].data,
    recommendations: response[1].data.results.filter(
      (item: Item) => item.poster_path
    ),
  };

  return data;
};
