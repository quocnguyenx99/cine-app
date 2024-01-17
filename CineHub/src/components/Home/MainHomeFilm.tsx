import type { HomeFilms, BannerInfo } from "../../shared/types";
import Skeleton from "../Common/Skeleton";
import BannerSlider from "../Slider/BannerSlider";
import SectionSlider from "../Slider/SectionSlider";

interface MainHomeFilmProps {
  data: HomeFilms | undefined;
  dataDetail: BannerInfo[] | undefined;
  isLoadingBanner: boolean;
  isLoadingSection: boolean;
}

function MainHomeFilm({
  data,
  dataDetail,
  isLoadingBanner,
  isLoadingSection,
}: MainHomeFilmProps) {
  return (
    <div className="flex-grow md:p-[1vw] md:border-r md:border-gray-light">
      <BannerSlider
        films={data?.Trending}
        dataDetail={dataDetail}
        isLoadingBanner={isLoadingBanner}
      />

      <ul className="flex flex-col gap-10 mt-12">
        {isLoadingSection ? (
          <>
            {new Array(2).fill("").map((_, index) => (
              <li key={index}>
                <Skeleton className="mb-3 max-w-[10%] h-8 rounded-md md:rounded-none" />
                <SectionSlider films={undefined} />
              </li>
            ))}
          </>
        ) : (
          Object.entries(data as HomeFilms)
            .filter((section) => section[0] !== "Trending")
            .map((section, index) => (
              <li key={index}>
                <h2 className="mb-3 text-xl text-white font-medium tracking-wider">
                  {section[0]}
                </h2>

                <SectionSlider films={section[1]} />
              </li>
            ))
        )}
      </ul>
    </div>
  );
}

export default MainHomeFilm;
