import { FormEvent, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MdSend } from "react-icons/md";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../shared/firebase";

interface ReplyBoxProps {
  commentId: string;
}

function ReplyBox({ commentId }: ReplyBoxProps) {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [commentInputValue, setCommentInputValue] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);

  const commentSubmitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    setIsSendingComment(true);
    addDoc(collection(db, `replyTo-${commentId}`), {
      user: currentUser,
      value: commentInputValue.trim().slice(0, 500),
      createdAt: serverTimestamp(),
    }).finally(() => setIsSendingComment(false));
    setCommentInputValue("");
  };

  return (
    <form
      onSubmit={commentSubmitHandler}
      className="relative mt-4 flex items-center gap-4 z-20 mb-10 last:mb-0"
    >
      <LazyLoadImage
        alt="user-reply"
        src={currentUser?.photoURL as string}
        effect="opacity"
        className="w-11 h-11 rounded-full object-cover shrink-0"
      />
      <input
        type="text"
        placeholder="Write reply..."
        value={commentInputValue}
        onChange={(e) => setCommentInputValue(e.target.value)}
        className="flex-1 py-3 px-4 bg-dark text-gray-txt outline-none rounded-full md:rounded"
      />

      {isSendingComment ? (
        <div className="w-10 h-10 rounded-full border-[3px] border-t-transparent border-primary animate-spin"></div>
      ) : (
        <MdSend size={30} className="text-primary" />
      )}
    </form>
  );
}

export default ReplyBox;
