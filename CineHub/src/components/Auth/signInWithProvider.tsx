import { auth, db } from "../../shared/firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";

type AuthProvider = GoogleAuthProvider | FacebookAuthProvider;

export const signInWithProvider = (provider: AuthProvider, type: string) => {
  signInWithPopup(auth, provider).then(async (result) => {
    // The signed-in user info
    const user = result.user;

    // Check if user info is already stored in Firestore
    let isStored = false;

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.id === user.uid) {
        isStored = true;
      }
    });

    if (isStored) return;

    let accessToken;
    if (type === "facebook") {
      const credential = FacebookAuthProvider.credentialFromResult(result);
      accessToken = credential?.accessToken;
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      firstName: user.displayName,
      lastName: "",
      ...(type === "google" && { photoUrl: user.photoURL }),
      ...(type === "facebook" && {
        photoUrl: user.photoURL + "?access_token" + accessToken,
      }),
      bookmarked: [],
      recentlyWatched: [],
      ...(type === "facebook" && { accessToken }),
    });
  });
};
