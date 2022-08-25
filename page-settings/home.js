import { FaRegEnvelope } from "react-icons/fa";

// image size: 960 x 491px
export const PAGES = [
  {
    title: "Vision Zero Viewer",
    description:
      "View crash data by month, year, mode, demographics, time of day, and location",
    href: "https://visionzero.austin.gov/viewer/",
    img: { src: "/assets/vision-zero-viewer.jpg", alt: "Vision Zero Viewer" },
    external: true,
  },
  {
    title: "Bicycle Map",
    description: "Our citywide map of bicycle routes",
    href: "https://www.arcgis.com/apps/webappviewer/index.html?id=c7fecf32a2d946fabdf062285d58d40c",
    img: { src: "/assets/bicycle-map.jpg", alt: "Bicycle map" },
    external: true,
  },
  {
    title: "Traffic Cameras",
    description: "Live images from the City's traffic cameras",
    href: "/traffic-cameras",
    img: {
      src: "/assets/traffic-cameras.jpg",
      alt: "Traffic camera thumbnail",
    },
    key: "traffic_cameras",
  },
  {
    title: "Shared Mobility",
    description:
      "Explore ridership and travel patterns of shared mobility vehicles",
    href: "https://public.ridereport.com/austin",
    img: {
      src: "/assets/shared-mobility.png",
      alt: "Shared mobility dashboard",
      external: true,
    },
  },
  {
    title: "Signal Evaluations",
    description: "Our signal evaluation pipeline",
    href: "/signal-evaluations",
    key: "signal_evaluations",
    img: { src: "/assets/phb.jpg", alt: "Traffic signal image" },
  },
  {
    title: "Signal Monitor",
    description: "Real-time monitoring of the City's traffic signals",
    href: "/signal-monitor",
    img: { src: "/assets/signal-monitor.jpg", alt: "Signal monitor dashboard" },
    key: "signal_monitor",
  },
  {
    title: "Signal Assets",
    description: "Comprehensive map of our traffic and pedestrian signals",
    href: "https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=c9bda776b1934e439285570b29d3259c",
    img: { src: "/assets/signal-assets.jpg", alt: "Signal asset map" },
    external: true,
  },
  {
    title: "Strategic Performance",
    description: "Key performance indicators toward our strategic goals",
    href: "https://data.austintexas.gov/stories/s/Mobility-Dashboard/gzb5-ykym/",
    img: { src: "/assets/strategic-direction.png", alt: "Strategic direction" },
    external: true,
  },

  {
    title: "Open Data",
    description: "Browse and download the data that powers our operations",
    href: "https://data.austintexas.gov/browse?City-of-Austin_Department-=Austin+Transportation&limitTo=datasets",
    img: { src: "/assets/open-data-logo.png", alt: "Open data logo" },
    external: true,
  },
];

export const FOOTER_LINKS = [
  { label: "About", href: "https://austinmobility.io" },
  { label: "Data", href: "https://data.austintexas.gov" },
  {
    label: "Disclaimer",
    href: "https://www.austintexas.gov/page/city-austin-open-data-terms-use",
  },
  {
    label: "Code",
    href: "https://github.com/cityofaustin/atd-data-and-performance",
  },
  { label: "Privacy", href: "https://www.austintexas.gov/page/privacy-policy" },
  {
    label: "Contact",
    href: "mailto:transportation.data@austintexas.gov",
    icon: FaRegEnvelope,
  },
];
