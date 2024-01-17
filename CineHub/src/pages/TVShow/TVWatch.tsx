import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getWatchTV } from "../../services/tv";
import { getWatchReturnType } from "../../shared/types";

import FilmWatch from "../../components/FilmWatch/FilmWatch";
import Error from "../Error";

function TVWatch() {
  const { id } = useParams();

  const { data, isError, error } = useQuery<getWatchReturnType, Error>({
    queryKey: ["tvWatch", id],
    queryFn: () => getWatchTV(Number(id as string)),
  });

  const [queryParams] = useSearchParams();

  const seasonNumber = Number(queryParams.get("s")) || 1;
  const episodeNumber = Number(queryParams.get("e")) || 1;

  const currentSeason = data?.detailSeasons?.find(
    (season) => season.season_number === seasonNumber
  );
  const currentEpisode = currentSeason?.episodes?.find(
    (episode) => episode.episode_number === episodeNumber
  );

  if (isError) return <div>ERROR: {error.message}</div>;
  if (!currentEpisode && data) return <Error />;

  return (
    <FilmWatch
      {...data}
      media_type={"tv"}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      currentEpisode={currentEpisode}
    />
  );
}

export default TVWatch;
