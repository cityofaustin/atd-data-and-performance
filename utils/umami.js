/**
 * Track a custom Umami event when the tracker is loaded.
 * Safe to call before the script finishes loading (no-op).
 *
 * @param {string} eventName
 * @param {Record<string, string | number | boolean>} [eventData]
 */
export const trackUmamiEvent = (eventName, eventData) => {
  if (
    typeof window === "undefined" ||
    typeof window.umami?.track !== "function"
  ) {
    return;
  }

  if (eventData) {
    window.umami.track(eventName, eventData);
    return;
  }

  window.umami.track(eventName);
};
