import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ToastContainer, toast } from "react-toastify";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../../shared/firebase";

import type { FilmInfo, Item } from "../../shared/types";
import { useAppSelector } from "../../store/hooks";
import { useCurrentViewport } from "../../hooks/useCurrentViewport";
import { resizeImage } from "../../shared/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { AiFillHeart } from "react-icons/ai";
import { BsFillPlayFill, BsShareFill, BsThreeDots } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

import SidebarMini from "../Common/SidebarMini";
import Sidebar from "../Common/Sidebar";
import Skeleton from "../Common/Skeleton";
import FilmTabInfo from "./FilmTabInfo";
import RightbarFilms from "../Common/RightbarFilms";

function FilmDetail({ detail, similar, videos, ...others }: FilmInfo) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { isMobile } = useCurrentViewport();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsubDoc = onSnapshot(userRef, (doc) => {
      setIsBookmarked(
        doc.data()?.bookmarks.some((item: Item) => item.id === detail?.id)
      );
    });

    return () => unsubDoc();
  }, [currentUser, detail?.id]);

  const bookmarkedHandle = async () => {
    if (!detail) return;

    if (!currentUser) {
      toast.error("You need to sign in to bookmark films", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    await updateDoc(doc(db, "users", currentUser.uid), {
      bookmarks: !isBookmarked
        ? arrayUnion({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: detail?.media_type,
            ...(detail?.media_type === "movie" && { title: detail?.title }),
            ...(detail?.media_type === "tv" && { title: detail?.name }),
          })
        : arrayRemove({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: detail?.media_type,
            ...(detail?.media_type === "movie" && { title: detail?.title }),
            ...(detail?.media_type === "tv" && { name: detail?.name }),
          }),
    });

    toast.success(
      `${
        !isBookmarked
          ? "This film is now bookmarked"
          : "This film is removed from your bookmarks"
      }`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
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

        <div className="flex-grow min-h-screen bg-dark md:bg-dark-darken">
          {!detail && (
            <>
              <Skeleton className="h-[400px] rounded-bl-2xl md:rounded-none" />
            </>
          )}
          {detail && (
            <>
              {/* START BACKDROP, MOIVE NAME, GENRES, PLAYBTN */}
              <div
                style={{
                  backgroundImage: `url(${resizeImage(detail.backdrop_path)})`,
                }}
                className="relative bg-cover bg-center bg-no-repeat h-[300px] rounded-bl-2xl md:h-[400px] md:rounded-none"
              >
                <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-br from-transparent to-black/70 rounded-bl-2xl ">
                  {/* START DESKTOP WATCH NOW BTN*/}
                  {!isMobile && (
                    <Link
                      to={"watch"}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-16 h-16 rounded-full bg-primary/70 tw-flex-center z-10  duration-700 animate-pulse"
                    >
                      <BsFillPlayFill size={35} className="text-white" />
                    </Link>
                  )}
                  {/* END DESKTOP WATCH NOW BTN*/}
                </div>

                <div className="absolute z-10  flex flex-col md:flex-row items-start tw-absolute-center-horizontal w-full max-w-[1000px] bottom-[-85%] md:bottom-[-20%] ">
                  {/* START POSTER */}
                  <div className="flex flex-row sm:flex-row gap-5 ml-2 items-center relative">
                    {detail && (
                      <div className="shrink-0 max-w-[185px] ml-3 md:ml-0 absolute top-[-120%] sm:relative">
                        <LazyLoadImage
                          src={resizeImage(detail.poster_path, "w185")}
                          effect="opacity"
                          className="w-full h-full object-cover rounded-md"
                          alt="Poster"
                        />
                      </div>
                    )}
                    {isMobile && (
                      <Link
                        to="watch"
                        className="flex gap-6 items-center  pl-6 pr-12 py-3 rounded-full bg-primary text-white hover:bg-blue-600 transition duration-300 mt-24 "
                      >
                        <BsFillPlayFill size={25} />
                        <span className="text-lg font-medium">WATCH</span>
                      </Link>
                    )}
                  </div>
                  {/* END POSTER */}

                  {/* START NAME, GENRES */}
                  <div className="flex-grow ml-6 mt-6">
                    <div className="text-white text-[45px] font-bold leading-tight">
                      <h1>{detail.title || detail.name}</h1>
                    </div>
                    <ul className="flex gap-3 flex-wrap md:mt-7 mt-3">
                      {detail.genres.slice(0, 3).map((genre) => (
                        <li key={genre.id} className="mb-3">
                          <Link
                            to={`/explore?genre=${genre.id}`}
                            className="md:px-5 px-3 md:py-2 py-1 rounded-full uppercase font-medium border-2 border-gray-light md:border-white/70 md:text-white hover:border-primary hover:text-primary transition duration-300"
                          >
                            {genre.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* END NAME, GENRES */}
                </div>

                {/* START BOOKMARKED BTN */}
                <div className="flex gap-3 absolute top-[5%] right-[5%]">
                  <button
                    onClick={bookmarkedHandle}
                    className={`tw-flex-center h-12 w-12 rounded-full border-[3px] border-white shadow-lg hover:border-primary transition duration-300 group ${
                      isBookmarked && "!border-primary"
                    }`}
                  >
                    <AiFillHeart
                      size={20}
                      className={`text-white group-hover:text-primary transition duration-300 ${
                        isBookmarked && "!text-primary"
                      }`}
                    />
                  </button>
                  {/* BOOKMARKED BTN FOR DESKTOP */}
                  {!isMobile && (
                    <>
                      <button
                        className={`tw-flex-center h-12 w-12 rounded-full border-[3px] border-white shadow-lg hover:border-primary transition duration-300 group`}
                      >
                        <BsShareFill
                          size={20}
                          className="text-white group-hover:text-primary transition duration-300"
                        />
                      </button>
                      <button
                        className={`tw-flex-center h-12 w-12 rounded-full border-[3px] border-white shadow-lg hover:border-primary transition duration-300 group`}
                      >
                        <BsThreeDots
                          size={20}
                          className="text-white group-hover:text-primary transition duration-300"
                        />
                      </button>
                    </>
                  )}
                </div>
                {/* END BOOKMARKED BTN */}
              </div>
              {/* END BACKDROP, MOIVE NAME, GENRES, PLAYBTN  */}
            </>
          )}

          {/* START FILM DETAIL, MEDIA, RIGHTBAR  */}
          <div className="flex flex-col mt-32 bg-dark md:flex-row md:mt-0 xl:mx-[8vw]">
            {!isMobile && (
              <div className="shrink-0 md:max-w-[150px] w-full flex items-center md:flex-col justify-center gap-20 mt-20 pt-16 border-r border-transparent md:border-gray-light">
                <div className="flex flex-col gap-6 items-center">
                  <p className="text-white font-medium text-lg">RATING</p>
                  <div className="w-16">
                    {detail && (
                      <CircularProgressbar
                        value={detail.vote_average}
                        maxValue={10}
                        text={`${detail.vote_average.toFixed(1)}`}
                        styles={buildStyles({
                          textSize: "25px",
                          pathColor: `rgba(81, 121, 255, ${
                            (detail.vote_average * 10) / 100
                          })`,
                          textColor: "#fff",
                          trailColor: "transparent",
                          backgroundColor: "#5179ff",
                        })}
                      />
                    )}
                    {!detail && (
                      <Skeleton className="w-16 h-16 rounded-full z-20 !bg-white" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 items-center">
                  {detail && (
                    <>
                      <p className="text-white font-medium text-lg">
                        {detail.media_type === "movie"
                          ? "RUNTIME"
                          : "EP LENGHT"}
                      </p>
                      <div className="flex gap-2 items-center">
                        {detail.media_type === "movie" && (
                          <p className="text-2xl">{detail.runtime}</p>
                        )}
                        {detail.media_type === "tv" && (
                          <p className="text-2xl">
                            {detail?.last_episode_to_air?.runtime}
                          </p>
                        )}
                        <span>min</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex-grow flex flex-col items-center min-h-[450px] pt-40 px-5  md:px-10 md:p-10 z-20 ">
              <FilmTabInfo detail={detail} {...others} />
            </div>

            <div className="shrink-0 w-full md:hidden lg:hidden xl:block xl:max-w-[300px]  px-3 pt-8 border-l border-transparent md:border-gray-light ">
              <p className="mb-5 text-white font-medium text-lg ">MEDIA</p>
              <ul className="flex flex-col  gap-6 md:gap-[30px]">
                {videos?.slice(0, 2).map((video) => (
                  <li key={video.id}>
                    <div className="relative h-0 pb-[56.25%]">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.key}?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A3000&amp;widgetid=1`}
                        frameBorder="0"
                        allowFullScreen
                        allow="ccelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title="Video trailer"
                        width={"100%"}
                        height={"100%"}
                        id="widget-2"
                        className="absolute top-0 left-0 !w-full !h-full"
                      ></iframe>
                    </div>
                    <p className="mt-3 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                      {video.name}
                    </p>
                  </li>
                ))}

                {!videos &&
                  [...new Array(2)].map((_, index) => (
                    <li key={index}>
                      <div className="w-full h-0 pb-[56.25%] relative">
                        <Skeleton className="absolute w-full h-full" />
                      </div>
                      <Skeleton className="h-6 w-[70%] mt-3" />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          {/* END TAB_INFO, MEDIA, RIGHTBAR */}

          <div className="shrink-0 w-full hidden md:block lg:block xl:hidden px-3 pt-8 bg-dark">
            <p className="mb-5 text-white font-medium text-lg ">MEDIA</p>
            <ul className="flex flex-col gap-6 md:gap-[30px]">
              {videos?.slice(0, 2).map((video) => (
                <li key={video.id}>
                  <div className="relative h-0 pb-[56.25%]">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A3000&amp;widgetid=1`}
                      frameBorder="0"
                      allowFullScreen
                      allow="ccelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title="Video trailer"
                      width={"100%"}
                      height={"100%"}
                      id="widget-2"
                      className="absolute top-0 left-0 !w-full !h-full"
                    ></iframe>
                  </div>
                  <p className="mt-3 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {video.name}
                  </p>
                </li>
              ))}

              {!videos &&
                [...new Array(2)].map((_, index) => (
                  <li key={index}>
                    <div className="w-full h-0 pb-[56.25%] relative">
                      <Skeleton className="absolute w-full h-full" />
                    </div>
                    <Skeleton className="h-6 w-[70%] mt-3" />
                  </li>
                ))}
            </ul>
          </div>

          {similar && similar?.length > 0 && (
            <div className="flex-shrink-0 w-full md:w-full xl:px-[8vw]">
              <RightbarFilms
                films={similar?.filter((item) => item.id !== detail?.id)}
                name="Similar"
                limitNumber={3}
                isLoading={!similar}
                className="bg-dark p-6 border-t border-transparent md:border-gray-light"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FilmDetail;
