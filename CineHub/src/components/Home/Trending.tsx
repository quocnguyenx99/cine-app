import { useQuery } from "@tanstack/react-query";
import type { Item } from "../../shared/types";
import { getTrendingNow } from "../../services/home";
import RightbarFilms from "../Common/RightbarFilms";
function Trending() {
  const { data, isLoading, isError, error } = useQuery<Item[], Error>({
    queryKey: ["trending-now"],
    queryFn: getTrendingNow,
  });

  if (isError) return <div>ERROR: ${error.message}</div>;
  // if (isLoading)
  //   return (
  //     <div className="mt-36 mb-20 mx-auto h-10 w-10 rounded-full border-[5px] border-dark-lighten border-t-transparent animate-spin"></div>
  //   );

  return (
    <RightbarFilms
      films={data}
      isLoading={isLoading}
      name={"Trending"}
      limitNumber={3}
      className={"mt-7"}
    />
  );
}

export default Trending;
