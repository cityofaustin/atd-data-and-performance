import useSWR from "swr";

const fetcher = (url, headers) => fetch(url, { headers: headers }).then((res) => res.json());


export function useKnack(url, headers) {
  const { data, error } = useSWR([url, headers], fetcher);
  return {
    data: data,
    loading: !error && !data,
    error: error,
  };
}
