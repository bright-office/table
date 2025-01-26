import { defer } from "lodash";

/**
 * Defer callbacks to wait for DOM rendering to complete.
 */
export default (callback: () => void) => {
    defer(callback, 'deferred');
};
