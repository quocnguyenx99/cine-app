import { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

function FilterByDate() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterDate = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "from") {
      searchParams.set("from", e.target.value);
      setSearchParams(searchParams);
    } else {
      searchParams.set("to", e.target.value);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex justify-between items-center">
        <label htmlFor="from">From</label>
        <input
          type="date"
          id="from"
          name="from"
          className="outline-none bg-dark-lighten px-3 py-1 rounded-md md:rounded-none shadow-md"
          value={searchParams.get("from") || "1999-05-18"}
          onChange={handleFilterDate}
        />
      </div>

      <div className="flex justify-between items-center">
        <label htmlFor="from">To</label>
        <input
          type="date"
          id="to"
          name="to"
          className="outline-none bg-dark-lighten px-3 py-1 rounded-md md:rounded-none shadow-md"
          value={searchParams.get("to") || "2023-12-01"}
          onChange={handleFilterDate}
        />
      </div>
    </div>
  );
}

export default FilterByDate;
