import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db, auth } from "../../shared/firebase";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { AiOutlineMail } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiLockPasswordLine } from "react-icons/ri";

import { getRandomAvatar, convertErrorCodeToMessage } from "../../shared/utils";
import { useAppSelector } from "../../store/hooks";

import ModalNotification from "./ModalNotification";
import { signInWithProvider } from "./signInWithProvider";

interface SignUpProps {
  setIsShowSignInBox: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignUp({ setIsShowSignInBox }: SignUpProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signUpHandler = async (values: { [key: string]: string }) => {
    try {
      setIsLoading(true);
      //   get user info when sign-up with password
      const result = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const user = result.user;

      const userRef = doc(db, "users", user.uid);

      setDoc(userRef, {
        firstName: values.firstName,
        lastName: values.lastName,
        photoUrl: getRandomAvatar(),
        bookmarks: [],
        recentlyWatch: [],
      });
    } catch (error: any) {
      setError(convertErrorCodeToMessage(error.code || error.message));
    }

    setIsLoading(false);
  };

  return (
    <>
      {currentUser && (
        <ModalNotification type="success" message={"Sign up successfully"} />
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
            <div className="mb-2 uppercase tracking-wider text-2xl font-medium">
              Start for free
            </div>
            <div className="mb-4 leading-none text-primary">Create Account</div>
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

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(15, "Must be 15 characters or less")
              .required("Required"),
            lastName: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(6, "Must be 6 characters or more.")
              .required("Required"),
          })}
          onSubmit={signUpHandler}
        >
          <Form>
            <div className="flex justify-between  mb-6 md:justify-between md:gap-0">
              {/* First Name */}
              <div className="relative">
                <Field
                  name="firstName"
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="w-full px-5 py-4 pr-12 rounded-md bg-dark text-white outline-none peer"
                />

                <label
                  htmlFor="firstName"
                  className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
                >
                  First name
                </label>

                <AiOutlineUser
                  size={25}
                  className="absolute top-1/2 right-4 -translate-y-1/2"
                />

                <p className="text-red-600">
                  <ErrorMessage name="firstName" />
                </p>
              </div>

              {/* Last Name */}
              <div className="relative">
                <Field
                  name="lastName"
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  className="flex-grow px-5 py-4 pr-12 rounded-md bg-dark text-white outline-none peer"
                />

                <label
                  htmlFor="lastName"
                  className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
                >
                  Last name
                </label>

                <AiOutlineUser
                  size={25}
                  className="absolute top-1/2 right-4 -translate-y-1/2"
                />

                <p className="text-red-600">
                  <ErrorMessage name="lastName" />
                </p>
              </div>
            </div>
            {/* Email */}
            <div className="relative mb-6">
              <Field
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

              <p className="text-red-600">
                <ErrorMessage name="email" />
              </p>
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <Field
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
              <p className="text-red-600">
                <ErrorMessage name="password" />
              </p>
            </div>
            <button
              type="submit"
              className="absolute left-1/2 -translate-x-1/2 px-12 py-3 rounded-full bg-primary text-white text-lg uppercase hover:bg-[#4161cc] transition duration-300"
            >
              Register
            </button>
          </Form>
        </Formik>

        <p className="text-xl flex gap-2 mt-32 justify-center">
          <span>Already a member?</span>
          <button
            onClick={() => setIsShowSignInBox(true)}
            className="text-primary/90 underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </>
  );
}

export default SignUp;
