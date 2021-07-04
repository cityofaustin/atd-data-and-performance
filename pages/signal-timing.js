import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import GeoTable from "../components/geotable/GeoTable";
import useSocrata from "../utils/socrata.js";

const SOCRATA_ENDPOINT_CORRIDORS = {
  resourceId: "efct-8fs9",
  format: "geojson",
  query:
    "$limit=9999999&$select=system_id,system_name,signal_id,location_name,location",
};

const SOCRATA_ENDPOINT_RETIMING = {
  resourceId: "g8w2-8uap",
  format: "json",
  query: "$limit=9999999&",
};

const TABLE_HEADERS = [
  { key: "system_name", label: "Corridor Name" },
  { key: "retime_status", label: "Status" },
];

const FILTERS = {
  search: {
    key: "search",
    value: "",
    featureProp: "system_name",
    label: "Search",
    placeholder: "Search by location...",
  },
};

const POINT_LAYER_ID = "points";

const POINT_LAYER_STYLE = {
  id: POINT_LAYER_ID,
  paint: {
    "circle-color": "#7B76B5",
    "circle-stroke-color": "#fff",
    "circle-stroke-width": 1,
  },
};

const mapOverlayConfig = {
  titleKey: "system_name",
  bodyKeys: ["total_vol", "vol_wavg_tt_pct_change", "engineer_note"],
};

const applyDynamicStyle = (map, selectedFeature) => {
  const matchValue = selectedFeature?.properties.system_id || "";
  map.setPaintProperty(POINT_LAYER_ID, "circle-color", [
    "match",
    ["get", "system_id"],
    matchValue,
    "#DC6E2C",
    "#7B76B5",
  ]);
};

const constructCorridorFeature = ({ system_id, system_name }) => {
  return {
    type: "Feature",
    properties: { system_id, system_name },
    geometry: { type: "MultiPoint", coordinates: [] },
  };
};

const useMultiPointCorridors = (features) => {
  const [signalCorridors, setSignalCorridors] = React.useState({
    type: "FeatureCollection",
    features: [],
  });
  React.useEffect(() => {
    if (!features || features.length === 0) return;
    let corridorIndex = {};
    let mutableCorridors = { ...signalCorridors };
    features.forEach((feature) => {
      let system_id = feature.properties.system_id;
      let system_name = feature.properties.system_name;

      if (!(system_id in corridorIndex)) {
        // create a new json feature to hold all signals in this corridor
        corridorIndex[system_id] = constructCorridorFeature({
          system_id,
          system_name,
        });
      }
      let coordinates = feature.geometry.coordinates;
      coordinates &&
        corridorIndex[system_id].geometry.coordinates.push(coordinates);
    });
    mutableCorridors.features = Object.keys(corridorIndex).map(
      (key) => corridorIndex[key]
    );
    setSignalCorridors(mutableCorridors);
  }, [features]);
  return signalCorridors;
};

const useYears = (data) => {
  const [years, setYears] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(null);

  React.useEffect(() => {
    if (!data) return;
    let allYears = data.map((row) => {
      return row.scheduled_fy;
    });
    // TODO: think about this
    // set the current selected year to the most recent, or if no years, 2016...why not? hopefully does not happen
    setSelectedYear(allYears[allYears.length - 1] || "2016");
    setYears([...new Set(allYears)]);
  }, [data]);

  return { years, selectedYear, setSelectedYear };
};

const useFilteredRetimingData = (data, selectedYear) => {
  const [retimingDataFiltered, setRetimingDataYear] = React.useState([]);
  React.useEffect(() => {
    if (!data || data.length === 0) return;
    let thisYearData = data.filter((row) => {
      return row.scheduled_fy === selectedYear;
    });
    setRetimingDataYear(thisYearData);
  }, [data, selectedYear]);
  return retimingDataFiltered;
};

// filters corridor by years **and** joins retiming data
const useFilteredCorridors = (signalCorridors, retimingDataFiltered) => {
  const [signalCorridorsFiltered, setSignalCorridorsYear] = React.useState([]);
  React.useEffect(() => {
    if (
      !signalCorridors ||
      signalCorridors.length === 0 ||
      !retimingDataFiltered ||
      retimingDataFiltered.length === 0
    )
      return;

    let mutableCorridors = { ...signalCorridors };
    let filteredCorridorFeatures = [];

    mutableCorridors.features.map((corridor) => {
      const corridorID = corridor.properties.system_id;
      // for every corridor, see if there is a matching retiming record (which has already been filtered for the selected year)
      const thisRetimingData = retimingDataFiltered.find((retimingData) => {
        return retimingData.system_id === corridorID;
      });

      if (thisRetimingData) {
        // merge the retiming data into the corridor properties
        corridor.properties = { ...corridor.properties, ...thisRetimingData };
        filteredCorridorFeatures.push(corridor);
      }
    });
    mutableCorridors.features = filteredCorridorFeatures;
    setSignalCorridorsYear(mutableCorridors);
  }, [signalCorridors, retimingDataFiltered]);

  return signalCorridorsFiltered;
};

const useSummaryStats = (retimingDataFiltered, signalCorridorsRaw) => {
  // TODO: simplifiy with reducer
  const [summaryStats, setSummaryStats] = React.useState({
    complete: 0,
    total: 0,
  });

  React.useEffect(() => {
    let corridorStatusIndex = {};
    retimingDataFiltered.forEach((corridor) => {
      corridorStatusIndex[corridor.system_id] = corridor.retime_status;
    });

    let signalStatusIndex = {};

    signalCorridorsRaw.forEach((signal) => {
      const signalId = signal.properties.signal_id;
      const systemId = String(signal.properties.system_id);
      const retimeStatus = corridorStatusIndex[systemId];
      if (!retimeStatus) {
        return;
      }
      const existingSignalStatus = signalStatusIndex[signalId];

      if (existingSignalStatus && existingSignalStatus !== "COMPLETED") {
        return;
      }

      signalStatusIndex[signalId] = retimeStatus;
    });
    let newSummaryStats = { complete: 0, total: 0 };
    Object.values(signalStatusIndex).forEach((status) => {
      newSummaryStats.total++;
      if (status === "COMPLETED") newSummaryStats.complete++;
    });
    setSummaryStats(newSummaryStats);
  }, [retimingDataFiltered]);
  return summaryStats;
};

const ProgressChart = ({ summaryStats }) => {
  const COLORS = ["#82ca9d", "#fcba03"];
  const [pieData, setPieData] = React.useState([]);

  React.useEffect(() => {
    let newPieData = [
      {
        name: "Incomplete",
        value: summaryStats.total - summaryStats.complete,
      },
      {
        name: "Complete",
        value: summaryStats.complete,
      },
    ];
    setPieData(newPieData);
  }, [summaryStats]);

  return (
    <ResponsiveContainer height={200}>
      <PieChart width={"100%"} height={"100%"}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={"40%"}
          outerRadius={"70%"}
          startAngle={90}
          endAngle={550}
          label
        >
          <Cell fill={COLORS[0]} />
          <Cell fill={COLORS[1]} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default function Viewer() {
  const signalCorridorsRaw = useSocrata(SOCRATA_ENDPOINT_CORRIDORS);

  const signalCorridors = useMultiPointCorridors(
    signalCorridorsRaw?.data?.features || []
  );

  const retimingDataRaw = useSocrata(SOCRATA_ENDPOINT_RETIMING);

  const { years, selectedYear, setSelectedYear } = useYears(
    retimingDataRaw.data
  );

  const retimingDataFiltered = useFilteredRetimingData(
    retimingDataRaw?.data || [],
    selectedYear
  );

  const signalCorridorsFiltered = useFilteredCorridors(
    signalCorridors,
    retimingDataFiltered
  );

  const summaryStats = useSummaryStats(
    retimingDataFiltered,
    signalCorridorsRaw?.data?.features || []
  );

  if (retimingDataFiltered?.length > 0) {
    let bob = retimingDataFiltered;

    const reduceAll = (accumulator, currentValue) => {
      accumulator.total_vol =
        accumulator.total_vol + parseFloat(currentValue?.total_vol || 0);
      accumulator.vol_wavg_tt_seconds =
        accumulator.vol_wavg_tt_seconds +
        parseFloat(currentValue?.vol_wavg_tt_seconds || 0);
      return accumulator;
    };

    let totals = bob.reduce(reduceAll, {
      total_vol: 0,
      vol_wavg_tt_seconds: 0,
    });
    console.log(totals.vol_wavg_tt_seconds / totals.total_vol);
  }
  return (
    <>
      <Nav />
      <Container fluid>
        <Row>
          <Col>
            <h2 className="text-primary">Signal Re-Timing</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={3}>
            <Form.Select
              aria-label="Year selector"
              onChange={(e) => setSelectedYear(e.target.value)}
              value={selectedYear || ""}
            >
              {years.map((year) => {
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col className="pb-2">
            <ProgressChart summaryStats={summaryStats} />
          </Col>
        </Row>
        <GeoTable
          geojson={signalCorridorsFiltered}
          headers={TABLE_HEADERS}
          filterDefs={FILTERS}
          layerStyle={POINT_LAYER_STYLE}
          applyDynamicStyle={applyDynamicStyle}
          mapOverlayConfig={mapOverlayConfig}
        />
      </Container>
      <Footer />
    </>
  );
}
