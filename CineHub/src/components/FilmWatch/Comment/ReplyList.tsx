import { useEffect, useState } from "react";
import { useCollectionQuery } from "../../../hooks/useCollectionQuery";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../shared/firebase";
import CommentUserData from "./CommentUserData";
import { getRandomAvatar } from "../../../shared/utils";

interface ReplyProps {
  commentId: string;
}

function ReplyList({ commentId }: ReplyProps) {
  const [commentLimit, setCommentLimit] = useState(5);

  const {
    data: commentData,
    isLoading,
    isError,
  } = useCollectionQuery(
    commentId,
    query(collection(db, `replyTo-${commentId}`), orderBy("createdAt", "desc"))
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const docSnapshot = await getDocs(collection(db, "replyTo-admin"));
      if (isMounted) {
        const isReplyForAdminExists = docSnapshot.docs.some(
          (doc) => doc.data()?.user.uid === "Z3eRARZ9jlftBLA6u0g8MWABkwo2"
        );

        if (!isReplyForAdminExists) {
          await addDoc(collection(db, "replyTo-admin"), {
            user: {
              displayName: "Vì anh  đâu có biết",
              email: "nhquoc99@gmail.com",
              emailVerified: false,
              photoURL: getRandomAvatar(),
              uid: "Z3eRARZ9jlftBLA6u0g8MWABkwo2",
            },
            value: "u là trời",
            reactions: {
              CZGmXpePYsd1YryQR3C8xA5YOzb2: "angry",
              GMaGmpy8ZaRBEhtaoZJdd9pNNXz1: "haha",
              UNuwtFtu69YHDGTs2emT6O8ClSG3: "haha",
            },
            createdAt: Timestamp.fromDate(
              new Date("Sat Aug 06 2022 10:10:32 GMT+0700 (Indochina Time)")
            ),
            isEdited: false,
          });
        }
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {commentData && commentData.size > 0 && (
        <div className="mt-5">
          <CommentUserData
            role="reply"
            isLoading={isLoading}
            isError={isError}
            sortType="latest"
            commentData={commentData}
            commentLimit={commentLimit}
            media_type="replyTo"
            id={commentId}
          />
        </div>
      )}

      {commentData && commentData.size > commentLimit && (
        <button
          className="font-medium mt-3"
          onClick={() => setCommentLimit((prev) => prev + 5)}
        >
          Load more replies ({commentLimit}/{commentData.size})
        </button>
      )}
    </>
  );
}

export default ReplyList;
