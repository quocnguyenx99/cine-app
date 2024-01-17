import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getWatchMovie } from "../../services/moive";
import { getWatchReturnType } from "../../shared/types";

import FilmWatch from "../../components/FilmWatch/FilmWatch";
import Error from "../Error";

function MovieWatch() {
  const { id } = useParams();
  const { data, isError } = useQuery<getWatchReturnType, Error>({
    queryKey: ["movieWatch", id],
    queryFn: () => getWatchMovie(Number(id as string)),
  });
  if (isError) return <Error />;

  return <FilmWatch {...data} media_type={"movie"} />;
}

export default MovieWatch;
