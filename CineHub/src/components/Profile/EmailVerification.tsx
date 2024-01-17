import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks";
import { auth } from "../../shared/firebase";
import BlackBackdrop from "../Common/BlackBackdrop";
import { User, sendEmailVerification } from "firebase/auth";

interface EmailVerificationProps {
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

function EmailVerification({ setIsUpdating }: EmailVerificationProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [isShowSentBtn, setIsShowSentBtn] = useState(false);

  const firebaseUser = auth.currentUser;
  const sendVerificationEmail = () => {
    setIsUpdating(true);
    sendEmailVerification(firebaseUser as User)
      .then(() => {
        setIsVerificationEmailSent(true);
        setIsShowSentBtn(true);
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
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

  return (
    <>
      <ToastContainer />

      {isVerificationEmailSent && (
        <>
          <div className="">
            <div className="px-5 py-3 rounded-md z-10 bg-dark md:w-[500px] fixed top-[35%] md:left-[35%] left-[5%] right-[5%] min-h-[150px]">
              <p className="text-gray-txt text-lg text-center">
                We've sent a email of verification to your email,
                <span className="text-primary"> {currentUser?.email}</span>.
                Check it out!
              </p>
              <button
                onClick={() => setIsVerificationEmailSent(false)}
                className="px-6 py-1 bg-dark-lighten rounded-full mt-7 tw-absolute-center-horizontal hover:brightness-75 transition duration-300"
              >
                OK
              </button>
            </div>
            <BlackBackdrop
              onCloseBlackBackdrop={() => setIsVerificationEmailSent(false)}
            />
          </div>
        </>
      )}

      <div className="mt-10 flex justify-between max-w-[600px]">
        <p className={`text-gray-txt text-lg font-medium`}>
          {currentUser?.emailVerified
            ? "Your email is verified."
            : "Your email is not verified yet."}
        </p>
        {!isShowSentBtn && !currentUser?.emailVerified && (
          <button
            onClick={sendVerificationEmail}
            className="text-primary underline text-lg"
          >
            Send me verification email
          </button>
        )}
        {isShowSentBtn && !currentUser?.email && (
          <p className="text-lg">Waiting for verify.</p>
        )}
      </div>
    </>
  );
}

export default EmailVerification;
