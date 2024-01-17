import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { auth, db } from "./shared/firebase";
import { DocumentSnapshot, doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { useAppDispatch } from "./store/hooks";
import { setCurrentUser } from "./store/slice/authSlice";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import MovieInfo from "./pages/Movie/MovieInfo";
import TVInfo from "./pages/TVShow/TVInfo";
import MovieWatch from "./pages/Movie/MovieWatch";
import TVWatch from "./pages/TVShow/TVWatch";
import Search from "./pages/Search";
import Bookmarked from "./pages/Bookmarked";
import History from "./pages/History";
import Profile from "./pages/Profile";

import Protected from "./components/Common/Protected";
import Error from "./pages/Error";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isSignedIn, setIsSignedIn] = useState(
    Number(localStorage.getItem("isSignedIn")) ? true : false
  );

  useEffect(() => {
    let unSubDoc: () => void;
    const unSubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(setCurrentUser(null));
        setIsSignedIn(false);
        localStorage.setItem("isSignedIn", "0");
        return;
      }

      setIsSignedIn(true);
      localStorage.setItem("isSignedIn", "1");

      const handleUserSnapshot = (doc: DocumentSnapshot) => {
        dispatch(
          setCurrentUser({
            displayName:
              doc.data()?.lastName + " " + doc.data()?.firstName || "",
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: doc.data()?.photoUrl || "",
            uid: user.uid,
          })
        );
      };

      unSubDoc = onSnapshot(doc(db, "users", user.uid), handleUserSnapshot);
    });

    return () => {
      unSubDoc?.();
      unSubAuth();
    };
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname, location.search]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="movie/:id" element={<MovieInfo />} />
      <Route path="tv/:id" element={<TVInfo />} />
      <Route path="movie/:id/watch" element={<MovieWatch />} />
      <Route path="tv/:id/watch" element={<TVWatch />} />

      <Route path="explore" element={<Explore />} />
      <Route path="search" element={<Search />} />
      <Route
        path="bookmarked"
        element={
          <Protected isSignedIn={isSignedIn}>
            <Bookmarked />
          </Protected>
        }
      />
      <Route
        path="history"
        element={
          <Protected isSignedIn={isSignedIn}>
            <History />
          </Protected>
        }
      />
      <Route
        path="profile"
        element={
          <Protected isSignedIn={isSignedIn}>
            <Profile />
          </Protected>
        }
      />

      <Route path="auth" element={<Auth />} />
      <Route path="error" element={<Error />} />
    </Routes>
  );
}

export default App;
