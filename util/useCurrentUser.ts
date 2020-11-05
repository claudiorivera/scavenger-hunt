import useSWR from "swr";
import fetcher from "@util/fetcher";

const useCurrentUser = () => {
  const { data: user, error } = useSWR("/api/user", fetcher);
  return {
    user,
    isLoading: !error && !user,
    isError: error,
  };
};

export default useCurrentUser;
