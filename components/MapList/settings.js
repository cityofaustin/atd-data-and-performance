/**
 * minimum zoom that will be applied if a list item/feature is clicked
 */
export const MIN_FEATURE_ZOOM_TO = 14;

/**
 * Max width for 'isSmallScreen' media query. Matches bootsrap 'md'
 */
export const MAX_SMALL_SCREEN_WIDTH_PIXELS = 991;

/**
 * The layout state object
 * @typedef {Object} LayoutState
 * @property {boolean} map - if the map panel should render
 * @property {boolean} listSearch - if the list + search components should render in the side panel
 * @property {boolean} sidebar - if the entire side panel should render (includes title, list, and search)
 * @property {boolean} title - if the title component should render
 * @property {boolean} info - if the InfoContent component should render (in a Modal on desktop)
 */

/**
 * Get initial layout state
 * @param { boolean } isSmallScreen - if layout should accomodate a small/mobile display
 * @returns { LayoutState } - the initial LayoutState
 */
export const getInitialLayout = (isSmallScreen) => ({
  map: true,
  listSearch: true,
  sidebar: !isSmallScreen,
  title: !isSmallScreen,
  info: false,
});

/**
 * A LayoutEventType that is sent in a LayoutEvent
 * @typedef {"viewPortChange" | "list" | "info" } LayoutEventType - the name of the layout event
 * viewPortChange - the viewport has changed from is/is not small screen
 * list - the 'List' tab has been selected on mobile
 * info - the 'Info' tab has been selected on mobile
 */

/**
 * A LayoutEvent object that is dispatched to the layoutReducer
 * @typedef {Object} LayoutEvent
 * @property {LayoutEventType} name - the name of the event
 * @property {boolean} isSmallScreen - if layout should accomodate a small/mobile display
 * @property {boolean} [show] - optional flag to indicate if the provided LayoutEventType should be shown
 */

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
 * @param { LayoutState } state - the current layout state. See `getInitialLayout` above for expected state properties.
 * @param { LayoutEvent } - the LayoutEvent object
 * @returns { LayoutState } - the updated LayoutState
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
