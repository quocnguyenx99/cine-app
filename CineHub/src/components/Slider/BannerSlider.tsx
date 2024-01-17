import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import Skeleton from "../Common/Skeleton";

import { AiFillStar } from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";

import type { BannerInfo, Item } from "../../shared/types";
import { useCurrentViewport } from "../../hooks/useCurrentViewport";
import { resizeImage } from "../../shared/utils";

interface BannerSliderProps {
  films: Item[] | undefined;
  dataDetail: BannerInfo[] | undefined;
  isLoadingBanner: boolean;
}
function BannerSlider({
  films,
  dataDetail,
  isLoadingBanner,
}: BannerSliderProps) {
  const { isMobile } = useCurrentViewport();

  // console.log("Banner data get: ", { films, dataDetail, isLoadingBanner });

  return (
    <div className="relative h-0 md:pb-[45%] pb-[55%] tw-banner-slider ">
      {isLoadingBanner ? (
        <Skeleton className="absolute top-0 left-0 w-full h-full !rounded-lg md:!rounded-none" />
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          slidesPerView={1}
          className="!absolute !top-0 !left-0 !w-full !h-full !rounded-lg md:!rounded-none "
        >
          {(films as Item[])?.map((film, index) => (
            <SwiperSlide key={film.id}>
              <Link
                to={
                  film.media_type === "movie"
                    ? `/movie/${film.id}`
                    : `/tv/${film.id}`
                }
                className="group"
              >
                <LazyLoadImage
                  src={resizeImage(film.backdrop_path, "w1280")}
                  alt="Backdrop image"
                  effect="blur"
                />

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none tw-black-backdrop group-hover:bg-[#00000026] transition duration-700"></div>

                <div className="hidden md:flex absolute top-[5%] right-[3%] bg-primary px-3 py-1 rounded-full text-white  items-center gap-1">
                  <span>{film.vote_average.toFixed(1)}</span>
                  <AiFillStar size={15} />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-16 h-16 rounded-full bg-primary/70 tw-flex-center z-10 opacity-0 invisible  group-hover:opacity-100 group-hover:visible transition duration-700">
                  <BsFillPlayFill size={35} className="text-white" />
                </div>

                <div className="absolute top-1/2 left-[5%] -translate-y-1/2 max-w-[200px] md:max-w-md">
                  <h2 className="text-xl text-primary font-bold tracking-wide tw-multiline-ellipsis-3 md:text-5xl md:tw-multiline-ellipsis-2">
                    {film.title || film.name}
                  </h2>
                  <div>
                    <p className="mt-6 text-base text-white font-semibold  md:text-2xl ">
                      {dataDetail?.[index].translation[0] ||
                        dataDetail?.[index].translation[1] ||
                        dataDetail?.[index].translation[2] ||
                        dataDetail?.[index].translation[3] ||
                        dataDetail?.[index].translation[4] ||
                        dataDetail?.[index].translation[5]}
                    </p>
                  </div>
                  <p>
                    {film?.release_date && `Release date: ${film.release_date}`}
                    {film?.first_air_date &&
                      `First air date: ${film.first_air_date}`}
                  </p>

                  {!isMobile && (
                    <>
                      <div className="flex gap-2 flex-wrap mt-5">
                        {dataDetail?.[index].genre.map((genre) => (
                          <div
                            className="px-3 py-1 border rounded-full"
                            key={genre.id}
                          >
                            {genre.name}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-base tw-multiline-ellipsis-3">
                        {film?.overview}
                      </p>
                    </>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
          {films !== undefined && (
            <>
              <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none "></div>
              <div className="absolute top-0 left-0 h-full w-[6%] z-10 "></div>
              <div className="absolute top-0 right-0 h-full w-[6%] z-10"></div>
            </>
          )}
        </Swiper>
      )}
    </div>
  );
}

export default BannerSlider;
