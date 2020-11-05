import useSWR from "swr";
import fetcher from "@util/fetcher";

const useItems = () => {
  const { data: items, error, mutate } = useSWR("/api/items", fetcher);
  return {
    items,
    isLoading: !error && !items,
    isError: error,
    mutate,
  };
};

export default useItems;
