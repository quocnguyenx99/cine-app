import { Fragment, useRef, useState } from "react";
import { db } from "../../../shared/firebase";
import {
  DocumentData,
  QuerySnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { MdSend } from "react-icons/md";
import { AiFillHeart, AiTwotoneLike } from "react-icons/ai";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { FaAngry, FaSadTear, FaSurprise } from "react-icons/fa";

import { useAppSelector } from "../../../store/hooks";
import { calculateTimePassed } from "../../../shared/utils";
import { reactionColorForTailwindCSS } from "../../../shared/contants";

import type { User } from "../../../shared/types";
import ReactionInfo from "./ReactionInfo";
import ReplyBox from "./ReplyBox";
import ReplyList from "./ReplyList";
import EditComment from "./EditComment";

interface CommentUserContentProps {
  commentData: QuerySnapshot<DocumentData> | null;
  commentLimit: number;
  media_type: string;
  sortType: string;
  id?: number | string;
  role: string;
}

export type CommentDataType = {
  user: User;
  value: string;
  reactions: { [key: string]: string };
  createdAt: {
    seconds: number;
    nanoSeconds: number;
  };
  isEdited: boolean;
};

function CommentUserContent({
  commentData,
  commentLimit,
  media_type,
  sortType,
  id,
  role,
}: CommentUserContentProps) {
  const [parent] = useAutoAnimate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [commentHiden, setCommentHiden] = useState<string[]>([]);
  const [showOptionFor, setShowOptionFor] = useState<string | undefined>(
    undefined
  );

  const [editCommentFor, setEditCommentFor] = useState<string | undefined>();
  const editValueRef = useRef<HTMLInputElement>(null!);
  const [isReplyingFor, setIsReplyingFor] = useState<string | undefined>();

  const sortComment = (
    commentData: QuerySnapshot<DocumentData> | null,
    type: string
  ) => {
    if (!commentData) return undefined;

    if (type === "popular")
      return commentData.docs
        .slice()
        .sort(
          (a, b) =>
            Object.values(b.data()?.reactions).length -
            Object.values(a.data()?.reactions).length
        );

    if (type === "latest") return commentData.docs;
  };

  const addReaction = (commentId: string, value: string) => {
    if (!currentUser) return;

    updateDoc(doc(db, `${media_type}-${id as number}`, commentId), {
      [`reactions.${currentUser.uid}`]: value,
    });
  };

  const determineReactionText = (reactions: { [key: string]: string }) => {
    if (reactions === null || reactions === undefined) {
      return {
        ableToCancelReaction: false,
        value: "Reaction",
        color: "text-inherit",
      };
    }
    const userReactionValue = Object.entries(reactions).find(
      (entry) => entry[0] === (currentUser as User).uid
    )?.[1];

    if (!userReactionValue)
      return {
        ableToCancelReaction: false,
        value: "Reaction",
        color: "text-inherit",
      };

    return {
      ableToCancelReaction: true,
      value: userReactionValue[0].toUpperCase() + userReactionValue.slice(1),
      color:
        reactionColorForTailwindCSS[
          userReactionValue as keyof typeof reactionColorForTailwindCSS
        ],
    };
  };

  const removeReaction = (docData: CommentDataType, commentId: string) => {
    const filteredReactionUsers = Object.entries(docData.reactions).filter(
      (entry) => entry[0] !== (currentUser?.uid as string)
    );

    const updatedReactionUserObj = filteredReactionUsers.reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: curr[1],
      }),
      {} as { [key: string]: string }
    );

    updateDoc(doc(db, `${media_type}-${id as number}`, commentId), {
      reactions: updatedReactionUserObj,
    });
  };

  const handleEditComment = (commentId: string) => {
    const editText = editValueRef.current.value;

    if (!editText.trim()) return;

    updateDoc(doc(db, `${media_type}-${id}`, commentId), {
      value: editText,
      isEdited: true,
    });

    setEditCommentFor(undefined);
  };

  const renderEditCommentForm = (docId: string, docData: CommentDataType) => (
    <>
      <form
        className="flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleEditComment(docId);
        }}
      >
        <input
          onKeyDown={(e) => {
            if (e.key === "Escape") setEditCommentFor(undefined);
          }}
          type="text"
          ref={editValueRef}
          defaultValue={docData.value}
          className="w-full bg-dark-light outline-none py-1 px-2 rounded-md md:rounded mt-1 text-lg text-gray-txt"
          autoFocus
        />

        <button>
          <MdSend size={25} className="text-primary" />
        </button>
      </form>
      <p className="mt-1 text-sm ">Press Esc to cancel</p>
    </>
  );

  const renderReactionList = (docId: string) => {
    return Object.entries(reactionColorForTailwindCSS).map(
      (reactionEntry, index) => {
        const iconProps = {
          className: `hover:scale-125 transition duration-30 ${reactionEntry[1]}`,
          size: 20,
        };

        switch (reactionEntry[0]) {
          case "like":
            return (
              <button
                key={index}
                onClick={() => addReaction(docId, reactionEntry[0])}
              >
                <AiTwotoneLike {...iconProps} />
              </button>
            );
          case "love":
            return (
              <button
                key={index}
                onClick={() => addReaction(docId, reactionEntry[0])}
              >
                <AiFillHeart {...iconProps} />
              </button>
            );
          case "haha":
            return (
              <button
                key={index}
                onClick={() => addReaction(docId, reactionEntry[0])}
              >
                <BsEmojiLaughingFill {...iconProps} />
              </button>
            );
          case "wow":
            return (
              <button
                key={index}
                onClick={() => addReaction(docId, reactionEntry[0])}
              >
                <FaSurprise {...iconProps} />
              </button>
            );
          case "sad":
            return (
              <button
                key={index}
                onClick={() => addReaction(docId, reactionEntry[0])}
              >
                <FaSadTear {...iconProps} />
              </button>
            );
          case "angry":
            return (
              <button
                key={index}
                onClick={() => addReaction(docId, reactionEntry[0])}
              >
                <FaAngry {...iconProps} />
              </button>
            );
          default:
            return null;
        }
      }
    );
  };

  return (
    <ul ref={parent}>
      {sortComment(commentData, sortType)
        ?.slice(0, commentLimit)
        .map((doc) => {
          const docData = doc.data() as CommentDataType;

          return (
            <Fragment key={doc.id}>
              {!commentHiden.includes(doc.id) && (
                <li
                  key={doc.id}
                  className="mb-6 flex md:gap-4 gap-2 items-start last:mb-0 md:px-4"
                >
                  {/* USER AVATAR */}
                  <div className="w-[44px] h-[44px] shrink-0">
                    <LazyLoadImage
                      src={docData.user.photoURL as string}
                      alt=""
                      effect="opacity"
                      className="w-11 h-11 rounded-full object-cover "
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* COMMENT CONTENT */}
                  <div
                    className={`peer ${editCommentFor === doc.id && "flex-1"}`}
                  >
                    {/* START REACTION LIST, DISPLAYNAME, COMMENT VALUE */}
                    <div
                      className={`relative bg-dark px-4 py-2 rounded-2xl md:rounded ${
                        editCommentFor === doc.id ? "block" : "inline-block"
                      }`}
                    >
                      <ReactionInfo docData={docData} />

                      <p className="font-medium text-gray-txt">
                        {docData.user.displayName}
                      </p>

                      {editCommentFor !== doc.id ? (
                        <p
                          className="text-base md:text-lg   mt-1 max-w-[63vw] md:max-w-none"
                          style={{ wordWrap: "break-word" }}
                        >
                          {docData.value}
                        </p>
                      ) : (
                        renderEditCommentForm(doc.id, docData)
                      )}
                    </div>
                    {/* END TOP REACTION, DISPLAYNAME, COMMENT VALUE */}

                    {/* START CURRENT REACTION TEXT, REPLY BTN, REPLY BOX FORM, COMMENT FOR LIST */}
                    <div className="flex gap-3 mt-3 items-center">
                      {currentUser && (
                        <div className="relative group ">
                          <button
                            {...(determineReactionText(docData.reactions)
                              .ableToCancelReaction && {
                              onClick: () => removeReaction(docData, doc.id),
                            })}
                            className={`${
                              determineReactionText(docData.reactions).color
                            }`}
                          >
                            {determineReactionText(docData.reactions).value}
                          </button>

                          <div className="group-hover:opacity-100 group-hover:visible opacity-0 invisible bg-dark-light transition duration-300 shadow-md px-2 py-2 rounded-full absolute -top-8 -right-[105px] flex gap-2 z-40">
                            {renderReactionList(doc.id)}
                          </div>
                        </div>
                      )}

                      {role !== "reply" && (
                        <button
                          className="hover:text-white transition duration-300"
                          onClick={() => {
                            if (!currentUser) return;
                            if (isReplyingFor !== doc.id) {
                              setIsReplyingFor(doc.id);
                            } else {
                              setIsReplyingFor(undefined);
                            }
                          }}
                        >
                          Reply
                        </button>
                      )}

                      <p className="text-sm">
                        {calculateTimePassed(
                          docData.createdAt?.seconds * 1000 || 0
                        )}
                      </p>
                      {docData.isEdited && <p className="text-sm">Edited</p>}
                    </div>
                    {isReplyingFor === doc.id && (
                      <ReplyBox commentId={doc.id} />
                    )}
                    <ReplyList commentId={doc.id} />
                  </div>

                  {/* EDIT, DELETE, HIDE COMMENTS */}

                  <EditComment
                    setEditingCommentFor={setEditCommentFor}
                    media_type={media_type}
                    id={id}
                    showOptionFor={showOptionFor}
                    setShowOptionFor={setShowOptionFor}
                    setCommentHidden={setCommentHiden}
                    singleDoc={doc}
                  />
                </li>
              )}
            </Fragment>
          );
        })}
    </ul>
  );
}

export default CommentUserContent;
