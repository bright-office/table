import React, { useRef, useCallback, useImperativeHandle, useReducer, useMemo, ReactNode, cloneElement, useState, useEffect } from 'react';
import { getTranslateDOMPositionXY } from 'dom-lib/esm/translateDOMPositionXY.js';
import { isFunction } from "lodash";
import { debounce } from "lodash";
import Row, { RowProps } from './Row';
import CellGroup from './CellGroup';
import Scrollbar, { ScrollbarInstance } from './Scrollbar';
import MouseArea from './MouseArea';
import Loader from './Loader';
import EmptyMessage from './EmptyMessage';
import TableContext from './TableContext';
import Cell, { InnerCellProps } from './Cell';
import HeaderCell, { HeaderCellProps } from './HeaderCell';
import Column, { ColumnProps } from './Column';
import ColumnGroup from './ColumnGroup';
import {
    SCROLLBAR_WIDTH,
    CELL_PADDING_HEIGHT,
    SORT_TYPE,
    TREE_DEPTH,
    ROW_HEADER_HEIGHT,
    ROW_HEIGHT,
    TRANSFORM_REGEX
} from './constants';
import {
    mergeCells,
    isRTL,
    findRowKeys,
    resetLeftForCells,
    useClassNames,
    useControlled,
    useUpdateEffect,
    useCellDescriptor,
    useTableDimension,
    useTableRows,
    useAffix,
    useScrollListener,
    usePosition,
    useTableData,
    isSupportTouchEvent
} from './utils';
import type {
    StandardProps,
    SortType,
    RowKeyType,
    TableLocaleType,
    TableSizeChangeEventName,
    RowDataType,
} from './@types/common';
import { flattenChildren } from './utils/children';

import "./less/index.less";

import Pagination from './Pagination';
import { paginationProps } from './Pagination';
import { rowSelectionState, RowSelectionWrapper } from './utils/useRowSelection';
import { ROW_SELECTION_COL_WIDTH } from './utils/useTableDimension';
import { tbtColumnStatus } from './utils/useCellDescriptor';

export interface TableProps<Row extends RowDataType, Key extends RowKeyType>
    extends Omit<StandardProps, 'onScroll' | 'children'> {
    /**
     * The height of the table will be automatically expanded according to the number of data rows,
     * and no vertical scroll bar will appear
     * */
    autoHeight?: boolean;

    name?: string;

    /** Affix the table header to the specified position on the page */
    affixHeader?: boolean | number;

    /** Affix the table horizontal scrollbar to the specified position on the page */
    affixHorizontalScrollbar?: boolean | number;

    /** Show the border of the table
     *  @deprecated
     *
     *  now defaults to border.
     */
    bordered?: boolean;

    /** Display the borders of table cells */
    cellBordered?: boolean;

    /** Default sort type */
    defaultSortType?: SortType;

    /** Disable scroll bar */
    disabledScroll?: boolean;

    /** Expand all nodes By default */
    defaultExpandAllRows?: boolean;

    /** Specify the default expanded row by  rowkey */
    defaultExpandedRowKeys?: readonly Key[];

    /** Table data */
    data?: readonly Row[];

    /** Specify the default expanded row by  rowkey (Controlled) */
    expandedRowKeys?: readonly Key[];

    /** The visible height of the table (the height of the scrollable container). */
    height?: number;

    /** The minimum height of the table. The height is maintained even when the content is not stretched. */
    minHeight?: number;

    /**
     * The maximum height of the table.
     * Usually used together with `autoHeight`. When the height of the table exceeds `maxHeight`, the table will have a scroll bar.
     */
    maxHeight?: number;

    /** The row of the table has a mouseover effect */
    hover?: boolean;

    /** The height of the table header */
    headerHeight?: number;

    /** The component localized character set. */
    locale?: TableLocaleType;

    /** Show loading */
    loading?: boolean;

    /** Whether to enable loading animation */
    loadAnimation?: boolean;

    /** The row height of the table */
    rowHeight?: number | ((rowData?: Row) => number);

    /** Each row corresponds to the unique key in  data */
    rowKey?: RowKeyType;

    /** The table will be displayed as a tree structure */
    isTree?: boolean;

    /** Set the height of an expandable area */
    rowExpandedHeight?: ((rowData?: Row) => number) | number;

    /** Add an optional extra class name to row */
    rowClassName?: string | ((rowData: Row, rowIndex: number) => string);

    /** Whether to display the header of the table */
    showHeader?: boolean;

    /** Sort Column Name */
    sortColumn?: string;

    /** Sort type */
    sortType?: SortType;

    /**
     * Use the return value of `shouldUpdateScroll` to determine
     * whether to update the scroll after the table size is updated.
     */
    shouldUpdateScroll?:
    | boolean
    | ((event: TableSizeChangeEventName) => {
        x?: number;
        y?: number;
    });

    /** Enable 3D transition rendering to improve performance when scrolling. */
    translate3d?: boolean;

    /** Right to left */
    rtl?: boolean;

    /** The width of the table. When it is not set, it will adapt according to the container */
    width?: number;

    /**
     * Whether to appear line breaks where text overflows its content box
     * https://developer.mozilla.org/en-US/docs/Web/CSS/word-break
     */
    wordWrap?: boolean | 'break-all' | 'break-word' | 'keep-all';

    /**
     * Control whether to strip rows or not 
     * To control the stripe color, change the css variable
     * ``` css
     * --bt-striped-row-bg: background;
     *  ```
     *  @default true
     */
    stripeRows?: boolean;

    /**
     * Control whether to strip extended rows or not in tree table
     * To control the stripe color, change the css variable
     * ``` css
     * --bt-striped-extended-row-bg: background;
     *  ```
     *  @default false
     */
    stripeExtendedRows?: boolean;

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

    /**
     * Sets the force render function.
     * which can be used to manually reload the table.
     */
    setForceRender?: (fn: () => void) => void;

    /** Tree table, the callback function in the expanded node */
    renderTreeToggle?: (
        expandButton: React.ReactNode,
        rowData?: Row,
        expanded?: boolean
    ) => React.ReactNode;

    /** Customize what you can do to expand a zone */
    renderRowExpanded?: (rowData?: Row) => React.ReactNode;

    /** Custom row element */
    renderRow?: (children?: React.ReactNode, rowData?: Row) => React.ReactNode;

    /** Customized data is empty display content */
    renderEmpty?: (info: React.ReactNode) => React.ReactNode;

    /**
     * setter function that can be used to set column information 
     * outside the table
     */
    setColumnStatus?: (status: tbtColumnStatus) => void;

    /** Customize the display content in the data load */
    renderLoading?: (loading: React.ReactNode) => React.ReactNode;

    /** Click the callback function after the row and return to rowDate */
    onRowClick?: (rowData: Row, event: React.MouseEvent) => void;

    /** Callback after right-click row */
    onRowContextMenu?: (rowData: Row, event: React.MouseEvent) => void;

    /** Callback function for scroll bar scrolling */
    onScroll?: (scrollX: number, scrollY: number) => void;

    /** Click the callback function of the sort sequence to return the value sortColumn, sortType */
    onSortColumn?: (dataKey: string, sortType?: SortType) => void;

    /** Tree table, the callback function in the expanded node */
    onExpandChange?: (expanded: boolean, rowData: Row) => void;

    /** Callback for the `touchstart` event. */
    onTouchStart?: (event: React.TouchEvent) => void;

    /** Callback for the `touchmove` event. */
    onTouchMove?: (event: React.TouchEvent) => void;

    /** Callback for the `touchend` event. */
    onTouchEnd?: (event: React.TouchEvent) => void;

    /**
     * Callback after table data update.
     * @deprecated use `shouldUpdateScroll` instead
     **/
    onDataUpdated?: (nextData: Row[], scrollTo: (coord: { x: number; y: number }) => void) => void;

    /**
     * A ref attached to the table body element
     * @deprecated use `ref` instead (see `ref.current.body`)
     **/
    bodyRef?: (ref: HTMLElement) => void;

    /**
     * Server side laravel pagination.
     */
    pagination?: paginationProps;

    /**
     * Displays checkbox for selecting rows.
     */
    rowSelection?: boolean;

    /**
     * Callback function when a row gets selected
     * It is a basically a row click with selection state, when row selection
     * is activated.
     */
    onRowSelect?: (state: rowSelectionState) => void

    /**
     * Add something at the top of table.Like a navigaiton
     * provides  headersProps.
     * example: Search with some filter icons.
     * @deprecated
     * Create the nav yourself to avoid memoization issues.
     * will be removed in version 0.0.6
     */
    renderTableTopNav?: (headers: Record<string, any>[], isTree: boolean) => ReactNode;

    /**
     * Header customize btn click function.
     */
    onHeaderClick?: (headerProps: Record<string, any>, event: React.MouseEvent) => void;

    children?:
    | React.ReactNode
    | React.ReactNode[]
    | ((props: {
        Cell: (
            props: InnerCellProps<Row, Key> & React.RefAttributes<HTMLDivElement>
        ) => React.ReactElement;
        Column: (props: ColumnProps<Row>) => React.ReactElement;
        ColumnGroup: typeof ColumnGroup;
        HeaderCell: (
            props: HeaderCellProps<Row, Key> & React.RefAttributes<HTMLDivElement>
        ) => React.ReactElement;
    }) => React.ReactNode | React.ReactNode[]);
}

interface TableRowProps extends RowProps {
    key?: string | number;
    rowIndex: number;
    depth?: number;
}

const DATA_PLACEHOLDER = [];

const getChildrenProps = {
    Cell,
    HeaderCell,
    Column,
    ColumnGroup
};

const Table = React.memo(React.forwardRef((props: TableProps<RowDataType, RowKeyType>, ref) => {
    const {
        affixHeader,
        children: getChildren,
        classPrefix = 'bright-table',
        className,
        data: dataProp = DATA_PLACEHOLDER,
        defaultSortType = SORT_TYPE.DESC as SortType,
        width: widthProp,
        expandedRowKeys: expandedRowKeysProp,
        defaultExpandAllRows,
        defaultExpandedRowKeys,
        style,
        id,
        isTree,
        hover = true,
        cellBordered,
        wordWrap,
        loading,
        locale = {
            emptyMessage: 'No data found',
            loading: 'Loading...'
        },
        showHeader = true,
        sortColumn,
        rowHeight = ROW_HEIGHT,
        sortType: sortTypeProp,
        headerHeight: headerHeightProp = ROW_HEADER_HEIGHT,
        minHeight = 0,
        maxHeight,
        height = 200,
        autoHeight,
        rtl: rtlProp,
        translate3d,
        rowKey,
        rowClassName,
        rowExpandedHeight = 100,
        disabledScroll,
        affixHorizontalScrollbar,
        loadAnimation,
        shouldUpdateScroll = true,
        renderRow: renderRowProp,
        renderRowExpanded: renderRowExpandedProp,
        renderLoading,
        renderEmpty,
        onSortColumn,
        onScroll,
        renderTreeToggle,
        onRowClick,
        onRowContextMenu,
        onExpandChange,
        onTouchStart,
        onTouchMove,
        onTouchEnd,

        rowSelection = false,
        // pagination properties
        pagination,
        onRowSelect,
        onHeaderClick,
        stripeRows = true,
        stripeExtendedRows,
        rowHover = true,
        rowBordered = true,
        setColumnStatus,
        setForceRender,
        ...rest
    } = props;

    const children = useMemo(
        () => flattenChildren(isFunction(getChildren) ? getChildren(getChildrenProps as any) : getChildren),
        [getChildren]
    );

    const {
        withClassPrefix,
        merge: mergeCls,
        prefix
    } = useClassNames(classPrefix, typeof classPrefix !== 'undefined');

    {/* // Use `forceUpdate` to force the component to re-render after manipulating the DOM. */ }
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setForceRender?.(forceUpdate);
    }, [forceUpdate])

    const [expandedRowKeys, setExpandedRowKeys] = useControlled(
        expandedRowKeysProp,
        defaultExpandAllRows
            ? findRowKeys(dataProp, rowKey, isFunction(renderRowExpandedProp))
            : defaultExpandedRowKeys || []
    );

    const data = useTableData({ data: dataProp, isTree, expandedRowKeys, rowKey });

    if (isTree) {
        if (!rowKey) {
            throw new Error('The `rowKey` is required when set isTree');
        } else if (data.length > 0) {
            if (!data[0].hasOwnProperty(rowKey)) {
                throw new Error('The `rowKey` is not found in data');
            }
        }
    }

    const { tableRowsMaxHeight, bindTableRowsRef } = useTableRows({
        data: dataProp,
        expandedRowKeys,
        wordWrap,
        prefix
    });

    const headerHeight = showHeader ? headerHeightProp : 0;
    const rtl = rtlProp || isRTL();

    const getRowHeight = () => {
        return typeof rowHeight === 'function' ? rowHeight() : rowHeight;
    };

    const translateDOMPositionXY = useRef(
        getTranslateDOMPositionXY({ forceUseTransform: true, enable3DTransform: translate3d })
    );

    // Check for the existence of fixed columns in all column properties.
    const shouldFixedColumn = children.some(
        child => {
            return React.isValidElement(child) && child?.props?.fixed
        }
    );

    // Check all column properties for the existence of rowSpan.
    const shouldRowSpanColumn = children.some(
        child => React.isValidElement(child) && child?.props?.rowSpan
    );

    const visibleRows = useRef<React.ReactNode[]>([]);

    const mouseAreaRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const tableHeaderRef = useRef<HTMLDivElement>(null);
    const affixHeaderWrapperRef = useRef<HTMLDivElement>(null);
    const headerWrapperRef = useRef<HTMLDivElement>(null);
    const tableBodyRef = useRef<HTMLDivElement>(null);
    const wheelWrapperRef = useRef<HTMLDivElement>(null);
    const scrollbarXRef = useRef<ScrollbarInstance>(null);
    const scrollbarYRef = useRef<ScrollbarInstance>(null);
    const scrollOffsetXRef = useRef<number>(0);
    const scrollOffsetYRef = useRef<number>(0);

    // TODO: Check should preserve scroll position.
    // And then only reset the value to the original or current value
    const handleTableResizeChange = useCallback((_prevSize, event: TableSizeChangeEventName) => {
        if (event === "bodyHeightChanged") {
            onScrollTop(Math.abs(scrollY.current));
        }
        if (event === "bodyWidthChanged" || event === "widthChanged") {
            onScrollLeft(Math.abs(scrollX.current));
        }

        forceUpdate();
    }, []);

    const {
        contentHeight,
        contentWidth,
        minScrollY,
        minScrollX,
        scrollY,
        scrollX,
        tableWidth,
        tableOffset,
        headerOffset,
        setScrollY,
        setScrollX,
        getTableHeight
    } = useTableDimension({
        // The data should be flattened,
        // otherwise the array length required to calculate the scroll height in the TreeTable is not real.
        data,
        width: widthProp,
        rowHeight,
        tableRef,
        headerWrapperRef,
        prefix,
        affixHeader,
        affixHorizontalScrollbar,
        headerHeight,
        height,
        minHeight,
        maxHeight,
        autoHeight,
        children,
        expandedRowKeys,
        showHeader,
        onTableScroll: debounce((coords: { x?: number; y?: number }) => onScrollTo(coords), 100),
        onTableResizeChange: handleTableResizeChange,
        hasPagination: (props.pagination && (props.pagination?.serverResponse?.links?.length || 0) > 3),
        hasRowSelection: rowSelection
    });

    useAffix({
        getTableHeight,
        contentHeight,
        affixHorizontalScrollbar,
        affixHeader,
        tableOffset,
        headerOffset,
        headerHeight,
        scrollbarXRef,
        affixHeaderWrapperRef
    });

    const { forceUpdatePosition, deferUpdatePosition } = usePosition({
        data: dataProp,
        height,
        tableWidth,
        tableRef,
        prefix,
        translateDOMPositionXY,
        wheelWrapperRef,
        headerWrapperRef,
        affixHeaderWrapperRef,
        tableHeaderRef,
        scrollX,
        scrollY,
        contentWidth,
        shouldFixedColumn
    });

    const {
        isScrolling,
        onScrollHorizontal,
        onScrollVertical,
        onScrollBody,
        onScrollTop,
        onScrollLeft,
        onScrollTo,
        onScrollByKeydown
    } = useScrollListener({
        rtl,
        data: dataProp,
        height,
        getTableHeight,
        contentHeight,
        headerHeight,
        autoHeight,
        maxHeight,
        tableBodyRef,
        scrollbarXRef,
        scrollbarYRef,
        disabledScroll,
        loading,
        tableRef,
        contentWidth,
        tableWidth,
        scrollY,
        minScrollY,
        minScrollX,
        scrollX,
        setScrollX,
        setScrollY,
        forceUpdatePosition,
        deferUpdatePosition,
        onScroll,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    });

    const { headerCells, bodyCells, allColumnsWidth, hasCustomTreeCol } = useCellDescriptor({
        children,
        rtl,
        mouseAreaRef,
        tableRef,
        minScrollX,
        scrollX,
        tableWidth,
        headerHeight,
        showHeader,
        prefix,
        onSortColumn,
        setColumnStatus,
        rowHeight,
        hasRowSelection: rowSelection
    });

    const colCounts = useRef(headerCells?.length || 0);

    useUpdateEffect(() => {
        if (headerCells?.length !== colCounts.current) {
            onScrollLeft(0);
            colCounts.current = headerCells?.length || 0;
        }
    }, [children]);

    useImperativeHandle(ref, () => ({
        get root() {
            return tableRef.current;
        },
        get body() {
            return wheelWrapperRef.current;
        },

        // The scroll position of the table
        get scrollPosition() {
            return {
                top: Math.abs(scrollY.current),
                left: Math.abs(scrollX.current)
            };
        },
        scrollTop: onScrollTop,
        scrollLeft: onScrollLeft
    }));

    const rowWidth = (allColumnsWidth > tableWidth.current)
        ? allColumnsWidth
        : tableWidth.current;

    // Whether to show vertical scroll bar
    const hasVerticalScrollbar = contentHeight.current > getTableHeight() - headerHeight;

    // Whether to show the horizontal scroll bar
    const hasHorizontalScrollbar = contentWidth.current > tableWidth.current;

    const classes = mergeCls(
        className,
        withClassPrefix({
            loading,
            treetable: isTree,
            hover: hover && !shouldRowSpanColumn,
            'has-rowspan': shouldRowSpanColumn,
            'word-wrap': wordWrap,
            'cell-bordered': cellBordered
        })
    );

    const styles = {
        width: widthProp || 'auto',
        height: getTableHeight(),
        ...style
    };

    const paginationRef = useRef<HTMLDivElement>(null);

    const [calculatedTableHeight, setCalculatedTableHeight] = useState(() => ({
        tableHeight: getTableHeight(),
        tableHeightWithoutPagination: getTableHeight(),
        paginationHeight: 0,
    }));

    const {
        paginationHeight,
        tableHeight,
        tableHeightWithoutPagination
    } = calculatedTableHeight;

    useEffect(() => {
        if (!paginationRef.current) {
            setCalculatedTableHeight({
                tableHeight: getTableHeight(),
                tableHeightWithoutPagination: getTableHeight() - 2,
                paginationHeight: 0
            });

            return;
        }

        setCalculatedTableHeight(() => {
            let paginationHeight = 0;

            if (pagination && paginationRef.current) {
                paginationHeight = paginationRef.current?.getBoundingClientRect().height || 0;
            }

            return {
                paginationHeight: paginationHeight,
                tableHeight: getTableHeight(),
                tableHeightWithoutPagination: getTableHeight() - paginationHeight - 2,
            }
        })
    }, [paginationRef.current])


    const renderRowExpanded = useCallback(
        (rowData?: RowDataType) => {
            let height = 0;
            if (typeof rowExpandedHeight === 'function') {
                height = rowExpandedHeight(rowData);
            } else {
                height = rowExpandedHeight;
            }
            const styles = { height };

            if (typeof renderRowExpandedProp === 'function') {
                return (
                    <div className={prefix('row-expanded')} style={styles}>
                        {renderRowExpandedProp(rowData)}
                    </div>
                );
            }
            return null;
        },
        [prefix, renderRowExpandedProp, rowExpandedHeight]
    );

    const renderRow = (
        props: TableRowProps,
        cells: any[],
        shouldRenderExpandedRow?: boolean,
        rowData?: any
    ) => {
        const { depth, rowIndex, ...restRowProps } = props;

        const rowId = rowData?.id;

        // Actually location where headers gets rendered
        if (props.isHeaderRow) {
            cells = cells.map((cell) => {
                const isCustomizable = cell?.props?.customizable;
                const hasOnHeaderCustomizeClick = cell?.props?.onHeaderCustomizeClick;

                if (isCustomizable && !hasOnHeaderCustomizeClick) {
                    const updatedCell = cloneElement(cell, {
                        ...cell.props,
                        onHeaderClick: cell.props?.onHeaderClick ?? onHeaderClick,
                    })
                    return updatedCell
                }

                return cell;
            })
        }

        if (typeof rowClassName === 'function') {
            restRowProps.className = rowClassName(rowData, rowIndex);
        } else {
            restRowProps.className = rowClassName;
        }

        const rowStyles: React.CSSProperties = {
            ...props?.style
        };
        let rowRight = 0;

        if (rtl && contentWidth.current > tableWidth.current) {
            rowRight = tableWidth.current - contentWidth.current;
            rowStyles.right = rowRight;
        }

        let rowNode: React.ReactNode = null;

        // IF there are fixed columns, add a fixed group
        if (shouldFixedColumn && contentWidth.current > tableWidth.current) {
            const fixedLeftCells: React.ReactNode[] = [];
            const fixedRightCells: React.ReactNode[] = [];
            const scrollCells: React.ReactNode[] = [];
            let fixedLeftCellGroupWidth = 0;
            let fixedRightCellGroupWidth = 0;

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                const { fixed, width } = cell.props;

                let isFixedStart = fixed === 'left' || fixed === true;
                let isFixedEnd = fixed === 'right';

                if (rtl) {
                    isFixedStart = fixed === 'right';
                    isFixedEnd = fixed === 'left' || fixed === true;
                }

                if (isFixedStart) {
                    fixedLeftCells.push(cell);
                    fixedLeftCellGroupWidth += width;
                } else if (isFixedEnd) {
                    fixedRightCells.push(cell);
                    fixedRightCellGroupWidth += width;
                } else {
                    scrollCells.push(cell);
                }

            }

            if (hasVerticalScrollbar && fixedRightCellGroupWidth) {
                fixedRightCellGroupWidth += SCROLLBAR_WIDTH;
            }

            rowNode = (
                <>
                    {fixedLeftCellGroupWidth ? (
                        <CellGroup
                            fixed="left"
                            height={props.isHeaderRow ? props.headerHeight : props.height}
                            width={fixedLeftCellGroupWidth}
                            style={
                                rtl
                                    ? { right: tableWidth.current - fixedLeftCellGroupWidth - rowRight }
                                    : undefined
                            }
                        >
                            {mergeCells(resetLeftForCells(fixedLeftCells), {
                                rowSelection,
                                onRowSelect: onRowSelect,
                                shouldRenderCheckbox: !rtl && rowSelection
                            })}
                        </CellGroup>
                    ) : null}

                    <CellGroup>
                        {mergeCells(scrollCells, {
                            leftFixedWidth: fixedLeftCellGroupWidth,
                            onRowSelect: onRowSelect,
                            shouldRenderCheckbox: !fixedLeftCellGroupWidth && rowSelection,
                            rowSelection
                        })}
                    </CellGroup>

                    {fixedRightCellGroupWidth ? (
                        <CellGroup
                            fixed="right"
                            style={
                                rtl
                                    ? { right: 0 - rowRight }
                                    : { left: tableWidth.current - fixedRightCellGroupWidth }
                            }
                            height={props.isHeaderRow ? props.headerHeight : props.height}
                            width={fixedRightCellGroupWidth}
                        >
                            {mergeCells(
                                resetLeftForCells(fixedRightCells, hasVerticalScrollbar ? SCROLLBAR_WIDTH : 0),
                                {
                                    rowSelection,
                                    onRowSelect: onRowSelect,
                                    shouldRenderCheckbox: rtl && rowSelection
                                }
                            )}
                        </CellGroup>
                    ) : null}

                    {shouldRenderExpandedRow && renderRowExpanded(rowData)}
                </>
            );
        } else {
            rowNode = (
                <>
                    <CellGroup>
                        {mergeCells(cells, {
                            rowSelection,
                            onRowSelect: onRowSelect,
                            shouldRenderCheckbox: rowSelection
                        })}
                    </CellGroup>

                    {shouldRenderExpandedRow && renderRowExpanded(rowData)}
                </>
            );
        }

        return (
            <Row
                rowId={rowId}
                {...restRowProps}
                data-depth={depth}
                style={rowStyles}
                stripeRows={stripeRows}
                stripeExtendedRows={stripeExtendedRows}
                onRowSelect={onRowSelect}
                rowSelection={rowSelection}
                isTreeTable={isTree}
                rowData={rowData}
            >
                {renderRowProp ? renderRowProp(rowNode, rowData) : rowNode}
            </Row>
        );
    };

    const renderTableHeader = (headerCells: any[], rowWidth: number) => {
        const rowProps: TableRowProps = {
            'aria-rowindex': 1,
            rowRef: tableHeaderRef,
            width: rowWidth,
            height: getRowHeight(),
            headerHeight,
            isHeaderRow: true,
            top: 0,
            rowIndex: -1,
        };

        const fixedStyle: React.CSSProperties = {
            overflow: 'hidden',
            width: tableWidth.current - (rowSelection ? ROW_SELECTION_COL_WIDTH : 0),
        };

        // Affix header
        const header = (
            <div className={prefix('affix-header')} style={fixedStyle} ref={affixHeaderWrapperRef}>
                {renderRow(rowProps, headerCells)}
            </div>
        );

        return (
            <React.Fragment>
                {(affixHeader === 0 || affixHeader) && header}
                <div role="rowgroup" className={prefix('header-row-wrapper')} ref={headerWrapperRef}>
                    {renderRow(rowProps, headerCells)}
                </div>
            </React.Fragment>
        );
    };

    const shouldRenderExpandedRow = useCallback(
        (rowData: RowDataType) => {
            if (
                isFunction(renderRowExpandedProp) &&
                !isTree &&
                rowKey &&
                expandedRowKeys.some(key => key === rowData[rowKey])
            ) {
                return true;
            }

            return false;
        },
        [expandedRowKeys, isTree, renderRowExpandedProp, rowKey]
    );

    const bindRowClick = useCallback(
        (rowData: RowDataType) => {
            return (event: React.MouseEvent) => {
                onRowClick?.(rowData, event);
            };
        },
        [onRowClick]
    );

    const bindRowContextMenu = useCallback(
        (rowData: RowDataType) => {
            return (event: React.MouseEvent) => {
                onRowContextMenu?.(rowData, event);
            };
        },
        [onRowContextMenu]
    );

    const handleTreeToggle = useCallback(
        (treeRowKey: any, _rowIndex: number, rowData: RowDataType, _event: React.MouseEvent) => {
            // getting to the table row
            const tableRow = document.querySelector(`[aria-rowindex="${_rowIndex}"][role="row"]`) as HTMLDivElement;
            if (tableRow) {
                const data = TRANSFORM_REGEX.exec(tableRow.style.getPropertyValue("transform"));
                const x = Number(data?.[1]) || 0;
                const y = Number(data?.[2]) || 0;

                if (x)
                    scrollX.current = x;
                if (y)
                    scrollY.current = y;
            }

            let open = false;
            const nextExpandedRowKeys: RowKeyType[] = [];

            for (let i = 0; i < expandedRowKeys.length; i++) {
                const key = expandedRowKeys[i];
                if (key === treeRowKey) {
                    open = true;
                } else {
                    nextExpandedRowKeys.push(key);
                }
            }

            if (!open) {
                nextExpandedRowKeys.push(treeRowKey);
            }

            setExpandedRowKeys(nextExpandedRowKeys);
            onExpandChange?.(!open, rowData);
        },
        [expandedRowKeys, onExpandChange, setExpandedRowKeys]
    );

    /**
     * Records the status of merged rows.
     * { cellKey: [count,index]}
     */
    const rowSpanState = useRef<{ [cellKey: string]: [number, number] }>({});

    const renderRowData = (
        bodyCells: any[],
        rowData: any,
        props: TableRowProps & { cellHeight?: number },
        shouldRenderExpandedRow?: boolean
    ) => {

        // handling the nested row condition
        // tree parent
        const NestedRowData = rowData?.children;
        const hasChildren = isTree && NestedRowData && (Array.isArray(NestedRowData) && NestedRowData.length > 0);
        const childrenIds = hasChildren
            ? (rowData.children as Record<string, any>[]).map((data: Record<string, any>) => data?.id as string)
            : [];

        const treeChildInfo = {
            parentId: undefined,
            siblingsIds: [],
        }

        // first symbol is the parent symbol
        const symbols = Object.getOwnPropertySymbols(rowData);

        // tree child
        const rowParent = rowData[symbols[0]]
        if (rowParent) {
            treeChildInfo.parentId = rowParent?.id;
            treeChildInfo.siblingsIds = rowParent?.children?.filter((children: any) => children?.id !== rowData?.id)
                .map((siblings: any) => siblings?.id)
        }

        const nextRowKey =
            rowKey && typeof rowData[rowKey] !== 'undefined' ? rowData[rowKey] : props.key;

        const { ...restRowProps } = props;
        const cellHeight = props.cellHeight;

        const rowProps: TableRowProps = {
            ...restRowProps,
            key: nextRowKey,
            'aria-rowindex': (props.key as number) + 2,

            rowRef: bindTableRowsRef(props.key as any, rowData),
            onClick: bindRowClick(rowData),
            onContextMenu: bindRowContextMenu(rowData)
        };

        const expanded = expandedRowKeys.some(key => rowKey && key === rowData[rowKey]);
        const cells: React.ReactNode[] = [];

        for (let i = 0; i < bodyCells.length; i++) {
            const cell = bodyCells[i];
            const rowSpan: number = cell.props?.rowSpan?.(rowData);
            const dataCellHeight = rowSpan ? rowSpan * (cellHeight || ROW_HEIGHT) : cellHeight;
            const cellKey = cell.props.dataKey || i;

            // Record the cell state of the merged row
            if (rowSpanState.current[cellKey]?.[1] > 0) {
                rowSpanState.current[cellKey][1] -= 1;

                // Restart counting when merged to the last cell.
                if (rowSpanState.current[cellKey][1] === 0) {
                    rowSpanState.current[cellKey][0] = 0;
                }
            }

            if (rowSpan) {
                // The state of the initial merged cell
                rowSpanState.current[cellKey] = [rowSpan, rowSpan];
                rowProps.rowSpan = rowSpan;
                rowProps.style = { overflow: 'inherit' };
            }

            // Cells marked as deleted when checking for merged cell.
            const removedCell = cell.props?.rowSpan && !rowSpan && rowSpanState.current[cellKey]?.[0] !== 0
                ? true
                : false;

            cells.push(
                React.cloneElement(cell, {
                    'aria-rowspan': rowSpan ? rowSpan : undefined,
                    rowData,
                    rowIndex: props.rowIndex,
                    wordWrap: cell.props.wordWrap ?? wordWrap,
                    height: dataCellHeight,
                    depth: props.depth,
                    renderTreeToggle,
                    onTreeToggle: handleTreeToggle,
                    rowKey: nextRowKey,
                    expanded,
                    rowSpan,

                    // tree table props
                    isTree: isTree,
                    // parent
                    childrenIds,
                    hasChildren,

                    // child
                    ...treeChildInfo,

                    expandedRowKeys,
                    removed: removedCell,

                    truncate: cell.props.truncate,
                })
            );
        }

        return renderRow(rowProps, cells, shouldRenderExpandedRow, rowData);
    };

    const renderScrollbar = useCallback(() => {
        if (disabledScroll) {
            return null;
        }

        const scrollbars: React.ReactNode[] = [];

        if (hasHorizontalScrollbar) {
            scrollbars.push(
                <Scrollbar
                    scrollOffsetRef={scrollOffsetXRef}
                    key="scrollbar"
                    tableId={id}
                    style={{ width: "calc(100% - 10px)" }}
                    length={tableWidth.current}
                    onScroll={onScrollHorizontal}
                    scrollLength={contentWidth.current}
                    ref={scrollbarXRef}
                />
            );
        }

        if (hasVerticalScrollbar) {
            scrollbars.push(
                <Scrollbar
                    vertical
                    scrollOffsetRef={scrollOffsetYRef}
                    key="vertical-scrollbar"
                    tableId={id}
                    length={tableHeight - (paginationHeight + headerHeight)}
                    onScroll={onScrollVertical}
                    scrollLength={contentHeight.current + headerHeight}
                    ref={scrollbarYRef}
                />
            );
        }

        return scrollbars;
    }, [
        disabledScroll,
        hasVerticalScrollbar,
        hasHorizontalScrollbar,
        contentHeight.current,
        contentWidth.current,
        tableHeight
    ]);

    const RenderTableBody = useCallback(({ bodyCells, rowWidth }: { bodyCells: any[], rowWidth: number }) => {
        const bodyHeight = tableHeight - (paginationHeight + headerHeight);

        const bodyStyles = {
            top: headerHeight,
            height: bodyHeight,
        };

        let contentHeight = 0;

        visibleRows.current = [];

        if (data.length) {
            let top = 0; // Row position
            let minTop = Math.abs(scrollY.current);
            let startHeight = 0;
            if (typeof rowExpandedHeight === 'function') {
                startHeight = data.length ? rowExpandedHeight(data[0]) : 100;
            } else {
                startHeight = rowExpandedHeight;
            }

            let maxTop = minTop + height + startHeight;
            // Avoid white screens on the top and bottom of the table when touching and scrolling on the mobile terminal.
            // So supplement the display data row.
            if (isSupportTouchEvent()) {
                const coveredHeight = height * 3;
                minTop = Math.max(minTop - coveredHeight, 0);
                maxTop = maxTop + coveredHeight;
            }

            for (let index = 0; index < data.length; index++) {
                const rowData = data[index];
                const maxHeight = tableRowsMaxHeight[index];
                const expandedRow = shouldRenderExpandedRow(rowData);

                let nextRowHeight = 0;
                let cellHeight = 0;

                if (typeof rowHeight === 'function') {
                    nextRowHeight = rowHeight(rowData);
                    cellHeight = nextRowHeight;
                } else {
                    nextRowHeight = maxHeight
                        ? Math.max(maxHeight + CELL_PADDING_HEIGHT, rowHeight)
                        : rowHeight;

                    cellHeight = nextRowHeight;
                    if (expandedRow) {
                        // If the row is expanded, the height of the expanded row is added.
                        if (typeof rowExpandedHeight === 'function') {
                            nextRowHeight += rowExpandedHeight(rowData);
                        } else {
                            nextRowHeight += rowExpandedHeight;
                        }
                    }
                }

                contentHeight += nextRowHeight;

                const rowProps = {
                    key: index,
                    top,
                    rowIndex: index,
                    width: rowWidth,
                    depth: rowData[TREE_DEPTH],
                    height: nextRowHeight,
                    cellHeight
                };

                top += nextRowHeight;

                // TODO: WORK and fix the auto row height when wordwrap
                const bodyCellProps = bodyCells?.[index]?.props
                if (bodyCellProps?.wordWrap === "break-all") {
                    rowProps.cellHeight = 100
                }

                visibleRows.current.push(renderRowData(bodyCells, rowData, rowProps, expandedRow));
            }
        }

        const wheelStyles: React.CSSProperties = {
            position: 'absolute',
            height: contentHeight,
            minHeight: height,
            pointerEvents: isScrolling ? 'none' : undefined
        };

        return (
            <div
                role="rowgroup"
                className={prefix('body-row-wrapper')}
                style={bodyStyles}
                ref={tableBodyRef}
                onScroll={onScrollBody}
            >
                <div
                    style={wheelStyles}
                    className={prefix('body-wheel-area')}
                    ref={wheelWrapperRef}
                >
                    {visibleRows.current}
                </div>

                <EmptyMessage
                    locale={locale}
                    renderEmpty={renderEmpty}
                    addPrefix={prefix}
                    loading={!!visibleRows.current?.length || loading}
                />
                {renderScrollbar()}
                <Loader
                    locale={locale}
                    loadAnimation={loadAnimation}
                    loading={loading}
                    addPrefix={prefix}
                    renderLoading={renderLoading}
                />
            </div>
        );
    }, [data, renderScrollbar, tableHeight, paginationHeight, headerHeight]);

    const contextValue = React.useMemo(
        () => ({
            classPrefix,
            translateDOMPositionXY: translateDOMPositionXY.current,
            rtl,
            isTree,
            hasCustomTreeCol,
            rowSelection: props.rowSelection
        }),
        [classPrefix, hasCustomTreeCol, isTree, rtl]
    );

    const renderDefaultPagination = () => {
        if (data.length && pagination)
            return (
                <Pagination {...pagination} ref={paginationRef} />
            )

        return null;
    }

    return (
        <TableContext.Provider value={contextValue}>
            <RowSelectionWrapper>
                <div
                    className='bt-wrapper bt-relative bt-border bt-border-[var(--border-color)] bt-rounded-md'
                    style={{
                        ...style,
                        width: styles.width,
                        height: tableHeight,
                    }}
                    tabIndex={-1}
                    onKeyDown={onScrollByKeydown}
                    role={isTree ? 'treegrid' : 'grid'}
                    // The aria-rowcount is specified on the element with the table.
                    // Its value is an integer equal to the total number of rows available, including header rows.
                    aria-rowcount={data.length + 1}
                    aria-colcount={colCounts.current}
                    ref={tableRef}
                    {...rest}
                >
                    <div
                        className={classes}
                        style={{
                            height: tableHeightWithoutPagination,
                            width: styles?.width,
                            overflow: 'hidden'
                        }}
                    >
                        {showHeader && renderTableHeader(headerCells, rowWidth)}
                        {children && <RenderTableBody
                            bodyCells={bodyCells}
                            rowWidth={rowWidth}
                        />}
                    </div>

                    {pagination ? renderDefaultPagination() : null}
                    {showHeader && (
                        <MouseArea
                            ref={mouseAreaRef}
                            addPrefix={prefix}
                            headerHeight={headerHeight}
                            height={tableHeightWithoutPagination}
                        />
                    )}
                </div>
            </RowSelectionWrapper>
        </TableContext.Provider>
    );
}), (prev, current) => {
    const isDataEqual = JSON.stringify(prev.data) === JSON.stringify(current.data);
    const isLoadingStateSame = prev.loading === current.loading;
    const hasChildrenChanged = prev.children === current.children

    return (
        isDataEqual && isLoadingStateSame && hasChildrenChanged
    )
})

Table.displayName = 'Table';

export interface TableInstance<Row extends RowDataType, Key extends RowKeyType>
    extends React.FunctionComponent<TableProps<Row, Key>> {
    /** The table body element */
    readonly body: HTMLDivElement;
    /** The table root element */
    readonly root: HTMLDivElement;

    /** Scroll the table to the specified vertical position */
    scrollTop: (top: number) => void;

    /** Scroll the table to the specified horizontal position */
    scrollLeft: (left: number) => void;
}

export default Table as <Row extends RowDataType, Key extends RowKeyType>(
    props: TableProps<Row, Key> & React.RefAttributes<TableInstance<Row, Key>>
) => React.ReactElement;
