import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { useCurrentViewport } from "../../hooks/useCurrentViewport";

import { FiChevronDown, FiChevronRight } from "react-icons/fi";

type MyOptionType = {
  label: string;
  value: string;
};

function SortBy() {
  const [isShowSortBox, setIsShowSortBox] = useState(true);
  const [parent] = useAutoAnimate();
  const { isMobile } = useCurrentViewport();

  const [searchParams, setSearchParams] = useSearchParams();

  const options: MyOptionType[] = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Most Rating" },
    { value: "primary_release_date.desc", label: "Most Recent" },
  ];

  //   CUSTOM SELECT COMPONENT
  const customStyles: StylesConfig<MyOptionType, false> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#303030",
      boxShadow:
        " rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      border: "none",
      borderRadius: !isMobile ? "none" : "4px",
    }),
    option: (styles, { isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "#5179ff" : "#303030",
      ":hover": {
        ...styles[":hover"],
        backgroundColor: isSelected ? "#7091ff" : "#49494b",
        color: "white",
      },
    }),

    singleValue: (provided) => ({ ...provided, color: "white" }),

    menu: (styles) => ({
      ...styles,
      backgroundColor: "#323232",
      border: "1px solid #434343",
      borderRadius: !isMobile ? "none" : "4px",
    }),
  };

  const chooseSort = (option: SingleValue<MyOptionType>) => {
    searchParams.set("sort_by", option?.value || "");
    setSearchParams(searchParams);
  };

  const sortType = searchParams.get("sort_by") || "popularity.desc";

  const sortByBoxContent = (
    <div className="py-3 border-t border-t-gray-dark">
      <p className="text-lg mb-2 text-white">Sort results by</p>
      <Select
        options={options}
        styles={customStyles}
        defaultValue={options[0]}
        value={options.find((option) => option.value === sortType)}
        onChange={chooseSort}
        className="z-30 "
      />
    </div>
  );

  return (
    <div
      ref={parent}
      className="px-4 pt-3 shadow-md rounded-md bg-dark-light border border-gray-lighten md:rounded-none "
    >
      <div className="flex justify-between items-center text-white pb-3">
        <p className="text-lg">Sort Films</p>
        <button onClick={() => setIsShowSortBox((prev) => !prev)}>
          {isShowSortBox && <FiChevronDown size={20} />}
          {!isShowSortBox && <FiChevronRight size={20} />}
        </button>
      </div>
      {isShowSortBox && sortByBoxContent}
    </div>
  );
}

export default SortBy;
