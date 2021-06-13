import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function useSocrataGeoJSON(resourceId) {
	const { data, error } = useSWR(
		`https://data.austintexas.gov/resource/${resourceId}.geojson?$limit=9999999&$order=location_name asc&$select=location_name,signal_id,signal_type,signal_status,location`,
		fetcher
	);
	return {
		geojson: data,
		loading: !error && !data,
		error: error,
	};
}
