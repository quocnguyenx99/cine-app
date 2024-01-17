import { AiOutlineHome, AiOutlineHistory } from "react-icons/ai";
import { BiSearch, BiUserCircle } from "react-icons/bi";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks";

function SidebarMini() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

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
    }
    navigate(destinationUrl);
  };

  return (
    <>
      <ToastContainer />

      <nav className="sticky top-0 shrink-0 flex flex-col justify-center items-center h-screen max-w-[80px] w-full py-8  ">
        <Link to={"/"}>
          <LazyLoadImage
            src="/CINE-1.png"
            alt="logo"
            effect="opacity"
            className="absolute top-[5%] left-[25%] w-10 h-10"
          />
        </Link>
        <ul className="flex flex-col  gap-7">
          <li>
            <Link
              to={"/"}
              className={`hover:text-white transition duration-300 ${
                location.pathname === "/" && "text-primary"
              } `}
            >
              <AiOutlineHome size={25} />
            </Link>
          </li>
          <li>
            <Link
              to={"/explore"}
              className={`hover:text-white transition duration-300 ${
                location.pathname === "/explore" && "text-primary"
              } `}
            >
              <MdOutlineExplore size={25} />
            </Link>
          </li>
          <li>
            <Link
              to={"/search"}
              className={`hover:text-white transition duration-300 ${
                location.pathname === "/search" && "text-primary"
              } `}
            >
              <BiSearch size={25} />
            </Link>
          </li>
          <li>
            <button
              onClick={() => personalPageHandler("/bookmarked")}
              className={`hover:text-white transition duration-300 ${
                location.pathname === "/bookmarked" && "text-primary"
              } `}
            >
              <BsBookmarkHeart size={25} />
            </button>
          </li>
          <li>
            <button
              onClick={() => personalPageHandler("/history")}
              className={`hover:text-white transition duration-300 ${
                location.pathname === "/history" && "text-primary"
              } `}
            >
              <AiOutlineHistory size={25} />
            </button>
          </li>
          <li>
            <button
              onClick={() => personalPageHandler("/profile")}
              className={`hover:text-white transition duration-300 ${
                location.pathname === "/profile" && "text-primary"
              } `}
            >
              <BiUserCircle size={25} />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default SidebarMini;
