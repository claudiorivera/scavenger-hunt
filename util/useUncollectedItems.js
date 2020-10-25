import useSWR from "swr";
import fetcher from "@util/fetcher";

const useUncollectedItems = (initialData) => {
  const { data: uncollectedItems, error, mutate } = useSWR(
    "/api/items?uncollected",
    fetcher,
    {
      initialData,
    }
  );
  return {
    uncollectedItems,
    isLoading: !error && !uncollectedItems,
    isError: error,
    mutate,
  };
};

export default useUncollectedItems;
