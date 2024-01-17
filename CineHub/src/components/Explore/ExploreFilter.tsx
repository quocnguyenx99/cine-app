import SortBy from "./SortBy";
import FilterBy from "./FilterBy";

interface ExploreFilterProps {
  currentTab: string;
}

function ExploreFilter({ currentTab }: ExploreFilterProps) {
  return (
    <>
      <SortBy />
      <FilterBy currentTab={currentTab} />
    </>
  );
}

export default ExploreFilter;
