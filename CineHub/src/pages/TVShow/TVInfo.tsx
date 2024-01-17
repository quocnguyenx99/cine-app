import { useParams } from "react-router-dom";
import FilmDetail from "../../components/FilmDetail/FilmDetail";
import { useQuery } from "@tanstack/react-query";
import { getTVShowDetail } from "../../services/tv";
import type { FilmInfo } from "../../shared/types";
import Error from "../Error";

function TVInfo() {
  const { id } = useParams();
  const { data, isError } = useQuery<FilmInfo, Error>({
    queryKey: ["tvDetail", id],
    queryFn: () => getTVShowDetail(Number(id as string)),
  });

  if (isError) return <Error />;

  return <FilmDetail {...data} />;
}

export default TVInfo;
