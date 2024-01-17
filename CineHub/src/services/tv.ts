import axios from "../shared/axiosClient";
import type {
  FilmInfo,
  Item,
  Review,
  Video,
  getWatchReturnType,
  DetailSeason,
} from "../shared/types";

export const getTVShowDetail = async (id: number): Promise<FilmInfo> => {
  const response = await Promise.all([
    axios.get(`/tv/${id}`),
    axios.get(`/tv/${id}/credits`),
    axios.get(`/tv/${id}/reviews`),
    axios.get(`/tv/${id}/similar`),
    axios.get(`/tv/${id}/videos`),
  ]);

  const tvInfo = response.reduce((acc, curr, index) => {
    switch (index) {
      case 0: {
        acc.detail = { ...curr.data, media_type: "tv" };
        break;
      }
      case 1: {
        acc.credits = curr.data?.cast.slice(0, 6);
        break;
      }
      case 2: {
        acc.reviews = curr.data?.results.filter(
          (item: Review) => item.author != "MSB"
        );
        break;
      }
      case 3: {
        acc.similar = curr.data?.results.map((item: Item) => ({
          ...item,
          media_type: "tv",
        }));
        break;
      }
      case 4: {
        acc.videos = curr.data?.results
          .filter((item: Video) => item.site === "YouTube")
          .reduce((acc: Video[], curr: Video) => {
            if (curr.type === "Trailre") return [curr, ...acc];
            return [...acc, curr];
          }, [] as Video[]);
        break;
      }
    }

    return acc;
  }, {} as FilmInfo);

  return tvInfo;
};

export const getWatchTV = async (id: number): Promise<getWatchReturnType> => {
  const response = await Promise.all([
    axios.get(`/tv/${id}`),
    axios.get(`/tv/${id}/recommendations`),
  ]);

  const data: getWatchReturnType = {
    detail: response[0].data,
    recommendations: response[1].data.results,
  };

  const detailSeasons: DetailSeason[] = (
    await Promise.all(
      data.detail?.seasons?.map((season) =>
        axios.get(`/tv/${id}/season/${season.season_number}`)
      ) ?? []
    )
  ).map((res) => res.data);

  return {
    ...data,
    detailSeasons,
  };
};
