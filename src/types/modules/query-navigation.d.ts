import type Swiper from '../swiper-class.d.ts';

export interface QueryNavigationMethods {}

export interface QueryNavigationEvents {
  /**
   * Event will be fired on window query change
   */
  queryChange: (swiper: Swiper) => void;
  /**
   * Event will be fired when swiper updates the query
   */
  querySet: (swiper: Swiper) => void;
}

export interface QueryNavigationOptions {
  /**
   * Set to `true` to enable also navigation through slides (when querynav
   * is enabled) by browser history or by setting directly query on document location
   *
   * @default false
   */
  watchState?: boolean;

  /**
   * Works in addition to querynav to replace current url state with the
   * new one instead of adding it to history
   *
   * @default     false
   */
  replaceState?: boolean;

  /**
   * Designed to be used with Virtual slides when it is impossible to find slide in DOM by query (e.g. not yet rendered)
   *
   */
  getSlideIndex?: (swiper: Swiper, query: string) => number;
}
