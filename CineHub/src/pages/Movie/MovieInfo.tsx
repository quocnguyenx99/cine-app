import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import FilmDetail from "../../components/FilmDetail/FilmDetail";

import type { FilmInfo } from "../../shared/types";
import { getMovieDetail } from "../../services/moive";
import Error from "../Error";

function MovieInfo() {
  const { id } = useParams();
  const { data, isError } = useQuery<FilmInfo, Error>({
    queryKey: ["movieDetail", id],
    queryFn: () => getMovieDetail(Number(id as string)),
  });

  if (isError) return <Error />;

  return <FilmDetail {...data} />;
}

export default MovieInfo;
