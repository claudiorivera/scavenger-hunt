import useSWR from "swr";
import fetcher from "@util/fetcher";

const useUncollectedItems = () => {
  const { data: uncollectedItems, error, mutate } = useSWR(
    "/api/items/uncollected",
    fetcher
  );
  return {
    uncollectedItems,
    isLoading: !error && !uncollectedItems,
    isError: error,
    mutate,
  };
};

export default useUncollectedItems;
