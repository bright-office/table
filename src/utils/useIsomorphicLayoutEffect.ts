import { useEffect, useLayoutEffect } from 'react';
import canUseDOM from 'dom-lib/esm/canUseDOM.js';

const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
