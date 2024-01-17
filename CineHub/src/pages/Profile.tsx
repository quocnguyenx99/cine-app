import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { convertErrorCodeToMessage } from "../shared/utils";
import { auth } from "../shared/firebase";
import Sidebar from "../components/Common/Sidebar";
import Footer from "../components/Footer/Footer";
import BlackBackdrop from "../components/Common/BlackBackdrop";
import ProfileImage from "../components/Profile/ProfileImage";
import { useRef, useState } from "react";
// import { useAppSelector } from "../store/hooks";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  // updateEmail,
  updatePassword,
  User,
} from "firebase/auth";
// import Email from "../components/Profile/Email";
import Name from "../components/Profile/Name";
import EmailVerification from "../components/Profile/EmailVerification";
import Password from "../components/Profile/Password";
import DeleteAccount from "../components/Profile/DeleteAccount";

function Profile() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  // const emailValueRef = useRef<HTMLInputElement>(null!);

  const [isUpdatedPassword, setIsUpdatedPassword] = useState(false);
  const oldPasswordValueRef = useRef<HTMLInputElement>(null!);
  const newPasswordValueRef = useRef<HTMLInputElement>(null!);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isShowPromptReAuthFor, setIsShowPromptReAuthFor] = useState<
    string | undefined
  >();

  const firebaseUser = auth.currentUser as User;

  const reAuthentication = async (type: string) => {
    const oldPassword = oldPasswordValueRef.current.value;

    if (!oldPassword.trim().length) {
      toast.error("You gotta type something", {
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

    const credential = EmailAuthProvider.credential(
      firebaseUser.email!,
      oldPassword
    );

    reauthenticateWithCredential(firebaseUser, credential)
      .then(() => {
        if (type === "password") {
          changePassword();
        } else if (type === "delete") {
          deleteAccount();
        }
        setIsShowPromptReAuthFor(undefined);
      })
      .catch((error) => {
        console.log(error);
        // alert(convertErrorCodeToMessage(error.code));
        toast.error(convertErrorCodeToMessage(error.code), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  // const changeEmail = () => {
  //   const emailValue = emailValueRef.current.value;
  //   setIsUpdating(true);
  //   updateEmail(firebaseUser!, emailValue)
  //     .then(() => {
  //       setIsUpdatingEmail(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error(`${error.message}`, {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     })
  //     .finally(() => setIsUpdating(false));
  // };

  const changePassword = () => {
    const passwordValue = newPasswordValueRef.current.value;
    setIsUpdating(true);
    updatePassword(firebaseUser, passwordValue)
      .then(() => {
        setIsUpdatedPassword(true);
        newPasswordValueRef.current.value = "";
      })
      .catch((error) => {
        console.log(error);
        toast.error(convertErrorCodeToMessage(error.code), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => setIsUpdating(false));
  };

  const deleteAccount = () => {
    setIsUpdating(true);
    deleteUser(firebaseUser).finally(() => {
      setIsUpdating(false);
    });
  };

  return (
    <>
      <ToastContainer />
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

      {isUpdating && (
        <>
          <div className="border-[8px] border-primary border-t-transparent h-32 w-32 rounded-full animate-spin fixed top-[40%] left-[40%] z-10"></div>
          <BlackBackdrop className={"!z-50"} />
        </>
      )}

      {isShowPromptReAuthFor && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              reAuthentication(isShowPromptReAuthFor);
            }}
            className="z-10 fixed md:w-[500px] md:min-h-[200px] min-h-[230px] top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 left-[5%] right-[5%] bg-dark rounded-md px-3 py-2"
          >
            <p className="text-gray-txt font-medium mb-6 text-lg text-center">
              Type your password again to reauthenticate
            </p>
            <input
              ref={oldPasswordValueRef}
              type="password"
              autoFocus
              placeholder="Enter your password..."
              className="px-5 py-3 mb-4 w-full bg-dark-light rounded-md text-gray-txt outline-none focus:outline-primary focus:outline-[1px]"
            />
            <button className="px-6 py-2 bg-dark-lighten rounded-xl hover:brightness-125 transition duration-300 text-gray-txt md:top-[130px] top-[160px] tw-absolute-center-horizontal">
              Continue
            </button>
          </form>
          <BlackBackdrop
            onCloseBlackBackdrop={() => setIsShowPromptReAuthFor(undefined)}
          />
        </>
      )}

      <div className="flex">
        <Sidebar
          isSidebarActive={isSidebarActive}
          onCloseSidebar={() => setIsSidebarActive(false)}
        />

        <div className="flex-grow pt-7 md:pl-10 px-3 ">
          <div className="pb-3">
            <h1 className="text-[35px] text-gray-txt font-semibold uppercase">
              Account Settings
            </h1>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-3 ">
            <div className="flex-grow px-4 py-4 md:border md:border-gray-light md:order-1">
              <h2 className="text-2xl font-medium text-gray-txt ">
                Edit Profile
              </h2>
              <div className="my-4 bg-dark border border-gray-light px-5 py-3 rounded-md md:rounded-none">
                <p className="text-gray-txt text-xl font-medium mb-2">
                  User Information
                </p>
                <div className="text-gray-txt-2">
                  <p>Here you can edit public information about yourself.</p>
                  <p>
                    If you signed in with Google or Facebook, you can't change
                    your email and password.
                  </p>
                </div>
              </div>

              <div className="">
                {/* <Email
                  isUpdatingEmail={isUpdatingEmail}
                  setIsUpdatingEmail={setIsUpdatingEmail}
                  emailValueRef={emailValueRef}
                  onShowPromptReAuthForEmail={() =>
                    setIsShowPromptReAuthFor("email")
                  }
                /> */}

                <Name setIsUpdating={setIsUpdating} />
                <Password
                  onShowPromptReAuthForPassword={() =>
                    setIsShowPromptReAuthFor("password")
                  }
                  isUpdatedPassword={isUpdatedPassword}
                  setIsUpdatedPassword={setIsUpdatedPassword}
                  newPasswordRef={newPasswordValueRef}
                />
              </div>

              <EmailVerification setIsUpdating={setIsUpdating} />

              <DeleteAccount
                onShowPromptReAuthForDeleteAccount={() =>
                  setIsShowPromptReAuthFor("delete")
                }
              />
            </div>

            <ProfileImage />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
