import { Item } from "../../shared/types";
import { resizeImage } from "../../shared/utils";

import { AiFillStar } from "react-icons/ai";

import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface FilmItemProps {
  item: Item;
}

function FilmItem({ item }: FilmItemProps) {
  return (
    <Link
      to={
        item.media_type === "movie"
          ? `/movie/${item.id}`
          : item.media_type === "tv"
          ? `/tv/${item.id}`
          : "/"
      }
    >
      <div className="relative overflow-hidden pb-2 shadow-sm rounded-md md:rounded-none bg-dark-light  hover:scale-105 hover:brightness-110 transition duration-300 group ">
        <LazyLoadImage
          alt="Poster film"
          src={
            item.media_type === "person"
              ? resizeImage(item.profile_path || "", "w342")
              : resizeImage(item.poster_path, "w342")
          }
          className="object-cover "
          effect="blur"
        />

        <p className="overflow-hidden mt-1 px-2 text-center text-ellipsis text-base whitespace-nowrap group-hover:text-white transition duration-300 ">
          {item.title || item.name}
        </p>

        <div className="absolute top-[5%] left-[8%] z-20 flex items-center px-2 py-1 rounded-full bg-primary text-white text-xs">
          {item.vote_average?.toFixed(1)}
          <AiFillStar size={15} />
        </div>
      </div>
    </Link>
  );
}

export default FilmItem;
