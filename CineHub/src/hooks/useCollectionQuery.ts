import {
  CollectionReference,
  DocumentData,
  onSnapshot,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollectionQuery = (
  id: number | string | undefined,
  collection: CollectionReference | Query<DocumentData>
) => {
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(data));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const ubsubscribe = onSnapshot(
      collection,
      (querySnapshot) => {
        setData(querySnapshot);
        setIsLoading(false);
        setIsError(false);
      },
      (error) => {
        console.log(error);
        setData(null);
        setIsLoading(true);
        setIsError(true);
      }
    );

    return () => ubsubscribe();
  }, [id]);

  return { isLoading, isError, data };
};
