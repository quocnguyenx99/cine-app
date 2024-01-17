import { Link } from "react-router-dom";
import { resizeImage } from "../../shared/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { DetailSeason } from "../../shared/types";
import Skeleton from "../Common/Skeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

interface SeasonSelectionProps {
  detailSeasons?: DetailSeason[];
  seasonNumber?: number;
  episodeNumber?: number;
}

interface SeasonProps {
  seasonNumber?: number;
  episodeNumber?: number;
  season?: DetailSeason;
}

function Season({ seasonNumber, episodeNumber, season }: SeasonProps) {
  const [list] = useAutoAnimate();

  const [isSeasonExpand, setIsSeasonExpand] = useState(
    season?.season_number === 1
  );

  return (
    <li ref={list}>
      <button
        onClick={() => setIsSeasonExpand((prev) => !prev)}
        className="inline-flex items-center w-full gap-7 hover:bg-dark-lighten transition duration-300 rounded-md px-2 pt-2 pb-1"
      >
        <div className="shrink-0 max-w-[100px] w-full">
          <LazyLoadImage
            src={resizeImage(season?.poster_path || "", "w154")}
            alt="season-poster"
            effect="opacity"
            className="w-[100px] h-[100px] rounded-md object-center object-cover"
          />
        </div>
        <div className="flex-grow text-left">
          <p
            className={`text-white text-lg mb-2 transition duration-300 ${
              season?.season_number === seasonNumber && "text-primary"
            }`}
          >
            {season?.name}
          </p>
          <p
            className={`transition duration-300 ${
              season?.season_number === seasonNumber && "text-white"
            }`}
          >
            Episode: {season?.episodes.length}
          </p>
        </div>
      </button>

      {isSeasonExpand && (
        <ul className="flex flex-col gap-4 pl-6 mt-2">
          {season?.episodes.map((episode) => (
            <li key={episode.id}>
              <Link
                to={{
                  pathname: "",
                  search: `?s=${season.season_number}&e=${episode.episode_number}`,
                }}
                className="flex items-center gap-3 hover:bg-dark-lighten transiton duration-300 rounded-md pl-2"
              >
                <div className="shrink-0 max-w-[15px] w-full">
                  <p
                    className={`text-white font-medium transition duration-300 ${
                      episode.episode_number === episodeNumber &&
                      season.season_number === seasonNumber &&
                      "text-primary"
                    }`}
                  >
                    {episode.episode_number}
                  </p>
                </div>

                <div className="shrink-0 max-w-[120px] w-full pt-2">
                  <LazyLoadImage
                    src={resizeImage(episode.still_path, "w185")}
                    alt=""
                    effect="opacity"
                    className="object-cover w-[120px] rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <p
                    className={`transition duration-300 text-sm ${
                      episode.episode_number === episodeNumber &&
                      season.season_number === episodeNumber &&
                      "text-white"
                    }`}
                  >
                    {episode.name}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SeasonSelection({
  detailSeasons,
  seasonNumber,
  episodeNumber,
}: SeasonSelectionProps) {
  return (
    <ul className="flex flex-col gap-4 max-h-[750px] overflow-y-auto">
      {detailSeasons &&
        detailSeasons.map((season) => (
          <Season
            key={season.id}
            seasonNumber={seasonNumber}
            episodeNumber={episodeNumber}
            season={season}
          />
        ))}

      {!detailSeasons && (
        <div>
          <Skeleton className="h-[118px] mb-6" />
          {new Array(6).fill("").map((_, index) => (
            <li key={index}>
              <Skeleton className="h-[81px]" />
            </li>
          ))}
        </div>
      )}
    </ul>
  );
}

export default SeasonSelection;
