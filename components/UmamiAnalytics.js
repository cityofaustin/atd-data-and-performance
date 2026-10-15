import { useEffect } from "react";

const SCRIPT_URL = "https://umami.austinmobility.io/script.js";

// Fixed ID for the <script> tag in the DOM. Used to avoid injecting the tracker twice
const SCRIPT_ELEMENT_ID = "umami-analytics";

/**
 * Loads the Umami analytics tracker script when VITE_UMAMI_WEBSITE_ID is set.
 * Configure per deploy context in the Netlify UI (Environment variables):
 *
 *   VITE_UMAMI_WEBSITE_ID  → (website ID from Umami)
 */
const UmamiAnalytics = () => {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

  useEffect(() => {
    if (!websiteId) {
      return;
    }

    // Avoid injecting the tracker twice
    if (document.getElementById(SCRIPT_ELEMENT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ELEMENT_ID;
    script.defer = true;
    script.src = SCRIPT_URL;
    script.setAttribute("data-website-id", websiteId);

    document.head.appendChild(script);
  }, [websiteId]);

  return null;
};

export default UmamiAnalytics;
