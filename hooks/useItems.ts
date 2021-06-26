import useSWR from "swr";

const useItems = () => {
  const { data: items, error, mutate } = useSWR("/api/items");
  return {
    items,
    isLoading: !error && !items,
    isError: error,
    mutate,
  };
};

export default useItems;
