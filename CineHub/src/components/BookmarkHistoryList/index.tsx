import type { Item } from "../../shared/types";
import { db } from "../../shared/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAppSelector } from "../../store/hooks";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiSelectMultiple } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

import Sidebar from "../Common/Sidebar";
import Skeleton from "../Common/Skeleton";
import BlackBackdrop from "../Common/BlackBackdrop";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import BookmarkResult from "../Bookmark/BookmarkResult";
import { toast, ToastContainer } from "react-toastify";

interface BookmarkHistoryListProps {
  films: Item[] | undefined;
  isLoading: boolean;
  pageType: string;
}

function BookmarkHistoryList({
  films,
  isLoading,
  pageType,
}: BookmarkHistoryListProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isShowPrompt, setIsShowPrompt] = useState(false);

  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selections, setSelections] = useState<number[]>([]);

  const [parent] = useAutoAnimate();
  const [show] = useAutoAnimate();
  const [tab] = useAutoAnimate();

  const [currentTab, setCurrentTab] = useState(
    localStorage.getItem("bookmarkCurrentTab") || "all"
  );

  const tabs = [
    { label: "All", value: "all", id: 1 },
    { label: "TV Show", value: "tv", id: 2 },
    { label: "Movie", value: "movie", id: 3 },
  ];

  const selectAllHandle = () => {
    if (isSelectAll) {
      setSelections([]);
      setIsSelectAll(false);
      return;
    }

    setIsSelectAll(true);

    if (currentTab === "all") {
      setSelections(films?.map((film) => film.id) || []);
    } else if (currentTab === "movie") {
      setSelections(
        films
          ?.filter((film) => film.media_type === "movie")
          .map((film) => film.id) || []
      );
    } else if (currentTab === "tv") {
      setSelections(
        films
          ?.filter((film) => film.media_type === "tv")
          .map((film) => film.id) || []
      );
    }
  };

  const clearSelection = () => {
    if (!currentUser) return;

    const editedFilms = films?.filter(
      (film) => selections.indexOf(film.id) === -1
    );

    updateDoc(doc(db, "users", currentUser.uid), {
      ...(pageType === "bookmark" && { bookmarks: editedFilms?.reverse() }),
      ...(pageType === "history" && { recentlyWatch: editedFilms?.reverse() }),
    });

    setSelections([]);
    setIsSelectAll(false);
    setIsShowPrompt(false);
  };

  const promptContent = (
    <>
      <div className="fixed top-[30%] md:left-[40%] left-[5%] right-[5%] z-40 px-3 py-5 shadow-md w-full max-w-[350px] md:max-w-[420px]  bg-dark-light rounded-md min-h-[100px]">
        <div className="mx-auto mb-7 h-16 w-16 rounded-full border-[3px] border-red-500 tw-flex-center">
          <AiOutlineDelete size={40} className="text-red-500" />
        </div>

        <h2 className="mb-4 text-white text-center font-medium text-xl">
          {`You are about to remove ${
            selections.length < 1 ? "this film." : "these films."
          }`}
        </h2>

        <p className="text-center mb-[2px]">
          This will remove your films from this {pageType} list.
        </p>
        <p className="text-center ">Are you sure?</p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setIsShowPrompt(false)}
            className="px-4 py-1 rounded-md text-white border border-transparent hover:border-gray-lighten hover:brightness-150 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={clearSelection}
            className="px-6 py-1 rounded-md text-white bg-red-500 hover:brightness-75 transition duration-300"
          >
            Yes
          </button>
        </div>
      </div>
      <BlackBackdrop
        className="!z-30"
        onCloseBlackBackdrop={() => setIsShowPrompt(false)}
      />
    </>
  );

  return (
    <>
      <ToastContainer />
      {/* START WARNING PROMT */}
      <div ref={show}>
        {isShowPrompt && selections.length > 0 && promptContent}
      </div>
      {/* END WARNING PROMT */}

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

      {/* START USER INFO */}
      <div className="absolute top-4 right-5 hidden md:flex gap-6 items-center ">
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
      {/* END USER INFO */}

      {/* START MAIN CONTENT */}
      <div className="flex">
        <Sidebar
          isSidebarActive={isSidebarActive}
          onCloseSidebar={() => setIsSidebarActive((prev) => !prev)}
        />

        <div className="flex-grow px-[2vw] pb-16 pt-7 min-h-screen">
          <h1 className="text-white font-semibold text-[35px] uppercase mb-4 ">
            {pageType === "bookmark" ? "My favorite films" : "Films I Watched"}
          </h1>

          <div
            ref={tab}
            className="flex flex-col md:flex-row items-start md:items-end gap-5 md:justify-between mb-8"
          >
            <ul className="inline-flex gap-[30px] pb-[14px]  relative">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(tab.value);
                      localStorage.setItem("bookmarkCurrentTab", tab.value);
                    }}
                    className={`${
                      currentTab === tab.value &&
                      `text-white font-medium after:absolute after:bottom-0 ${
                        tab.value === "all"
                          ? "after:left-0"
                          : tab.value === "tv"
                          ? "after:left-[38%]"
                          : "after:right-[5%]"
                      } after:bg-white after:h-[3px] after:w-5`
                    } transition duration-300 hover:text-white`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            {!isEditing && (
              <div className="flex gap-5 self-end  border border-gray-dark px-3 py-1 rounded-md md:rounded-none">
                <button
                  onClick={() => setIsEditing(true)}
                  className="self-end flex items-center gap-2 text-lg font-medium hover:text-primary transition duration-300 "
                >
                  <AiOutlineEdit size={25} />
                  Edit
                </button>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-5 self-end px-3 py-2 border border-gray-light rounded-md md:rounded-none">
                <button
                  onClick={selectAllHandle}
                  className={`flex gap-2 items-center text-lg font-medium hover:text-primary transition duration-300 ${
                    isSelectAll ? "text-primary" : ""
                  }`}
                >
                  <BiSelectMultiple size={25} />
                  Select all
                </button>
                <button
                  onClick={() => {
                    setIsShowPrompt(true);
                    if (selections.length === 0) {
                      toast.warning(
                        "You should select films before deleting them!",
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
                    }
                  }}
                  // disabled={selections.length === 0}
                  className={`flex gap-2 items-center text-lg font-medium hover:text-red-500 transition duration-300}`}
                >
                  <AiOutlineDelete size={25} />
                  Clear
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`flex gap-2 items-center text-lg font-medium hover:text-green-400 transition duration-300}`}
                >
                  <MdOutlineCancel size={25} />
                  Cancel
                </button>
              </div>
            )}
          </div>
          <ul
            ref={parent}
            className={`grid grid-cols-sm md:grid-cols-lg gap-x-8 gap-y-10 ${
              isEditing && "!gap-y-16"
            }`}
          >
            {isLoading &&
              [...new Array(12)].map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-0 pb-[160%]" />
                </li>
              ))}

            {currentTab === "all" && (
              <BookmarkResult
                films={films}
                isEditing={isEditing}
                selections={selections}
                setSelections={setSelections}
                isLoading={isLoading}
                pageType={pageType}
              />
            )}

            {currentTab === "movie" && (
              <BookmarkResult
                films={films?.filter((film) => film.media_type === "movie")}
                isEditing={isEditing}
                selections={selections}
                setSelections={setSelections}
                isLoading={isLoading}
                pageType={pageType}
              />
            )}

            {currentTab === "tv" && (
              <BookmarkResult
                films={films?.filter((film) => film.media_type === "tv")}
                isEditing={isEditing}
                selections={selections}
                setSelections={setSelections}
                isLoading={isLoading}
                pageType={pageType}
              />
            )}
          </ul>
        </div>
      </div>

      {/* END MAIN CONTENT */}
    </>
  );
}

export default BookmarkHistoryList;
