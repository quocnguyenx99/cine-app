import { useState, useRef, FormEvent } from "react";
import { auth } from "../../shared/firebase";
import {
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

import { AiOutlineMail } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiLockPasswordLine } from "react-icons/ri";

import { convertErrorCodeToMessage } from "../../shared/utils";
import { useAppSelector } from "../../store/hooks";

import ModalNotification from "./ModalNotification";
import { signInWithProvider } from "./signInWithProvider";

interface SignInProps {
  setIsShowSignInBox: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignIn({ setIsShowSignInBox }: SignInProps) {
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signInHandler = (e: FormEvent) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user, "is sign-in successfull.");
      })
      .catch((error) => {
        setError(convertErrorCodeToMessage(error.code));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {/* test modal */}
      {/* <ModalNotification
        type="error"
        message="Fail"
        onCloseModal={() => setError("")}
      /> */}

      {currentUser && (
        <ModalNotification type="success" message="Sign in successfully" />
      )}
      {isLoading && (
        <div className="relative z-10 tw-flex-center h-screen">
          <div className="w-28 h-28 border-[10px] rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      {error && (
        <ModalNotification
          type="error"
          message={error}
          onCloseModal={() => setError("")}
        />
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-full min-h-[500px]  p-4 text-gray-txt ">
        <section className="tw-flex-center flex-col mb-5">
          <div className="mx-auto mb-1 text-center font-semibold text-5xl md:text-left">
            <div className="mb-4 leading-none text-primary">
              Sign In To CineHub
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() =>
                signInWithProvider(new GoogleAuthProvider(), "google")
              }
              className="tw-flex-center w-12 h-12 rounded-full bg-white border hover:border-gray-light hover:brightness-90 transition duration-300"
            >
              <FcGoogle size={25} />
            </button>
            <button
              onClick={() =>
                signInWithProvider(new FacebookAuthProvider(), "facebook")
              }
              className="tw-flex-center w-12 h-12 rounded-full bg-white border hover:border-gray-light hover:brightness-90 transition duration-300"
            >
              <FaFacebookF size={25} className={"text-primary"} />
            </button>
          </div>
          <p className="text-xl">or use your email account:</p>
        </section>

        <form onSubmit={signInHandler}>
          <div className="relative mb-6">
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-5 py-4 pr-12 rounded-md bg-dark text-white outline-none peer"
            />
            <label
              htmlFor="email"
              className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
            >
              Email
            </label>
            <AiOutlineMail
              size={25}
              className="absolute top-1/2 -translate-y-1/2 right-4"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 pr-12 rounded-md bg-dark text-white outline-none peer"
            />
            <label
              htmlFor="password"
              className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
            >
              Password
            </label>
            <RiLockPasswordLine
              size={25}
              className="absolute top-1/2 -translate-y-1/2 right-4"
            />
          </div>
          <button
            type="submit"
            className="absolute left-1/2 -translate-x-1/2 px-12 py-3 rounded-full bg-primary text-white text-lg uppercase hover:bg-[#4161cc] transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-xl flex gap-2 mt-32 justify-center">
          <span>Not a member?</span>
          <button
            onClick={() => setIsShowSignInBox(false)}
            className="text-primary/90 underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}

export default SignIn;
