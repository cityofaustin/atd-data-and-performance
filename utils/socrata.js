import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const buildQuery = (args) => {
  if (!args || args.length === 0) return null;
  return args
    .map((arg) => {
      return `$${arg.key}=${arg.value}`;
    })
    .join("&");
};

const buildUrl = ({ resourceId, format, query }) => {
  let url = `https://data.austintexas.gov/resource/${resourceId}.${format}`;
  url = query ? `${url}?${query}` : url;
  return url;
};

export function useSocrata({ resourceId, format, args }) {
  const query = buildQuery(args);
  const url = buildUrl({ resourceId, format, query });
  const { data, error } = useSWR(url, fetcher);
  return {
    data: data,
    loading: !error && !data,
    error: error,
  };
}
