import useSWR from "swr";

const useUncollectedItems = () => {
  const {
    data: uncollectedItems,
    error,
    mutate,
  } = useSWR("/api/items/uncollected");
  return {
    uncollectedItems,
    isLoading: !error && !uncollectedItems,
    isError: error,
    mutate,
  };
};

export default useUncollectedItems;
