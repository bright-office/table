import React, { useContext } from 'react';
import { mergeRefs, useClassNames } from './utils';
import TableContext from './TableContext';
import { StandardProps } from './@types/common';
import { ROW_HEADER_HEIGHT, ROW_HEIGHT } from './constants';
import { rowSelectionState, useRowSelection } from './utils/useRowSelection';

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

    /**
    * Unique id of the row
    */
    rowId?: number | string;

    /**
     * Row selection callback function
     */
    onRowSelect?: ((state: rowSelectionState) => void);

    /**
     * Specify whether the table is a tree table or not
    */
    isTreeTable?: boolean;

    /**
     * Raw Row data of the current row, that is not a collection of cells.
     */
    rowData?: Record<any, any>;

    /**
     * Flag to know if row selection is active or not
    */
    rowSelection?: boolean;

    /**
     * Gives a border at the bottom of the row
     * @default true
     */
    rowBordered?: boolean;

    /**
     * Specifies whether or not to react on row hover.
     * @default true
     */
    rowHover?: boolean;
}

const Row = React.memo(React.forwardRef((props: RowProps, ref: React.Ref<HTMLDivElement>) => {
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
        onRowSelect,
        rowId,
        isTreeTable = false,
        rowSelection = false,
        rowData = {},
        rowBordered = true,
        rowHover = true,
        ...rest
    } = props as RowProps & {
        "data-depth"?: number
    };

    const childrenIds = rowData?.children?.map((child: any) => child?.id) || [];
    const treeChildInfo = {
        parentId: undefined,
        siblingsIds: [],
    }

    // first symbol is the parent symbol
    const symbols = Object.getOwnPropertySymbols(rowData);

    // tree child
    // @ts-ignore
    const rowParent = rowData[symbols[0]]
    if (rowParent) {
        treeChildInfo.parentId = rowParent?.id;
        treeChildInfo.siblingsIds = rowParent?.children?.filter((children: any) => children?.id !== rowData?.id)
            .map((siblings: any) => siblings?.id)
    }

    const { translateDOMPositionXY } = useContext(TableContext);
    const { withClassPrefix, merge } = useClassNames(classPrefix);
    const isExpanded = depth > 0;

    const {
        handleNormalSelection,
        handleTreeRowSelection,
    } = useRowSelection();

    let isChecked = true;

    const classes = merge(className,
        withClassPrefix({ header: isHeaderRow, rowspan: rowSpan }),
        rowHover ? "bt-row-with-hover" : "bt-row-no-hover",
        rowBordered ? "bt-row-with-border" : "bt-row-no-border",
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

    const handleRowSelection = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        rest.onClick?.(e);

        if (!rowSelection || isHeaderRow || !rowId)
            return;

        if (isTreeTable) {
            handleTreeRowSelection({
                onRowSelect: onRowSelect,
                currentRowId: rowId,

                treeProps: {
                    parentId: treeChildInfo.parentId,
                    childrenIds: childrenIds,
                },
            })
            return;
        }

        handleNormalSelection({
            currentRowId: rowId as string,
            onRowSelect
        })
    };

    return (
        <div
            role="row"
            {...rest}
            onClick={handleRowSelection}
            ref={mergeRefs(rowRef, ref)}
            className={classes}
            style={styles}>
            {children}
        </div >
    );
}));

Row.displayName = 'Table.Row';

export default Row;
