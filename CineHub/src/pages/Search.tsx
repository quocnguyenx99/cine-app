import { Link, useSearchParams } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";

import SearchBox from "../components/Common/SearchBox";
import Sidebar from "../components/Common/Sidebar";
import Footer from "../components/Footer/Footer";
import { useState } from "react";
import SearchResult from "../components/Search/SearchResult";

function Search() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSearchFilter, setOpenSearchFilter] = useState(true);
  const [currentTab, setCurrentTab] = useState("multi");

  const [parent] = useAutoAnimate();
  const query = searchParams.get("query");
  const page = searchParams.get("page") || 1;

  const filterOptions = [
    { label: "All", value: "multi", id: 1 },
    { label: "Movie", value: "movie", id: 2 },
    { label: "TV Show", value: "tv", id: 3 },
    { label: "People", value: "person", id: 4 },
  ];

  return (
    <>
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

      <div className="flex min-h-screen">
        <Sidebar
          isSidebarActive={isSidebarActive}
          onCloseSidebar={() => setIsSidebarActive(false)}
        />

        <div className="flex-grow ">
          <div
            className={`relative z-30 lg:-left-6 w-full md:max-w-[50vw] mx-auto translate-y-[120px] transition duration-300 text-xl ${
              query && "!translate-y-0"
            }`}
          >
            <h1
              className={`absolute -top-14 md:-top-6 left-0 right-0  text-white text-center font-medium text-2xl ${
                query ? "opacity-0 invisible" : "opacity-100 visible"
              } transition duration-500`}
            >
              Find your favourite movies, TV shows, people and more
            </h1>
            <SearchBox autoFocus />
          </div>

          {!query && (
            <div className="flex justify-center items-center mt-[250px]">
              <LazyLoadImage
                alt="search-img"
                src="/girl.jpg"
                effect="opacity"
                className="max-w-[700px] w-[80vw] object-cover rounded-xl"
              />
            </div>
          )}

          {query && (
            <div className="shrink-0 md:hidden md:max-w-[310px] w-full md:pt-32 pt-[104px] px-3">
              <div
                ref={parent}
                className="px-4 pt-3 bg-dark rounded-md shadow-md border border-gray-light"
              >
                <div className="flex justify-between items-center text-white pb-3 ">
                  <p className="text-lg">Search Results</p>
                  <button onClick={() => setOpenSearchFilter((prev) => !prev)}>
                    {openSearchFilter && <FiChevronDown size={20} />}
                    {!openSearchFilter && <FiChevronRight size={20} />}
                  </button>
                </div>
                {openSearchFilter && (
                  <ul className="flex flex-row gap-3 py-2 border-t border-gray-light text-white text-lg">
                    {filterOptions?.map((filterOption) => (
                      <li key={filterOption.id} className="flex-1">
                        <button
                          onClick={() => {
                            setSearchParams({ query: query ?? "", page: "1" });
                            setCurrentTab(filterOption.value);
                          }}
                          className={`py-1 w-full rounded-md transition duration-300 hover:bg-dark-light ${
                            currentTab === filterOption.value &&
                            "bg-dark-lighten"
                          }`}
                        >
                          {filterOption.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {query && (
            <SearchResult
              currentTab={currentTab}
              query={query}
              page={page as number}
            />
          )}
        </div>

        <div className="shrink-0 hidden md:block md:max-w-[310px] w-full md:pt-32 pt-[104px] px-3 ">
          <div
            ref={parent}
            className="px-4 pt-3 bg-dark rounded-md shadow-md border border-gray-light md:rounded-none"
          >
            <div className="flex justify-between items-center text-white pb-3">
              <p className="text-lg">Search Results</p>
              <button onClick={() => setOpenSearchFilter((prev) => !prev)}>
                {openSearchFilter && <FiChevronDown size={20} />}
                {!openSearchFilter && <FiChevronRight size={20} />}
              </button>
            </div>
            {openSearchFilter && (
              <ul className="flex flex-row md:flex-col gap-3 py-2 border-t border-gray-light text-white text-lg">
                {filterOptions?.map((filterOption) => (
                  <li key={filterOption.id} className="flex-1">
                    <button
                      onClick={() => {
                        setSearchParams({ query: query ?? "", page: "1" });
                        setCurrentTab(filterOption.value);
                      }}
                      className={`py-1 w-full rounded-md md:rounded-sm transition duration-300 hover:bg-dark-light ${
                        currentTab === filterOption.value && "bg-dark-lighten"
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Search;
