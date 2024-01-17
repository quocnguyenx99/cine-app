import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "../Common/Skeleton";
import ReadMore from "../Common/ReadMore";
import StarRating from "../Common/StarRating";

import type { Cast, DetailFilmItem, Review } from "../../shared/types";
import { resizeImage } from "../../shared/utils";
import { calculateTimePassed } from "../../shared/utils";

interface FilmTabInfoProps {
  detail?: DetailFilmItem | undefined;
  credits?: Cast[] | undefined;
  reviews?: Review[] | undefined;
}

function FilmTabInfo({ detail, credits, reviews }: FilmTabInfoProps) {
  const [currentTab, setCurrentTab] = useState("overall");
  const tabButtons = ["overall", "casts", "reviews", "seasons"];

  const overallTabContent = (
    <>
      {detail && (
        <p className="mb-8 text-center text-white text-xl italic">
          {detail.tagline}
        </p>
      )}
      {!detail && <Skeleton className="h-6 w-[350px] mx-auto mb-8" />}

      <p className="text-white  font-medium mb-3">STORY</p>

      {detail && <ReadMore limitTextLength={250}>{detail.overview}</ReadMore>}
      {!detail && <Skeleton className="h-20 " />}

      <p className="text-white font-medium mt-8 mb-3">DETAILS</p>
      {!detail && <Skeleton className="h-16 w-[40%]" />}
      {detail && (
        <>
          <p>Status: {detail.status}</p>
          {detail.media_type === "movie" && (
            <p>Release date: {(detail as DetailFilmItem).release_date}</p>
          )}
          {detail.media_type === "tv" && (
            <p>Last air date: {(detail as DetailFilmItem).last_air_date}</p>
          )}
          <p>
            Spoken language:
            {detail.spoken_languages.map(
              (language, index) =>
                `${index ? ", " : ""} ${language.english_name}`
            )}
          </p>
        </>
      )}

      {detail && (
        <div className="flex mt-10 gap-32  justify-center md:hidden">
          <div className="flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-medium text-white uppercase">
              rating
            </h2>
            <p className="text-xl font-medium">
              {detail.vote_average.toFixed(1)}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-xl font-medium text-white uppercase">
              runtime
            </h2>
            <div className="text-xl font-medium">
              {detail.media_type === "movie" && (
                <p className="text-xl">
                  {detail.runtime} <span className="text-xl">min</span>
                </p>
              )}
              {detail.media_type === "tv" && (
                <p className="text-xl">
                  {detail?.last_episode_to_air?.runtime}{" "}
                  <span className="text-xl">min</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const castsTabContent = (
    <>
      <ul className="grid grid-cols-2 gap-x-20 gap-y-8">
        {credits?.map((cast) => (
          <li key={cast.id} className="flex gap-3 items-center">
            <div className="shrink-0 max-w-[65px] w-full h-[65px]">
              <LazyLoadImage
                alt="cast-image"
                src={resizeImage(cast.profile_path, "w185")}
                effect="opacity"
                className="object-cover rounded-full !w-[65px] !h-[65px]"
              />
            </div>
            <div className="flex-grow">
              <p className="text-primary text-lg font-medium">{cast.name}</p>
              <p className="text-white text-base">
                <span className="italic">as</span> {cast.character}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  const reviewsTabContent = (
    <>
      {reviews && reviews?.length === 0 && (
        <p className="text-center text-white text-lg">
          There is no reviews yet.
        </p>
      )}
      {reviews && reviews?.length > 0 && (
        <ul className="flex flex-col gap-12 max-h-[400px] overflow-y-auto pr-4">
          {reviews?.map((review) => (
            <li key={review.id} className="flex gap-7">
              <div className="shrink-0 max-w-[60px] w-full h-[60px]">
                <LazyLoadImage
                  alt="user-image"
                  src={"/defaultAvatar.jpg"}
                  effect="opacity"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="text-white">{review.author}</p>
                  <StarRating
                    star={Math.round(review.author_details.rating)}
                    maxStar={5}
                  />
                </div>
                <ReadMore limitTextLength={150}>{review.content}</ReadMore>
                <p className="text-right text-base">
                  {calculateTimePassed(new Date(review.created_at).getTime())}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const seasonsTabConent = (
    <>
      <div className="flex justify-between mb-8">
        <p>Total seasons: {detail?.number_of_seasons}</p>
        <p>Total episodes: {detail?.number_of_episodes}</p>
      </div>

      <ul className="flex flex-col gap-10 overflow-auto max-h-[400px]">
        {detail &&
          detail.seasons &&
          detail?.seasons.map((season) => (
            <li key={season.id}>
              <div className="flex gap-3 items-center">
                <div className="shrink-0 w-full max-w-[120px]">
                  <LazyLoadImage
                    alt="season-img"
                    src={resizeImage(season.poster_path, "w92")}
                    effect="opacity"
                    className="object-cover w-[120px] h-full rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-3">
                    <p className="text-white font-medium">{season.name}</p>
                    <p>{season.episode_count} episodes</p>
                  </div>
                  <ReadMore limitTextLength={130} className="mb-2">
                    {season.overview}
                  </ReadMore>
                  <p className="text-base">{season.air_date}</p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );

  return (
    <>
      <ul className="inline-flex justify-center items-center font-medium gap-10 text-lg">
        {tabButtons.map((btnName: string) => (
          <li
            key={btnName}
            className={detail?.media_type === "movie" ? "last:hidden" : ""}
          >
            <button
              onClick={() => setCurrentTab(btnName)}
              className={`pb-1 hover:text-white transition duration-300 ${
                currentTab === btnName &&
                "-translate-y-2 border-b-2 border-primary text-white font-medium"
              }`}
            >
              {btnName[0].toUpperCase() + btnName.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-lg w-full  max-h-[600px]">
        {currentTab === "overall" && overallTabContent}
        {currentTab === "casts" && castsTabContent}
        {currentTab === "reviews" && reviewsTabContent}
        {currentTab === "seasons" && seasonsTabConent}
      </div>
    </>
  );
}

export default FilmTabInfo;
