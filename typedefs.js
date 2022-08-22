/**
 * FilterSettings - defines checkbox filter behavior
 * @typedef {Object} FilterSetting
 * @property {string} key - the unique name of this filter. must be unique to sibling FilterSetting's
 * @property {string} featureProp - the object property name that be used to access data to evaluate this filter condition
 * @property {boolean} checked - if the filter is enabled
 * @property {any} value - the value of the filter. When record[<featureProp>] has this value, the record will pass the filter condition
 * @property {string} color - a valid CSS color string which will be used to color this filter UI element
 */

/**
 * SearchSettings - defines searh input filter behavior
 * @typedef {Object} SearchSettings
 * @property {string} featureProp - the object property name that will searched
 * @property {boolean} placeholder - the search input's placeholder text
 */

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

export {};
