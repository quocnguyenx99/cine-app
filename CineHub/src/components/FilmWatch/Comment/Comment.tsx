import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { MdSend } from "react-icons/md";

import { db } from "../../../shared/firebase";
import { useCollectionQuery } from "../../../hooks/useCollectionQuery";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  // getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  // setDoc,
} from "firebase/firestore";

import CommentUserData from "./CommentUserData";
import { getRandomAvatar } from "../../../shared/utils";

interface CommentProps {
  id?: number;
  media_type: string;
}

function Comment({ id, media_type }: CommentProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  const [commentInputValue, setCommentInputValue] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentLimit, setCommentLimit] = useState(5);
  const [sortType, setSortType] = useState("latest");

  const {
    data: commentData,
    isLoading,
    isError,
  } = useCollectionQuery(
    id,
    query(collection(db, `${media_type}-${id}`), orderBy("createdAt", "desc"))
  );

  const commentSubmitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!commentInputValue.trim().length) return;

    setIsSendingComment(true);
    addDoc(collection(db, `${media_type}-${id}`), {
      user: currentUser,
      value: commentInputValue.trim().slice(0, 500),
      reactions: {},
      createdAt: serverTimestamp(),
      isEdited: false,
    }).finally(() => {
      setIsSendingComment(false);
    });
    setCommentInputValue("");
  };

  useEffect(() => {
    if (!media_type && !id) return;

    const fetchData = async () => {
      const commentRef = doc(db, `${media_type}-${id as number}`, "admin");

      try {
        await runTransaction(db, async (transaction) => {
          const docSnapshot = await transaction.get(commentRef);
          const isAdminCommentExists =
            docSnapshot.data()?.user.uid === "CZGmXpePYsd1YryQR3C8xA5YOzb2";

          if (!isAdminCommentExists) {
            transaction.set(commentRef, {
              user: {
                displayName: "_quocnguyenx99",
                email: "nhquoc99@gmail.com",
                emailVerified: false,
                photoURL: getRandomAvatar(),
                uid: "CZGmXpePYsd1YryQR3C8xA5YOzb2",
              },
              value:
                "Ngoài bình luận, trang web còn có chức năng thả cảm xúc, xem thông tin những người thả cảm xúc, (cảm xúc được nhiều người thả sẽ được ưu tiên hiện đầu), trả lời bình luận, chỉnh sửa, xóa, ẩn bình luận, sắp xếp bình luận, tải thêm bình luận.",
              reactions: {
                "3RkuRS4zSqadAkKDqSfTjCzwzF92": "haha",
                GMaGmpy8ZaRBEhtaoZJdd9pNNXz1: "love",
                UNuwtFtu69YHDGTs2emT6O8ClSG3: "love",
                Z3eRARZ9jlftBLA6u0g8MWABkwo2: "like",
                nj99GDXzPwNhcfUpk5PkyNFiwPt1: "sad",
              },
              createdAt: Timestamp.fromDate(
                new Date("Sun Dec 12 2023 10:30:32 GMT+0700 (Indochina Time)")
              ),
              isEdited: true,
            });
          }
        });
      } catch (error) {
        console.log("Error handling transaction: ", error);
      }
    };

    fetchData();
  }, [media_type, id]);

  return (
    <div className="mb-16">
      {/*  START HEADER AND SWITCH BTN */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-[140px]">
          <p className="text-xl md:text-2xl text-gray-txt font-medium">
            Comments
          </p>
          {commentData && commentData.size && (
            <p className="absolute md:-top-1 md:-right-1 -top-2 right-5 w-6 h-6 bg-dark text-sm rounded-full tw-flex-center text-gray-txt">
              {commentData.size}
            </p>
          )}
        </div>

        <div className="flex">
          <button
            onClick={() => setSortType("latest")}
            className={`px-2 py-1 border border-dark-lighten rounded-l-xl md:rounded-none
             transition duration-300 hover:text-white ${
               sortType === "latest" && "bg-dark-light text-white"
             }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortType("popular")}
            className={`px-2 py-1 border border-dark-lighten rounded-r-xl md:rounded-none
             transition duration-300 hover:text-white ${
               sortType === "popular" && "bg-dark-light text-white"
             }`}
          >
            Popular
          </button>
        </div>
      </div>
      {/*  END HEADER AND SWITCH BTN */}

      {/*  START COMMENT INPUT */}

      <div className="px-1 md:px-4">
        <div className="mb-12">
          {!currentUser && (
            <p className="text-lg text-gray-txt text-center">
              You need to{" "}
              <Link
                to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
                className="text-primary font-medium"
              >
                &nbsp;login&nbsp;
              </Link>
              to comment.
            </p>
          )}

          {currentUser && (
            <form
              onSubmit={commentSubmitHandler}
              className="flex gap-4 items-center"
            >
              <LazyLoadImage
                alt="user-image"
                src={currentUser.photoURL as string}
                effect="opacity"
                className="w-12 h-12 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />

              <input
                type="text"
                value={commentInputValue}
                placeholder="Write comment..."
                onChange={(e) => setCommentInputValue(e.target.value)}
                className="py-3 flex-1 bg-dark outline-none  rounded-full md:rounded px-4 text-gray-txt"
              />

              {isSendingComment ? (
                <div className="w-10 h-10 rounded-full border-[3px] border-t-transparent border-primary animate-spin"></div>
              ) : (
                <button>
                  <MdSend size={30} className="text-primary" />
                </button>
              )}
            </form>
          )}
        </div>
      </div>
      {/* END COMMENT INPUT */}

      <CommentUserData
        isLoading={isLoading}
        isError={isError}
        sortType={sortType}
        commentData={commentData}
        commentLimit={commentLimit}
        media_type={media_type}
        id={id}
        role={"comment"}
      />

      {commentData && commentData.size > commentLimit && (
        <button
          onClick={() => setCommentLimit((prev) => prev + 5)}
          className="font-medium"
        >
          Load more comments ({commentLimit}/ {commentData.size})
        </button>
      )}
    </div>
  );
}

export default Comment;
