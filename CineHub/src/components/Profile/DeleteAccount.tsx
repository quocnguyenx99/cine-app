import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import BlackBackdrop from "../Common/BlackBackdrop";

interface DeleteAccountProps {
  onShowPromptReAuthForDeleteAccount: () => void;
}

function DeleteAccount({
  onShowPromptReAuthForDeleteAccount,
}: DeleteAccountProps) {
  const [isShowPrompt, setIsShowPrompt] = useState(false);
  return (
    <>
      {isShowPrompt && (
        <>
          <div className="fixed top-[30%] left-[5%] right-[5%] bg-dark rounded-md md:left-1/2 md:-translate-x-1/2 md:w-[390px] z-50 min-h-[100px] shadow-md px-3 py-5 text-center">
            <div className="mx-auto mb-7 h-16 w-16 rounded-full border-[3px] border-red-500 tw-flex-center">
              <AiOutlineDelete size={25} className="text-red-500" />
            </div>
            <p className="text-gray-txt text-xl  font-medium mb-4">
              You are about to delete this account
            </p>
            <p className=" mb-[2px]">
              This will remove your account and cannot recover
            </p>
            <p>Are you sure?</p>
            <div className="flex mt-8 justify-end gap-6">
              <button
                onClick={() => setIsShowPrompt(false)}
                className="px-6 py-1 rounded-md  bg-dark-lighten text-gray-txt hover:brightness-150 transition duration-300"
              >
                Cancle
              </button>
              <button
                onClick={() => {
                  onShowPromptReAuthForDeleteAccount();
                  setIsShowPrompt(false);
                }}
                className="px-6 py-1 bg-red-500 rounded-md  text-gray-txt hover:brightness-75 transition duration-300"
              >
                Yes
              </button>
            </div>
          </div>
          <BlackBackdrop onCloseBlackBackdrop={() => setIsShowPrompt(false)} />
        </>
      )}

      <div className="flex justify-center mt-12 mb-6">
        <button
          onClick={() => setIsShowPrompt(true)}
          className="px-5 py-2  border rounded-full md:rounded-none text-red-500 border-gray-lighten bg-dark hover:bg-red-500 hover:text-gray-txt hover:border-transparent transition duration-300"
        >
          Delete account
        </button>
      </div>
    </>
  );
}

export default DeleteAccount;
