// import { useState } from "react";
import type { CommentDataType } from "./CommentUserContent";
// import UserWhoReact from "./UserWhoReact";
import { AiFillHeart, AiTwotoneLike } from "react-icons/ai";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { FaAngry, FaSadTear, FaSurprise } from "react-icons/fa";

import { reactionColorForTailwindCSS } from "../../../shared/contants";

interface ReactionInfoProps {
  docData: CommentDataType;
}

type ReactionType = [string, number];

function ReactionInfo({ docData }: ReactionInfoProps) {
  const convertReaction = (reactions: { [key: string]: string }) => {
    if (!reactions) {
      return [];
    }
    const countNumberOfEachReaction = Object.values(reactions).reduce(
      (acc, curr) => {
        acc[curr] = 1 + (acc[curr] || 0);
        return acc;
      },
      {} as { [key: string]: number }
    );

    const sortByNumberOfReaction = Object.entries(
      countNumberOfEachReaction
    ).sort((a, b) => b[1] - a[1]);
    return sortByNumberOfReaction;
  };

  const topReactions = convertReaction(docData.reactions).slice(0, 3);
  const renderReactionIcons = (reactionEntry: ReactionType, index: number) => {
    const iconProps = {
      className: `relative -ml-2 ${
        index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
      } ${reactionColorForTailwindCSS[reactionEntry[0]]}`,
      size: 20,
    };

    switch (reactionEntry[0]) {
      case "like":
        return <AiTwotoneLike key={index} {...iconProps} />;
      case "love":
        return <AiFillHeart key={index} {...iconProps} />;
      case "haha":
        return <BsEmojiLaughingFill key={index} {...iconProps} />;
      case "wow":
        return <FaSurprise key={index} {...iconProps} />;
      case "sad":
        return <FaSadTear key={index} {...iconProps} />;
      case "angry":
        return <FaAngry key={index} {...iconProps} />;
      default:
        return null;
    }
  };

  const renderReactionList = (reactionEntry: ReactionType, index: number) => (
    <li key={index}>
      <div className="flex gap-2 items-center justify-center">
        {renderReactionIcons(reactionEntry, index)}
        <p>{reactionEntry[1]}</p>
      </div>
    </li>
  );
  return (
    <>
      {docData.reactions && Object.values(docData.reactions).length > 0 && (
        <>
          <button className="absolute flex gap-1 items-center -right-10 -bottom-3  bg-dark-light px-1 pl-3 py-[2px] rounded-full shadow-md peer hover:brightness-75 transition duration-300">
            {topReactions.map(renderReactionIcons)}
            <p className="text-sm">{Object.values(docData.reactions).length}</p>
          </button>
          <ul className="flex flex-col gap-2 peer-hover:opacity-100 peer-hover:visible opacity-0 invisible transition duration-300 absolute -right-24 top-[90px] bg-dark-light px-3 py-2 rounded-md shadow-md z-10">
            {convertReaction(docData.reactions).map(renderReactionList)}
          </ul>
        </>
      )}
    </>
  );
}

export default ReactionInfo;
