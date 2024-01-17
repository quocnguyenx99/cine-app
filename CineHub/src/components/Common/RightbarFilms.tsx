import type { Item } from "../../shared/types";
import { resizeImage } from "../../shared/utils";

import { AiFillStar } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate } from "react-router-dom";

import Skeleton from "./Skeleton";

interface RightBarFilmsProps {
  films: Item[] | undefined;
  isLoading: boolean;
  name: string;
  limitNumber?: number;
  className?: string;
}

function RightbarFilms({
  films,
  isLoading,
  name,
  limitNumber = 20,
  className = "",
}: RightBarFilmsProps) {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <p className="flex justify-between items-center mb-6 text-xl font-medium">
        <span className="text-gray-txt">{name}</span>
        <BsThreeDotsVertical size={20} />
      </p>

      <ul className="flex flex-col justify-between md:flex-row md:flex-wrap gap-5">
        {isLoading
          ? new Array(limitNumber).fill("").map((_, index) => (
              <li
                key={index}
                className="flex items-center gap-5 h-[156px] w-full"
              >
                <Skeleton className="shrink-0 max-w-[100px] w-full h-full rounded-md md:rounded-none" />
                <Skeleton className="flex-grow h-[85%] rounded-md" />
              </li>
            ))
          : (films as Item[])?.slice(0, limitNumber).map((item) => (
              <li key={item.id}>
                <Link
                  to={
                    item.media_type === "movie"
                      ? `/movie/${item.id}`
                      : `/tv/${item.id}`
                  }
                  className="flex items-center max-w-[300px] gap-5 hover:brightness-75 transition duration-300 "
                >
                  <div className="shrink-0 max-w-[100px] w-full">
                    <LazyLoadImage
                      alt={"poster"}
                      src={resizeImage(item.poster_path, "w154")}
                      effect="blur"
                      className="object-cover w-full h-full rounded-md md:rounded-none"
                    />
                  </div>

                  <div className="flex-grow ">
                    <p className="text-gray-txt text-lg mb-3 overflow-hidden text-ellipsis ">
                      {item.name || item.title}
                    </p>
                    <p className="text-base mb-6">
                      {item.release_date || item.first_air_date}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-[2px] text-primary text-sm border border-primary rounded-full">
                      <span>{item.vote_average.toFixed(1)}</span>
                      <AiFillStar size={15} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
      </ul>
      <div className="tw-flex-center">
        <button
          onClick={() => navigate("/explore")}
          className="mt-7 py-2 w-full max-w-[350px] rounded-full bg-dark-light text-white border border-transparent hover:border-gray-light transition duration-300 relative"
        >
          See more
        </button>
      </div>
    </div>
  );
}

export default RightbarFilms;
