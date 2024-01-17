import { ToastContainer, toast } from "react-toastify";
import BlackBackdrop from "../Common/BlackBackdrop";

interface PasswordProps {
  onShowPromptReAuthForPassword: () => void;
  isUpdatedPassword: boolean;
  setIsUpdatedPassword: React.Dispatch<React.SetStateAction<boolean>>;
  newPasswordRef: React.MutableRefObject<HTMLInputElement>;
}

function Password({
  onShowPromptReAuthForPassword,
  isUpdatedPassword,
  setIsUpdatedPassword,
  newPasswordRef,
}: PasswordProps) {
  return (
    <>
      <ToastContainer />
      {isUpdatedPassword && (
        <>
          <div className="">
            <div className="px-5 py-3 rounded-md z-10 bg-dark md:w-[500px] fixed top-[35%] md:left-[35%] left-[5%] right-[5%] min-h-[150px]">
              <p className="text-gray-txt text-lg text-center">
                Updating password successfully
              </p>
              <button
                onClick={() => setIsUpdatedPassword(false)}
                className="px-6 py-1 bg-dark-lighten rounded-full mt-7 tw-absolute-center-horizontal hover:brightness-75 transition duration-300"
              >
                OK
              </button>
            </div>
            <BlackBackdrop
              onCloseBlackBackdrop={() => setIsUpdatedPassword(false)}
            />
          </div>
        </>
      )}

      <div className="mt-6 max-w-[600px]">
        <p className="text-gray-txt text-lg font-medium mb-3">
          Change password
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newPasswordRef.current.value.trim().length) {
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
            onShowPromptReAuthForPassword();
          }}
          className="flex gap-32"
        >
          <div className="flex-1">
            <input
              ref={newPasswordRef}
              type="password"
              placeholder="Enter new password..."
              className="bg-dark py-3 rounded-md md:rounded-none outline-none px-5 text-black w-full"
            />
          </div>
          <button className="px-5 py-2 rounded-xl md:rounded-none bg-dark border border-gray-lighten text-primary hover:bg-primary hover:border-transparent  transition duration-300 hover:text-gray-txt">
            Update
          </button>
        </form>
      </div>
    </>
  );
}

export default Password;
