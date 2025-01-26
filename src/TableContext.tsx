import React from 'react';
import translateDOMPositionXY from './utils/translateDOMPositionXY';
import isRTL from './utils/isRTL';

type TranslateDOMPositionXYCallback = (style: CSSStyleDeclaration, x?: number, y?: number) => void;

export interface TableContextProps {
    rtl: boolean;
    hasCustomTreeCol: boolean;
    isTree?: boolean;
    translateDOMPositionXY: TranslateDOMPositionXYCallback;
    classPrefix?: string;
    rowSelection?: boolean;
}

const TableContext = React.createContext<TableContextProps>({
    rtl: isRTL(),
    isTree: false,
    hasCustomTreeCol: false,
    translateDOMPositionXY,
    rowSelection: false
});

export default TableContext;
