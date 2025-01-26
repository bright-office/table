import canUseDOM from 'dom-lib/esm/canUseDOM.js';

export default function isSupportTouchEvent() {
    return canUseDOM && 'ontouchstart' in window;
}
