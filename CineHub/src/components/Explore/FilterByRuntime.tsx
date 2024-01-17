import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const MAX_RUNTIME = 200;
const GAP = 20;

function FilterByRuntime() {
  const sliderRangeRef = useRef<HTMLDivElement>(null!);
  const timeoutRef = useRef<any>(null!);

  const [minRuntime, setMinRunTime] = useState(0);
  const [maxRuntime, setMaxRunTime] = useState(MAX_RUNTIME);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    updateMinRangeBar(Number(searchParams.get("minRuntime") ?? 0));
    updateMaxRangeBar(Number(searchParams.get("maxRuntime") || 200));
  }, [window.location.search]);

  const updateMinRangeBar = (value: number) => {
    setMinRunTime(value);
    const leftOffset = (value / MAX_RUNTIME) * 100;
    sliderRangeRef.current.style.left = leftOffset + "%";
  };

  const updateMaxRangeBar = (value: number) => {
    setMaxRunTime(value);
    const rightOffset = 100 - (value / MAX_RUNTIME) * 100;
    sliderRangeRef.current.style.right = rightOffset + "%";
  };

  const handleDragSliderRange = (e: ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (e.target.name === "min-range") {
      updateMinRangeBar(
        maxRuntime - Number(e.target.value) < GAP
          ? maxRuntime - GAP
          : Number(e.target.value)
      );

      timeoutRef.current = setTimeout(() => {
        searchParams.set("minRuntime", e.target.value);
        setSearchParams(searchParams);
      }, 500);
    } else {
      updateMaxRangeBar(
        Number(e.target.value) - minRuntime < GAP
          ? minRuntime + GAP
          : Number(e.target.value)
      );
      timeoutRef.current = setTimeout(() => {
        searchParams.set("maxRuntime", e.target.value);
        setSearchParams(searchParams);
      }, 500);
    }
  };

  return (
    <div>
      {/* START HEADER */}
      <div className="flex justify-between mb-3">
        <div>
          <p>
            From{" "}
            <span className="font-semibold text-lg text-primary">
              {minRuntime}{" "}
            </span>
            min
          </p>
        </div>

        <div>
          <p>
            To{" "}
            <span className="font-semibold text-lg text-primary">
              {maxRuntime}{" "}
            </span>
            min
          </p>
        </div>
      </div>
      {/* END HEADER */}

      {/* START SLIDER RANGE */}
      <div className="relative h-[5px] bg-dark-darken rounded-md">
        <div
          ref={sliderRangeRef}
          className="absolute top-0 h-[5px] bg-primary rounded-md"
        ></div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={"0"}
          max={MAX_RUNTIME}
          step={"10"}
          name="min-range"
          value={minRuntime}
          className="absolute -top-[5px] left-0 w-full h-[5px] appearance-none [background:none] pointer-events-none tw-slider-range"
          onChange={handleDragSliderRange}
        />

        <input
          type="range"
          min={"0"}
          max={MAX_RUNTIME}
          step={"10"}
          name="max-range"
          value={maxRuntime}
          className="absolute -top-[5px] left-0 w-full h-[5px] appearance-none [background:none] pointer-events-none tw-slider-range"
          onChange={handleDragSliderRange}
        />
      </div>
      {/* END SLIDER RANGE */}
    </div>
  );
}

export default FilterByRuntime;
