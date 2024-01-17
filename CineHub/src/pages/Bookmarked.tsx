import { useEffect, useState } from "react";
import { db } from "../shared/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import type { Item } from "../shared/types";
import { useAppSelector } from "../store/hooks";

import Footer from "../components/Footer/Footer";
import BookmarkHistoryList from "../components/BookmarkHistoryList";
import { ToastContainer, toast } from "react-toastify";
import { convertErrorCodeToMessage } from "../shared/utils";

function Bookmarked() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [bookmaredFilms, setBookmarkedFilms] = useState<Item[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser?.uid);
    const unsubDoc = onSnapshot(
      userDocRef,
      (doc) => {
        setBookmarkedFilms(doc.data()?.bookmarks?.slice().reverse());
        setIsLoading(false);
      },
      (error) => {
        toast.error(convertErrorCodeToMessage(error.code), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setBookmarkedFilms([]);
        setIsLoading(false);
        setIsError(true);
      }
    );

    return () => unsubDoc();
  }, [currentUser]);

  if (isError) return <div>ERROR</div>;

  return (
    <>
      <ToastContainer />
      <BookmarkHistoryList
        films={bookmaredFilms}
        isLoading={isLoading}
        pageType={"bookmark"}
      />
      <Footer />
    </>
  );
}

export default Bookmarked;
