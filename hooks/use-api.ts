import useSWR from "swr";

export function useApi<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
