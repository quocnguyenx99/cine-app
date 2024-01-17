import type { ItemsPage, Item } from "../../shared/types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroll-component";

import Skeleton from "../Common/Skeleton";
import FilmItem from "../Common/FilmItem";

interface ExploreResultContentProps {
  data: ItemsPage[] | undefined;
  fetchNext: () => void;
  hasNextPage: boolean;
}

function ExploreResultContent({
  data,
  fetchNext,
  hasNextPage,
}: ExploreResultContentProps) {
  return (
    <>
      {data?.reduce((acc: Item[], curr: ItemsPage) => {
        return [...acc, ...curr.results];
      }, [] as Item[]).length === 0 ? (
        <div className="flex flex-col items-center mb-12">
          <LazyLoadImage
            alt={"error-img"}
            src={"/error.png"}
            effect="opacity"
            className="w-[600px]"
          />
          <p className="text-white text-3xl">There is no such films</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={data?.length || 0}
          next={fetchNext}
          hasMore={hasNextPage}
          loader={
            <div className="mt-36 mb-20 mx-auto h-10 w-10 rounded-full border-[5px] border-dark-lighten border-t-transparent animate-spin"></div>
          }
          endMessage={<></>}
        >
          <ul className="grid grid-cols-sm gap-x-8 gap-y-10 pt-2 px-2 md:p-[1vw] lg:grid-cols-lg">
            {data &&
              data.map((page) =>
                page.results.map((item) => (
                  <li key={item.id}>
                    <FilmItem item={item} />
                  </li>
                ))
              )}

            {!data &&
              new Array(15).map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-0 pb-[160%]" />
                </li>
              ))}
          </ul>
        </InfiniteScroll>
      )}
    </>
  );
}

export default ExploreResultContent;
