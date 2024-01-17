import {
  DocumentData,
  QueryDocumentSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAppSelector } from "../../../store/hooks";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AiOutlineDelete } from "react-icons/ai";
import { db } from "../../../shared/firebase";
import BlackBackdrop from "../../Common/BlackBackdrop";
import { BsThreeDots } from "react-icons/bs";

interface EditCommentProps {
  setEditingCommentFor: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  media_type: string;
  id: string | number | undefined;
  showOptionFor: string | undefined;
  setShowOptionFor: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCommentHidden: React.Dispatch<React.SetStateAction<string[]>>;
  singleDoc: QueryDocumentSnapshot<DocumentData>;
}

function EditComment({
  setEditingCommentFor,
  media_type,
  id,
  showOptionFor,
  setShowOptionFor,
  setCommentHidden,
  singleDoc,
}: EditCommentProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isShowPrompt, setIsShowPrompt] = useState(false);
  const [show] = useAutoAnimate();

  const renderDeleteCommentPrompt = (
    <>
      <div className="fixed top-[30%] md:left-[40%] md:right-auto left-[5%] right-[5%] md:w-[400px] z-50 bg-dark-light rounded-md min-h-[100px] shadow-md px-3 py-5">
        <div className="mx-auto mb-7 h-16 w-16 rounded-full border-[3px] border-red-500 tw-flex-center">
          <AiOutlineDelete size={40} className="text-red-500 " />
        </div>
        <p className="text-xl text-gray-txt text-center font-medium mb-4">
          You are about to remove this comment
        </p>
        <p className=" text-center mb-[2px]">
          This will remove your films and cannot recover
        </p>
        <p className="text-center ">Are you sure?</p>
        <div className="flex mt-8 justify-end gap-4">
          <button
            onClick={() => setIsShowPrompt(false)}
            className="px-4 py-1 rounded-md border border-transparent hover:border-gray-dark  hover:brightness-75  text-gray-txt transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              deleteDoc(doc(db, `${media_type}-${id}`, singleDoc.id))
            }
            className="px-6 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 transition duration-300"
          >
            Yes
          </button>
        </div>
      </div>
      <BlackBackdrop
        onCloseBlackBackdrop={() => setIsShowPrompt(false)}
        className="!z-40"
      />
    </>
  );

  return (
    <>
      {/* START SHOW PROMPT */}
      <div ref={show}>{isShowPrompt && renderDeleteCommentPrompt}</div>
      {/* END SHOW PROMPT */}

      <div className="relative z-[39]">
        <button
          onClick={() =>
            showOptionFor === singleDoc.id
              ? setShowOptionFor(undefined)
              : setShowOptionFor(singleDoc.id)
          }
          className="transition duration-300 mt-4 h-8 w-8 bg-transparent rounded-full tw-flex-center hover:bg-dark-light"
        >
          <BsThreeDots size={20} />
        </button>

        {showOptionFor === singleDoc.id && (
          <div className="absolute -left-8 w-[70px] flex flex-col gap-1 bg-dark-light rounded-md px-3 py-2 shadow-md">
            {currentUser && currentUser.uid === singleDoc.data()?.user.uid && (
              <>
                <button
                  onClick={() => {
                    setEditingCommentFor(singleDoc.id);
                    setShowOptionFor(undefined);
                  }}
                  className="transition duration-300 hover:text-white text-left"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setIsShowPrompt(true);
                    setShowOptionFor(undefined);
                  }}
                  className="transition duration-300 hover:text-white text-left"
                >
                  Delete
                </button>
              </>
            )}
            {(!currentUser ||
              currentUser.uid !== singleDoc.data()?.user.uid) && (
              <button
                onClick={() =>
                  setCommentHidden((prev: string[]) =>
                    prev.concat(singleDoc.id)
                  )
                }
                className="transition duration-300 hover:text-white "
              >
                Hide
              </button>
            )}
          </div>
        )}
      </div>

      {showOptionFor === singleDoc.id && (
        // transparent overlay to cancel show edit options
        <div
          onClick={() => setShowOptionFor(undefined)}
          className="fixed top-0 left-0 w-full h-full z-[35]"
        ></div>
      )}
    </>
  );
}

export default EditComment;
