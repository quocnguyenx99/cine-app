import { useState } from "react";
import { auth } from "../../shared/firebase";
import { signOut } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { AiOutlineHistory, AiOutlineHome } from "react-icons/ai";
import { BiSearch, BiUserCircle } from "react-icons/bi";
import { BsBookmarkHeart } from "react-icons/bs";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { MdOutlineExplore } from "react-icons/md";

import { useAppSelector } from "../../store/hooks";
import { useCurrentViewport } from "../../hooks/useCurrentViewport";

interface SidebarProps {
  isSidebarActive: boolean;
  onCloseSidebar: () => void;
}

function Sidebar({ isSidebarActive, onCloseSidebar }: SidebarProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useCurrentViewport();
  const [isLoading, setIsLoading] = useState(false);

  const signOutHandler = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        toast.success("Sign out successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2500);
      })
      .catch((error) => alert(error.message))
      .finally(() => setIsLoading(false));
  };

  const personalPageHandler = (destinationUrl: string) => {
    if (!currentUser) {
      toast.info("You need to login to use this feature", {
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

    navigate(destinationUrl);
  };

  return (
    <>
      <ToastContainer />

      {isLoading && (
        <div className="z-10 tw-flex-center fixed top-0 left-0 w-full h-full">
          <div className="w-28 h-28 border-[10px] rounded-full border-primary border-t-transparent animate-spin "></div>
        </div>
      )}
      {/* Sidebar for Mobile first */}
      <nav
        className={`fixed z-50 h-screen top-0 pt-8 pl-8 w-[70vw] shrink-0 shadow-md bg-dark-lighten -translate-x-full  transition duration-300 md:sticky md:max-w-[260px] md:translate-x-0 md:bg-transparent md:shadow-none ${
          isSidebarActive && "translate-x-0"
        }`}
      >
        {!isMobile && (
          <Link to={"/"}>
            <p className="text-2xl text-white font-medium tracking-wider uppercase">
              Cine <span className="px-2 py-1 bg-primary">Hub</span>
            </p>
          </Link>
        )}

        <h2
          className={`${
            isSidebarActive ? "-mt-6" : "mt-12"
          } text-white font-medium text-lg`}
        >
          MENU
        </h2>
        <ul className="flex flex-col gap-6 mt-8 ml-4 ">
          <li>
            <Link
              to="/"
              className={`flex gap-6 items-center hover:text-white transition duration-300 ${
                location.pathname === "/" &&
                "border-r-4 border-primary text-primary font-medium"
              }`}
            >
              <AiOutlineHome size={25} />
              <p>Home</p>
            </Link>
          </li>

          <li>
            <Link
              to="/explore"
              className={`flex gap-6 items-center hover:text-white transition duration-300 ${
                location.pathname === "/explore" &&
                "border-r-4 border-primary text-primary font-medium"
              }`}
            >
              <MdOutlineExplore size={25} />
              <p>Explore</p>
            </Link>
          </li>

          <li>
            <Link
              to="/search"
              className={`flex gap-6 items-center hover:text-white transition duration-300 ${
                location.pathname === "/search" &&
                "border-r-4 border-primary text-primary font-medium"
              }`}
            >
              <BiSearch size={25} />
              <p>Search</p>
            </Link>
          </li>
        </ul>

        <h2 className={"text-white font-medium text-lg mt-12"}>PERSONAL</h2>
        <ul className="flex flex-col gap-6 mt-8 ml-4 ">
          <li>
            <button
              onClick={() => personalPageHandler("/bookmarked")}
              className={`flex gap-6 items-center hover:text-white w-full transition duration-300 ${
                location.pathname === "/bookmarked" &&
                "border-r-4 border-primary text-primary font-medium"
              }`}
            >
              <BsBookmarkHeart size={25} />
              <p>Bookmark</p>
            </button>
          </li>

          <li>
            <button
              onClick={() => personalPageHandler("/history")}
              className={`flex gap-6 items-center hover:text-white w-full transition duration-300 ${
                location.pathname === "/history" &&
                "border-r-4 border-primary text-primary font-medium"
              }`}
            >
              <AiOutlineHistory size={25} />
              <p>History</p>
            </button>
          </li>
        </ul>

        <h2 className={"text-white font-medium text-lg mt-12"}>GENERAL</h2>
        <div className="flex flex-col gap-6 mt-8 ml-4 ">
          <button
            onClick={() => personalPageHandler("/profile")}
            className={`flex gap-6 items-center hover:text-white transition duration-300 ${
              location.pathname === "/profile" &&
              "border-r-4 border-primary text-primary font-medium"
            }`}
          >
            <BiUserCircle size={25} />
            <p>Profile</p>
          </button>

          {!currentUser && (
            <Link
              to={`/auth/?redirect=${encodeURIComponent(location.pathname)}`}
              className="flex gap-5 items-center hover:text-white transition duration-300"
            >
              <HiOutlineLogin size={25} />
              <p>Login</p>
            </Link>
          )}

          {currentUser && (
            <button
              onClick={signOutHandler}
              className="flex gap-5 items-center hover:text-white transition duration-300"
            >
              <HiOutlineLogout size={25} />
              <p>Logout</p>
            </button>
          )}
        </div>
      </nav>
      {/* Overflow */}
      <div
        onClick={onCloseSidebar}
        className={`fixed z-5 top-0 left-0 w-full h-full bg-black/60 transition duration-300 md:opacity-0 ${
          isSidebarActive ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>
    </>
  );
}

export default Sidebar;
