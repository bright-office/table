import React, { useState, useCallback, useRef } from 'react';
import { omit } from "lodash";
import { SortType, RowDataType } from '../@types/common';
import getTableColumns from './getTableColumns';
import getTotalByColumns from './getTotalByColumns';
import getColumnProps from './getColumnProps';
import useUpdateEffect from './useUpdateEffect';
import { ColumnProps } from '../Column';
import useMount from './useMount';
import { ROW_SELECTION_COL_WIDTH } from './useTableDimension';

interface CellDescriptorProps<Row> {
    children: React.ReactNode[];
    rtl: boolean;
    minScrollX: React.MutableRefObject<number>;
    scrollX: React.MutableRefObject<number>;
    tableWidth: React.MutableRefObject<number>;
    headerHeight: number;
    showHeader: boolean;
    prefix: (str: string) => string;
    onSortColumn?: (dataKey: string, sortType?: SortType) => void;
    rowHeight?: number | ((rowData?: Row) => number);
    mouseAreaRef: React.RefObject<HTMLDivElement>;
    tableRef: React.RefObject<HTMLDivElement>;
    hasRowSelection: boolean;

    /**
     * setter function that can be used to set column information 
     * outside the table
     */
    setColumnStatus?: (status: tbtColumnStatus) => void;
}

interface CellDescriptor {
    columns: React.ReactNode[];
    headerCells: React.ReactNode[];
    bodyCells: React.ReactNode[];
    hasCustomTreeCol: boolean;
    allColumnsWidth: number;
}

export type tbtColumnStatus = Record<string, {
    hidden?: true,
    pinned?: "right" | "left",
    sort?: SortType | undefined,
    id: string,

    /**
     * The displayName of the column is the headers name
     * or to be more specific the header's text content. 
     */
    displayName: string,
}>

/**
 * Attach rendering-related attributes to all cells of the form and cache them.
 * @param props
 * @returns
 */
const useCellDescriptor = <Row extends RowDataType>(
    props: CellDescriptorProps<Row>
): CellDescriptor => {
    const {
        children,
        minScrollX,
        scrollX,
        tableWidth,
        headerHeight,
        showHeader,
        rowHeight,
        setColumnStatus,
    } = props;

    const [cacheData, setCacheData] = useState<CellDescriptor | null>();

    const clearCache = useCallback(() => {
        setCacheData(null);
    }, []);

    const columnWidths = useRef({});

    useMount(() => {
        // As the cells are cached before the table width is updated, it is necessary to clear the cache again. fix: #430
        clearCache();
    });

    useUpdateEffect(() => {
        clearCache();
    }, [children, tableWidth.current, scrollX.current, minScrollX.current]);

    if (cacheData) {
        return cacheData;
    }

    let hasCustomTreeCol = false;
    let left = 0; // Cell left margin
    const headerCells: React.ReactNode[] = []; // Table header cell
    const bodyCells: React.ReactNode[] = []; // Table body cell

    if (!children) {
        const cacheCell = {
            columns: [],
            headerCells,
            bodyCells,
            hasCustomTreeCol,
            allColumnsWidth: left
        };
        setCacheData(cacheCell);

        return cacheCell;
    }

    const rightPinnedCols: React.ReactElement[] = [];
    const unpinnedCols: React.ReactElement[] = [];

    const columns = getTableColumns(children) as React.ReactElement[];
    const count = columns.length;
    const { totalVisibleColWidth, totalVisibleFlexGrow } = getTotalByColumns<Row>(columns);

    // calculating the column status such as hidden, pin etc 
    let columnStatusCalc: tbtColumnStatus = {}

    const extractCellInfo = (column: React.ReactElement<ColumnProps<Row>>, index: number, ignorePinCheck = false) => {
        if (!React.isValidElement(column))
            return

        const columnKey = column.props.id;
        const canGetValidDisplayName = column.props.children?.[0].type.displayName === "HeaderCell" && typeof column.props.children?.[0]?.props.children === "string"
        const columnNameHeaderName = canGetValidDisplayName
            ? column.props.children?.[0].props.children
            : ""

        const isHidden = column.props.isHidden;

        if (columnKey)
            columnStatusCalc[columnKey] = {
                ...columnStatusCalc[columnKey],
                hidden: isHidden || undefined,
                sort: column.props.sort,
                displayName: columnNameHeaderName,
            }

        if (columnKey) {
            if (!columnStatusCalc?.[columnKey].sort)
                delete columnStatusCalc[columnKey].sort
            if (!columnStatusCalc[columnKey].hidden)
                delete columnStatusCalc[columnKey].hidden
            if (!columnStatusCalc[columnKey].pinned)
                delete columnStatusCalc[columnKey].pinned
        }

        if (isHidden)
            return;

        const isCurrentRightPinned = column.props.pinned === "right";
        const isCurrentLeftPinned = column.props.pinned === "left" || column.props.pinned;

        const isCurrentUnpinned = !isCurrentLeftPinned && !isCurrentRightPinned;

        const ignoreRightPinned = isCurrentRightPinned && !ignorePinCheck;
        const ignoreUnpinned = isCurrentUnpinned && !ignorePinCheck;

        if (ignoreRightPinned) {
            rightPinnedCols.push(column);
            if (columnKey)
                columnStatusCalc[columnKey] = {
                    ...columnStatusCalc[columnKey],
                    pinned: "right",
                }
            return;
        }

        if (ignoreUnpinned) {
            unpinnedCols.push(column);
            if (columnKey)
                columnStatusCalc[columnKey] = {
                    ...columnStatusCalc[columnKey],
                }
            return;
        }

        if (columnKey)
            columnStatusCalc[columnKey] = {
                ...columnStatusCalc[columnKey],
                pinned: isCurrentLeftPinned ? "left" : undefined,
            }

        if (columnKey)
            if (!columnStatusCalc[columnKey].pinned)
                delete columnStatusCalc[columnKey].pinned


        const columnChildren = column.props.children as React.ReactNode[];
        const columnProps = getColumnProps(column);

        const { width, flexGrow, minWidth, onResize, treeCol } = columnProps;

        if (treeCol) {
            hasCustomTreeCol = true;
        }

        if (columnChildren.length !== 2) {
            throw new Error(`Component <HeaderCell> and <Cell> is required, column index: ${index} `);
        }

        const headerCell = columnChildren[0] as React.ReactElement;
        const cell = columnChildren[1] as React.ReactElement;

        const cellWidthId = `${cell.props.dataKey}_${index}_width`;

        // get column width from cache.
        /* const initialColumnWidth = initialColumnWidths.current?.[cellWidthId]; */

        const currentWidth = columnWidths.current?.[cellWidthId];

        let cellWidth = currentWidth || width || 0;

        const isControlled = typeof width === 'number' && typeof onResize === 'function';

        if (tableWidth.current && flexGrow && totalVisibleFlexGrow) {
            const grewWidth = Math.max(
                ((tableWidth.current - totalVisibleColWidth) / totalVisibleFlexGrow) * flexGrow,
                minWidth || 60
            );
            /**
             * resizable = false, width will be recalc when table render.
             * resizable = true, only first render will use grewWidth.
             */

            // TODO: Remove this after verification.
            // cellWidth = resizable ? currentWidth || grewWidth : grewWidth;
            cellWidth = grewWidth;
        }

        let uniqueKey = `left-${index}`;
        let isFirstCol = index === 0;
        let isLastCol = index === count - 1

        if (isCurrentRightPinned) {
            uniqueKey = `right-${index}`
            isFirstCol = false
        }

        if (isCurrentUnpinned) {
            const isLeftPinPresent = columns.some((col) => col.props?.fixed === "left" || col.props?.fixed || false);

            if (isLeftPinPresent)
                isFirstCol = false
            else
                isFirstCol = index === 0

            uniqueKey = `un-${index}`;
        }

        const cellProps = {
            ...omit(columnProps, ['children', "pinned", "sort", "onHeaderClick", "customizable"]),
            'aria-colindex': index + 1,
            left,
            headerHeight,
            key: uniqueKey,
            width: isControlled ? width : cellWidth,
            height: typeof rowHeight === 'function' ? rowHeight() : rowHeight,
            firstColumn: isFirstCol,
            lastColumn: isLastCol,
        };

        if (showHeader && headerHeight) {
            const headerCellProps = {
                index,
                dataKey: cell.props.dataKey,
                isHeaderCell: true,
                minWidth: columnProps.minWidth,
                flexGrow: flexGrow,
                customizable: columnProps.customizable,
                pinned: isCurrentLeftPinned
                    ? "left"
                    : isCurrentRightPinned
                        ? "right"
                        : undefined,
                sort: columnProps.sort,
            };

            headerCells.push(
                React.cloneElement(headerCell,
                    {
                        onHeaderClick: column.props.onHeaderClick,
                        ...cellProps,
                        ...headerCellProps
                    })
            );
        }

        bodyCells.push(React.cloneElement(cell, cellProps));

        left += cellWidth;
    }


    // left pinned
    React.Children.forEach(columns, extractCellInfo);

    React.Children.forEach(unpinnedCols, (column, i) => {
        extractCellInfo(column, i, true)
    });

    React.Children.forEach(rightPinnedCols, (column, i) => {
        extractCellInfo(column, i, true)
    });

    setColumnStatus?.(columnStatusCalc);

    const cacheCell: CellDescriptor = {
        columns,
        headerCells,
        bodyCells,
        allColumnsWidth: left
            + (props.hasRowSelection
                ? ROW_SELECTION_COL_WIDTH
                : 0),
        hasCustomTreeCol
    };

    setCacheData(cacheCell);

    return cacheCell;
};

export default useCellDescriptor;
