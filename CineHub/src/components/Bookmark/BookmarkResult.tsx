import { HiCheck } from "react-icons/hi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { Item } from "../../shared/types";

import FilmItem from "../Common/FilmItem";

interface BookmarkResultProps {
  films: Item[] | undefined;
  isEditing: boolean;
  selections: number[];
  setSelections: React.Dispatch<React.SetStateAction<number[]>>;
  isLoading: boolean;
  pageType: string;
}

function BookmarkResult({
  films,
  isEditing,
  selections,
  setSelections,
  isLoading,
  pageType,
}: BookmarkResultProps) {
  return (
    <>
      {films?.length === 0 && !isLoading && (
        <div className="text-white text-2xl text-center col-span-full mt-10">
          <div className="flex justify-center">
            <LazyLoadImage
              src="/error.png"
              alt="error-img"
              className="w-[600px] object-cover"
            />
          </div>
          <p className="mt-5">
            {pageType === "bookmark"
              ? "Your bookmark list for this type is empty. Let's bookmark some!"
              : "Your recently watched films for this type is empty. Let's watch some!"}
          </p>
        </div>
      )}

      {films &&
        films.length > 0 &&
        films.map((film) => (
          <li key={film.id} className="relative">
            <FilmItem item={film} />
            {isEditing && (
              <button
                onClick={() =>
                  setSelections((prev: number[]) =>
                    prev.includes(film.id)
                      ? prev.filter((id: number) => film.id !== id)
                      : prev.concat(film.id)
                  )
                }
                className="tw-absolute-center-horizontal mt-2 tw-flex-center w-6 h-6 border-2 border-primary"
              >
                <HiCheck
                  size={20}
                  className={`${
                    selections.includes(film.id) ? "opacity-100" : "opacity-0"
                  } transition duration-300 text-white`}
                />
              </button>
            )}
          </li>
        ))}
    </>
  );
}

export default BookmarkResult;
