import { AiFillStar } from "react-icons/ai";

interface StarRatingProps {
  star: number;
  maxStar: number;
}

function StarRating({ star, maxStar }: StarRatingProps) {
  if (star === 0) return <p></p>;
  return (
    <div className="flex gap-[2px]">
      {[...new Array(maxStar)].map((_, index: number) => (
        <AiFillStar
          key={index}
          size={15}
          className={`${index < star && "text-primary"}`}
        />
      ))}
    </div>
  );
}

export default StarRating;
