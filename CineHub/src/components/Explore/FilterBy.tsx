import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

import FilterByDate from "./FilterByDate";
import FilterByGenres from "./FilterByGenres";
import FilterByRuntime from "./FilterByRuntime";

interface FilterByProps {
  currentTab: string;
}

function FilterBy({ currentTab }: FilterByProps) {
  const [filter] = useAutoAnimate();
  const [isShowFilterBox, setIsShowFilterBox] = useState(true);

  const showFilterBoxContent = (
    <div className="py-3 border-t border-gray-dark">
      <p className="text-lg mb-4  text-white/80">Genres</p>
      <FilterByGenres currentTab={currentTab} />

      <p className="text-lg mb-2 mt-8 text-white/80">Runtime</p>
      <FilterByRuntime />

      <p className="text-lg mb-2 mt-8 text-white/80">Release Dates</p>
      <FilterByDate />
    </div>
  );

  return (
    <div
      ref={filter}
      className="px-4 pt-3 mt-8 shadow-md rounded-md bg-dark-light border border-gray-lighten md:rounded-none "
    >
      <div className="flex justify-between items-center text-white pb-3">
        <p className="text-lg">Filter</p>
        <button onClick={() => setIsShowFilterBox((prev) => !prev)}>
          {isShowFilterBox && <FiChevronDown size={20} />}
          {!isShowFilterBox && <FiChevronRight size={20} />}
        </button>
      </div>
      {isShowFilterBox && showFilterBoxContent}
    </div>
  );
}

export default FilterBy;
