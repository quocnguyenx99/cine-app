import type {
  Item,
  getWatchReturnType,
  Episode,
  DetailSeason,
  DetailFilmItem,
} from "../../shared/types";

import { AiFillStar, AiTwotoneCalendar } from "react-icons/ai";
import { BsFillPlayFill, BsThreeDotsVertical } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useCurrentViewport } from "../../hooks/useCurrentViewport";

import Sidebar from "../Common/Sidebar";
import SidebarMini from "../Common/SidebarMini";
import ReadMore from "../Common/ReadMore";
import RightbarFilms from "../Common/RightbarFilms";
import Skeleton from "../Common/Skeleton";
import Footer from "../Footer/Footer";
import Comment from "./Comment/Comment";

import { useEffect, useState } from "react";
import { embedMovie, resizeImage } from "../../shared/utils";
import { ToastContainer, toast } from "react-toastify";
import SeasonSelection from "./SeasonSelection";
import { useAppSelector } from "../../store/hooks";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/firebase";

interface FilmWatchProps {
  media_type: "movie" | "tv";
  seasonNumber?: number;
  episodeNumber?: number;
  currentEpisode?: Episode;
}

function FilmWatch({
  media_type,
  detail,
  detailSeasons,
  recommendations,
  seasonNumber,
  episodeNumber,
  currentEpisode,
}: FilmWatchProps & getWatchReturnType) {
  const { isMobile } = useCurrentViewport();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!currentUser || !detail) return;

    const userDocRef = doc(db, "users", currentUser.uid);
    getDoc(userDocRef).then((docSnap) => {
      const recentlyWatched = docSnap.data()?.recentlyWatch || [];
      const isAlreadyStored = recentlyWatched.some(
        (item: Item) => item.id === detail?.id
      );

      let updatedRecentlyWatch;

      if (!isAlreadyStored) {
        updatedRecentlyWatch = arrayUnion(
          getRecentlyWatchedItem(detail, media_type)
        );
      }

      updateDoc(userDocRef, { recentlyWatch: updatedRecentlyWatch });
    });
  }, [currentUser, detail, media_type]);

  function getRecentlyWatchedItem(detail: DetailFilmItem, media_type: string) {
    return {
      poster_path: detail?.poster_path,
      id: detail?.id,
      vote_average: detail?.vote_average,
      media_type: media_type as "movie" | "tv" | "person",
      ...(media_type === "movie" && {
        title: (detail as DetailFilmItem)?.title,
      }),
      ...(media_type === "tv" && {
        name: (detail as DetailFilmItem)?.name,
      }),
    };
  }

  const getTVSeasonEpisodePath = (detailSeasons: DetailSeason[]): string => {
    const seasonNow =
      detailSeasons &&
      detailSeasons.find((season) => season.season_number === seasonNumber);
    const path = seasonNow?.episodes.find(
      (episode) => episode.episode_number === episodeNumber
    );

    return path?.still_path ?? "";
  };

  return (
    <>
      <ToastContainer />
      {/* START MENU HEADER FOR MOBILE */}
      <header className="flex justify-between items-center px-5 my-5 md:hidden">
        <Link to={"/"}>
          <p className="text-xl text-white font-medium tracking-wider uppercase">
            Cine <span className="px-2 py-1 rounded bg-primary ">Hub</span>
          </p>
        </Link>
        <button onClick={() => setIsSidebarActive((prev) => !prev)}>
          <GiHamburgerMenu size={25} />
        </button>
      </header>
      {/* END MENU HEADER FOR MOBILE */}

      <div className="flex flex-col md:flex-row">
        {!isMobile && <SidebarMini />}

        {isMobile && (
          <Sidebar
            isSidebarActive={isSidebarActive}
            onCloseSidebar={() => setIsSidebarActive(false)}
          />
        )}

        {/* START MAIN CONTENT */}
        <div className="flex-grow px-[2vw] md:pt-11 pt-0">
          {/* start embed movie */}
          <div className="relative h-0 pb-[56.25%]">
            {!detail && (
              <Skeleton className="absolute top-0 left-0 w-full h-full rounded-sm" />
            )}
            {detail && media_type === "movie" ? (
              <iframe
                className="absolute w-full h-full top-0 left-0"
                src={embedMovie(detail.id)}
                title="Film Video Player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute w-full h-full top-0 left-0">
                <LazyLoadImage
                  alt="poster"
                  src={resizeImage(
                    getTVSeasonEpisodePath(detailSeasons!) ?? ""
                  )}
                  effect="opacity"
                  className="relative w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    toast.info("This feature is still in development stage", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-16 h-16 rounded-full bg-primary/70 tw-flex-center z-10  duration-700"
                >
                  <BsFillPlayFill size={35} className="text-white" />
                </button>
              </div>
            )}
          </div>
          {/* end embed movie */}
          <div className="mt-5 pb-8">
            <div className="flex justify-between">
              <div className="flex-1">
                {!detail && <Skeleton className="h-8 w-[400px]" />}
                {detail && (
                  <h1 className="text-gray-txt text-xl font-medium md:text-3xl">
                    <Link
                      to={
                        media_type === "movie"
                          ? `/movie/${detail.id}`
                          : `/tv/${detail.id}`
                      }
                      className="hover:brightness-75 transition duration-300"
                    >
                      {detail.name || detail.title}
                    </Link>
                  </h1>
                )}

                {!detail && <Skeleton className="h-6 w-[100px] mt-5 " />}
                {detail && (
                  <div className="flex gap-5 mt-5">
                    <div className="flex gap-2 items-center">
                      <AiFillStar size={25} className="text-primary" />
                      {media_type === "movie" && (
                        <p>{detail.vote_average.toFixed(1)}</p>
                      )}
                      {media_type === "tv" && (
                        <p>{currentEpisode?.vote_average.toFixed(1)}</p>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <AiTwotoneCalendar size={25} className="text-primary" />
                      <p>
                        {media_type === "movie" &&
                          detail &&
                          detail.release_date &&
                          new Date(detail?.release_date).getFullYear()}
                        {media_type === "tv" &&
                          new Date(
                            (currentEpisode as Episode).air_date
                          ).getFullYear()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {media_type === "tv" && currentEpisode && (
                <div className="flex-1">
                  <h2 className="md:text-xl italic uppercase mt-2 text-right">
                    {currentEpisode.name}
                  </h2>
                  <p className="text-right md:text-lg mt-2">
                    Season {seasonNumber} &#8212; Episode {episodeNumber}
                  </p>
                </div>
              )}
            </div>

            <ul className="flex gap-2 flex-wrap mt-3">
              {detail?.genres.map((genre) => (
                <li key={genre.id} className="mb-2">
                  <Link
                    to={`/explore?genre=${genre.id}`}
                    className="px-3 py-1 bg-dark-light border border-gray-lighten hover:brightness-75  rounded-full transition duration-300"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 text-gray-txt font-medium text-lg md:text-xl">
              Overview:
            </div>

            {!detail && <Skeleton className="h-[84px] mt-2" />}
            {detail && (
              <ReadMore
                limitTextLength={300}
                className="text-base mt-1 md:text-lg"
              >
                {media_type === "movie"
                  ? detail.overview
                  : currentEpisode?.overview}
              </ReadMore>
            )}
          </div>
          <Comment id={detail?.id} media_type={media_type} />
        </div>
        {/* END MAIN CONTENT */}

        {/* START RECOMMENDATIONS */}
        <div className="relative shrink-0 w-full md:max-w-[400px] px-6">
          {media_type === "movie" && (
            <RightbarFilms
              limitNumber={5}
              name="Recommendations"
              films={recommendations?.filter(
                (item: Item) => item.id !== detail?.id
              )}
              isLoading={!recommendations}
              className="mt-8"
            />
          )}

          {media_type === "tv" && (
            <div className="">
              <p className="mt-6 flex justify-between items-center font-medium text-xl">
                <span className="text-white">Seasons:</span>
                <BsThreeDotsVertical size={20} />
              </p>
              <SeasonSelection
                detailSeasons={detailSeasons}
                seasonNumber={seasonNumber}
                episodeNumber={episodeNumber}
              />
            </div>
          )}
        </div>
        {/* END RECOMMENDATIONS */}
      </div>
      <Footer />
    </>
  );
}

export default FilmWatch;
