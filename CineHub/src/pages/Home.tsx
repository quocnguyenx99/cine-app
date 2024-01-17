import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";

import Sidebar from "../components/Common/Sidebar";
import Footer from "../components/Footer/Footer";
import RecommendGenres from "../components/Home/RecommendGenres";
import Trending from "../components/Home/Trending";
import MainHomeFilm from "../components/Home/MainHomeFilm";
import SearchBox from "../components/Common/SearchBox";

import { useAppSelector } from "../store/hooks";
import type { Item, HomeFilms, BannerInfo } from "../shared/types";
import {
  getHomeMovies,
  getHomeTVs,
  getMovieBannerInfo,
  getTVBannerInfo,
} from "../services/home";

function Home() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [currentTab, setCurrentTab] = useState(
    localStorage.getItem("currentTab") || "tv"
  );
  const [parent] = useAutoAnimate();

  const {
    data: dataMovie,
    isLoading: isLoadingMovie,
    isError: isErrorMovie,
    error: errorMovie,
  } = useQuery<HomeFilms, Error>({
    queryKey: ["home-movies"],
    queryFn: getHomeMovies,
  });

  const {
    data: dataMovieDetail,
    isLoading: isLoadingMovieDetail,
    isError: isErrorMovieDetail,
    error: errorMovieDetail,
  } = useQuery<BannerInfo[], Error>({
    queryKey: ["detailMovies", dataMovie?.Trending],
    queryFn: () => getMovieBannerInfo(dataMovie?.Trending as Item[]),
    enabled: !!dataMovie?.Trending,
  });

  const {
    data: dataTV,
    isLoading: isLoadingTV,
    isError: isErrorTV,
    error: errorTV,
  } = useQuery<HomeFilms, Error>({
    queryKey: ["home-tvs"],
    queryFn: getHomeTVs,
  });

  const {
    data: dataTVDetail,
    isLoading: isLoadingTVDetail,
    isError: isErrorTVDetail,
    error: errorTVDetail,
  } = useQuery<BannerInfo[], Error>({
    queryKey: ["detailTVs", dataTV?.Trending],
    queryFn: () => getTVBannerInfo(dataTV?.Trending as Item[]),
    enabled: !!dataTV?.Trending,
  });

  if (isErrorMovie) return <p>ERROR: {errorMovie.message}</p>;
  if (isErrorMovieDetail) return <p>ERROR: {errorMovieDetail.message}</p>;

  if (isErrorTV) return <p>ERROR: {errorTV.message}</p>;
  if (isErrorTVDetail) return <p>ERROR: {errorTVDetail.message}</p>;

  return (
    <>
      {/* START HEADER FOR MOBILE */}
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
      {/* END HEADER FOR MOBILE */}

      <section className="flex items-start">
        <Sidebar
          onCloseSidebar={() => setIsSidebarActive(false)}
          isSidebarActive={isSidebarActive}
        />

        <div
          ref={parent}
          className="flex-grow md:pt-7 pt-0 pb-7 md:pl-[1vw] md:pr-0 md:pb-0 px-[4vw] min-h-screen"
        >
          {/* START SWITCH MODE, SEARCHBOX, USER INFO */}
          <div className="flex justify-between items-center md:items-end md:pr-6">
            <div className="inline-flex gap-[40px] pb-[14px] relative">
              <button
                onClick={() => {
                  setCurrentTab("tv");
                  localStorage.setItem("currentTab", "tv");
                }}
                className={`${
                  currentTab === "tv" &&
                  "text-white font-medium after:absolute after:bottom-0 after:left-[13%] after:bg-white after:h-[3px] after:w-5"
                } transition duration-200 hover:text-white`}
              >
                TV Show
              </button>
              <button
                onClick={() => {
                  setCurrentTab("movie");
                  localStorage.setItem("currentTab", "movie");
                }}
                className={`${
                  currentTab === "movie" &&
                  "text-white font-medium after:absolute after:bottom-0 after:right-[9%] after:bg-white after:h-[3px] after:w-5"
                } transition duration-200 hover:text-white`}
              >
                Movie
              </button>
            </div>

            <SearchBox className="hidden w-full lg:max-w-[600px] lg:block  lg:left-[250px] " />

            <div className="flex gap-6 items-center">
              <p>{currentUser?.displayName || "Anonymous"}</p>
              <LazyLoadImage
                src={
                  currentUser
                    ? (currentUser.photoURL as string)
                    : "/defaultAvatar.jpg"
                }
                alt="User avatar"
                className="w-7 h-7 rounded-full object-cover"
                effect="opacity"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          {/* END SWITCH MODE, SEARCHBOX, USER INFO */}

          {/*START MAIN HOME FILMS, TRENDING NOW, RECOMMEND GENRES */}

          <div className="flex mt-6  md:bg-dark  ">
            {currentTab === "movie" && (
              <MainHomeFilm
                data={dataMovie}
                dataDetail={dataMovieDetail}
                isLoadingBanner={isLoadingMovieDetail}
                isLoadingSection={isLoadingMovie}
              />
            )}

            {currentTab === "tv" && (
              <MainHomeFilm
                data={dataTV}
                dataDetail={dataTVDetail}
                isLoadingBanner={isLoadingTVDetail}
                isLoadingSection={isLoadingTV}
              />
            )}

            <div className="shrink-0 max-w-[310px] w-full h-full hidden lg:block p-6 top-0 sticky">
              <RecommendGenres currentTab={currentTab} />
              <Trending />
            </div>
          </div>
          {/*END MAIN HOME FILMS, TRENDING NOW, RECOMMEND GENRES */}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
