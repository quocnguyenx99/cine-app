import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";

import SidebarMini from "../components/Common/SidebarMini";
import Sidebar from "../components/Common/Sidebar";
import SearchBox from "../components/Common/SearchBox";
import ExploreFilter from "../components/Explore/ExploreFilter";
import ExploreResult from "../components/Explore/ExploreResult";

import { useCurrentViewport } from "../hooks/useCurrentViewport";
import { useAppSelector } from "../store/hooks";
import { ConfigType } from "../shared/types";

function Explore() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { isMobile } = useCurrentViewport();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isShowScrollUpBtn, setIsShowScrollUpBtn] = useState(false);
  const [currentTab, setCurrentTab] = useState(
    localStorage.getItem("currentTab") || "tv"
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [config, setConfig] = useState<ConfigType>({});

  useEffect(() => {
    const changeConfig = (key: string, values: string | number) => {
      setConfig((prevConfig) => ({
        ...prevConfig,
        [key]: values,
      }));
    };

    // SORT BY FILTER
    const sortType = searchParams.get("sort_by") || "popularity.desc";
    changeConfig("sort_by", sortType as string);

    // FITLER BY GENRES, RUNTIME, RELEASE DATE

    const genreType = searchParams.getAll("genre") || [];
    changeConfig("with_genres", genreType.toString());

    const minRuntime = Number(searchParams.get("minRuntime")) || 0;
    const maxRuntime = Number(searchParams.get("maxRuntime")) || 200;
    changeConfig("with_runtime.gte", minRuntime);
    changeConfig("with_runtime.lte", maxRuntime);

    const releaseFrom = searchParams.get("from") || "1999-05-18";
    const releaseTo = searchParams.get("to") || "2023-12-01";
    changeConfig("primary_release_date.gte", releaseFrom);
    changeConfig("primary_release_date.lte", releaseTo);
    changeConfig("air_date.gte", releaseFrom);
    changeConfig("air_date.lte", releaseTo);
  }, [window.location.search]);

  useEffect(() => {
    const checkIfShowScrollUpBtn = () => {
      const scrollOffset = document.documentElement.scrollTop;
      if (scrollOffset > 1000) {
        setIsShowScrollUpBtn(true);
      } else {
        setIsShowScrollUpBtn(false);
      }
    };

    window.addEventListener("scroll", checkIfShowScrollUpBtn);

    return () => window.removeEventListener("scroll", checkIfShowScrollUpBtn);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* START SCROLL-UP BTN */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-[35px] right-[30px] z-10 transition duration-500 animate-bounce ${
          !isShowScrollUpBtn && "hidden opacity-0  pointer-events-none"
        }`}
      >
        <BsFillArrowUpCircleFill
          size={35}
          className={"text-primary hover:brightness-75 transition duration-300"}
        />
      </button>

      {/* END SCROLL-UP BTN */}

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

      <section className="flex flex-col-reverse md:flex-row">
        {/* START SIDEBAR */}
        {!isMobile && <SidebarMini />}
        {isMobile && (
          <Sidebar
            isSidebarActive={isSidebarActive}
            onCloseSidebar={() => setIsSidebarActive(false)}
          />
        )}
        {/* END SIDEBAR */}

        <section className="flex-grow  pt-6 px-[2vw] md:pr-0">
          {/* START SWITCH MODE, SEARCHBOX, USER INFO */}
          <div className="flex justify-between items-center mb-6 md:items-end md:pr-6 ">
            <div className="inline-flex gap-[40px] pb-[14px]  relative">
              <button
                onClick={() => {
                  setCurrentTab("tv");
                  localStorage.setItem("currentTab", "tv");
                  setSearchParams({});
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
                  setSearchParams({});
                }}
                className={`${
                  currentTab === "movie" &&
                  "text-white font-medium after:absolute after:bottom-0 after:right-[9%] after:bg-white after:h-[3px] after:w-5"
                } transition duration-200 hover:text-white`}
              >
                Movie
              </button>
            </div>

            <SearchBox className="hidden w-full lg:max-w-[600px] lg:block lg:top-[25px] lg:left-[400px] " />

            <div className="flex gap-6 items-center invisible md:visible">
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

          <div className="flex md:bg-dark ">
            <div className="flex-grow ">
              <ExploreResult currentTab={currentTab} config={config} />
            </div>
            <div className="hidden md:block shrink-0 w-full max-w-[330px] pt-4 px-3 ">
              <ExploreFilter currentTab={currentTab} />
            </div>
          </div>
        </section>

        {isMobile && (
          <div className="shrink-0 w-full pt-4 px-3 ">
            <ExploreFilter currentTab={currentTab} />
          </div>
        )}

        {isMobile && (
          <h2 className="ml-3 mt-3 uppercase font-medium text-3xl text-white">
            Find films that best fit you
          </h2>
        )}
      </section>
    </>
  );
}

export default Explore;
