import typedefs from "../../typedefs";

/**
 * minimum zoom that will be applied if a list item/feature is clicked
 */
export const MIN_FEATURE_ZOOM_TO = 14;

/**
 * Max width for 'isSmallScreen' media query. Matches bootsrap 'md'
 */
export const MAX_SMALL_SCREEN_WIDTH_PIXELS = 991;

/**
 * Get initial layout state
 * @param { boolean } isSmallScreen - if layout should accomodate a small/mobile display
 * @returns { typedefs.LayoutState } - the initial LayoutState
 */
export const getInitialLayout = (isSmallScreen) => ({
  map: true,
  listSearch: true,
  sidebar: !isSmallScreen,
  title: !isSmallScreen,
  info: false,
});

/**
 * Manages MapList layout state.
 *
 * This function is passed to a useReducer hook, and the state object it returns is
 * consumed by the various MapList elements to determine if/how they should render.
 *
 *  Layout logic:
 *  - On desktop (!isSmallScreen), the layout is static, but for the handling of the "Info" button click, which
 *      have the downstream effect of causing the info modal to render
 *  - On mobile:
 *    - hide the page title
 *    - if the List tab is selected, show the "side panel" and hide Map
 *    - if the Map tab is selected hide the side panel and show the map
 *    - if the Info tab is selected, show the side panel and render the InfoContent inside it
 *  If the viewport size changes from is/is not small screen, reset layout state
 *
 * @param { typedefs.LayoutState } state - the current layout state. See `getInitialLayout` above for expected state properties.
 * @param { typedefs.LayoutEvent } - the LayoutEvent object
 * @returns { typedefs.LayoutState } - the updated LayoutState
 */
export const layoutReducer = (state, { name, show, isSmallScreen }) => {
  if (name === "viewPortChange" && isSmallScreen) {
    // viewport has changed - adjust for mobile
    return { ...state, map: true, sidebar: false, title: false };
  } else if (name === "viewPortChange" && !isSmallScreen) {
    // viewport has changed - adjust for desktop
    return { ...state, map: true, sidebar: true, title: true };
  }
  if (name === "list" && show) {
    return {
      ...state,
      sidebar: true,
      listSearch: true,
      map: false,
      info: false,
    };
  } else if (name === "list" && !show) {
    return { ...state, sidebar: false, map: true, info: false };
  }
  if (name === "info" && show && !isSmallScreen) {
    // on normal screen size open the info modal
    return {
      ...state,
      info: true,
    };
  } else if (name === "info" && !show && !isSmallScreen) {
    return { ...state, info: false };
  }
  if (name === "info" && show && isSmallScreen) {
    // on mobile, info content renders in sidebar (with listsearch hidden)
    return {
      ...state,
      map: false,
      info: true,
      listSearch: false,
      sidebar: true,
    };
  }
  return state;
};
