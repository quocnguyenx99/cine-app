import { useEffect, useState } from "react";
import { db } from "../shared/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import type { Item } from "../shared/types";
import { useAppSelector } from "../store/hooks";

import Footer from "../components/Footer/Footer";
import BookmarkHistoryList from "../components/BookmarkHistoryList";

function History() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [recentlyWatchFilms, setRecentlyWatchFilms] = useState<Item[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  console.log("history data get: ", { recentlyWatchFilms, isLoading });

  useEffect(() => {
    if (!currentUser) return;
    const unsubDoc = onSnapshot(
      doc(db, "users", currentUser?.uid),
      (doc) => {
        setRecentlyWatchFilms(doc.data()?.recentlyWatch?.slice().reverse());
        setIsLoading(false);
      },
      (error) => {
        alert(error);
        setRecentlyWatchFilms([]);
        setIsLoading(false);
        setIsError(true);
      }
    );

    return () => unsubDoc();
  }, [currentUser]);

  if (isError) return <div>ERROR</div>;

  return (
    <>
      <BookmarkHistoryList
        films={recentlyWatchFilms}
        isLoading={isLoading}
        pageType={"history"}
      />
      <Footer />
    </>
  );
}

export default History;
