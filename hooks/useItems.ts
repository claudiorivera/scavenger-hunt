import useSWR from "swr";

export const useItems = () => {
  const { data: items, error, mutate } = useSWR("/api/items");

  return {
    items,
    isLoading: !error && !items,
    isError: error,
    mutate,
  };
};
