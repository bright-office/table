import React, { useContext } from 'react';
import { mergeRefs, useClassNames } from './utils';
import TableContext from './TableContext';
import { StandardProps } from './@types/common';
import { ROW_HEADER_HEIGHT, ROW_HEIGHT } from './constants';
import { useRowSelection } from './utils/useRowSelection';
import { TreeTableCheckbox } from './components/SelectionCheckbox';

export interface RowProps extends StandardProps {
    width?: number;
    height?: number;
    headerHeight?: number;
    top?: number;
    isHeaderRow?: boolean;
    rowRef?: any;
    rowSpan?: number;

    /**
     * Control whether to strip rows or not 
     * To control the stripe color, change the css variable
     * ``` css
     * --bt-striped-row-bg: background;
     *  ```
     */
    stripeRows?: boolean;

    /**
     * Control whether to strip extended rows or not in tree table
     * To control the stripe color, change the css variable
     * ``` css
     * --bt-striped-extended-row-bg: background;
     *  ```
     */
    stripeExtendedRows?: boolean;
}

const Row = React.forwardRef((props: RowProps, ref: React.Ref<HTMLDivElement>) => {
    const {
        classPrefix = 'row',
        height = ROW_HEIGHT,
        headerHeight = ROW_HEADER_HEIGHT,
        className,
        width,
        top,
        style,
        isHeaderRow,
        rowRef,
        children,
        rowSpan,
        "data-depth": depth = 0,
        stripeRows = false,
        stripeExtendedRows = false,
        onClick: onRowSelect,
        ...rest
    } = props as RowProps & {
        "data-depth"?: number
    };

    const { translateDOMPositionXY } = useContext(TableContext);
    const { withClassPrefix, merge } = useClassNames(classPrefix);
    const isExpanded = depth > 0;

    const {
        handleNormalSelection,
        getRowSelectedStatus,
        handleTreeRowSelection,
        handleHeaderSelection,
    } = useRowSelection();

    let isChecked = true;

    const classes = merge(className,
        withClassPrefix({ header: isHeaderRow, rowspan: rowSpan }),
        "bt-row",
        isHeaderRow
            ? "bt-row-header"
            : isExpanded
                ? "bt-row-expanded"
                : "bt-row-normal",

        // NOTE: This can be refactored and made a little cleaner and predicatable.
        // Stripe rows
        !isHeaderRow && (stripeRows && !isExpanded) ? "bt-row-normal-striped" : "",
        !isHeaderRow && (stripeExtendedRows && isExpanded) ? "bt-row-expanded-striped" : "",

        // selected classes
        !isHeaderRow && isChecked && isExpanded ? "bt-row-expanded-selected" : "",
        !isHeaderRow && isChecked && !isExpanded ? "bt-row-normal-selected" : "",
    );

    const styles = {
        minWidth: width,
        height: isHeaderRow ? headerHeight : height,
        ...style
    };

    translateDOMPositionXY?.(styles as CSSStyleDeclaration, 0, top);

    const variants = {
        isHeader: isHeaderRow || false,
        isNormal: false,
        isTree: true,
    };

    const handleRowSelection = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (variants.isHeader) {
            handleHeaderSelection({ onRowSelect: onRowSelect })
            return;
        }

        if (variants.isTree) {
            handleTreeRowSelection({
                onRowSelect: onRowSelect,
                treeProps: specificProps as TreeTableCheckbox,
                currentRowId: currentRowId as string,
            })
            return;
        }

        handleNormalSelection({
            currentRowId: currentRowId as string,
            onRowSelect
        })
    };

    return (
        <div
            onClick={}
            role="row"
            {...rest}
            ref={mergeRefs(rowRef, ref)}
            className={classes}
            style={styles}>
            {children}
        </div >
    );
});

Row.displayName = 'Table.Row';

export default Row;
