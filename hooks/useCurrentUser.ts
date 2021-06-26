import useSWR from "swr";

const useCurrentUser = () => {
  const { data: user, error } = useSWR("/api/users/current");
  return {
    user,
    isLoading: !error && !user,
    isError: error,
  };
};

export default useCurrentUser;
