import React, { useRef, useCallback } from 'react';
import getWidth from 'dom-lib/esm/getWidth.js';
import getHeight from 'dom-lib/esm/getHeight.js';
import getOffset from 'dom-lib/esm/getOffset.js';
import { SCROLLBAR_WIDTH } from '../constants';
import { ResizeObserver } from '@juggle/resize-observer';
import useMount from './useMount';
import useUpdateLayoutEffect from './useUpdateLayoutEffect';
import useIntersectionObserver from './useIntersectionObserver';
import isNumberOrTrue from './isNumberOrTrue';
import { RowDataType, ElementOffset } from '../@types/common';
import { debounce } from "lodash";

interface TableDimensionProps<Row, Key> {
    data?: readonly Row[];
    rowHeight: number | ((rowData?: Row) => number);
    height: number;
    minHeight: number;
    maxHeight?: number;
    tableRef?: React.RefObject<HTMLDivElement>;
    headerWrapperRef?: React.RefObject<HTMLDivElement>;
    width?: number;
    prefix: (str: string) => string;
    affixHeader?: boolean | number;
    affixHorizontalScrollbar?: boolean | number;
    headerHeight: number;
    autoHeight?: boolean;
    children?: React.ReactNode;
    expandedRowKeys?: readonly Key[];
    showHeader?: boolean;
    bordered?: boolean;
    onTableScroll?: (coord: { x?: number; y?: number }) => void;
    onTableResizeChange?: (
        prevSize: number,
        event: 'bodyHeightChanged' | 'bodyWidthChanged' | 'widthChanged' | 'heightChanged'
    ) => void;

    // additional height/width may be added if present.
    hasRowSelection?: boolean;
    hasPagination?: boolean;
}

// 2px is for the border to be display; 
export const PAGINATION_HEIGHT = 64;
export const ROW_SELECTION_COL_WIDTH = 50;

const bottomPadding = 40;

/**
 * The dimension information of the table,
 * including the height, width, scrollable distance and the coordinates of the scroll handle, etc.
 * @param props
 * @returns
 */
const useTableDimension = <Row extends RowDataType, Key>(props: TableDimensionProps<Row, Key>) => {
    const {
        data,
        rowHeight,
        tableRef,
        headerWrapperRef,
        prefix,
        width,
        height,
        affixHeader,
        affixHorizontalScrollbar,
        headerHeight,
        autoHeight: autoHeightProp,
        minHeight,
        maxHeight,
        children,
        expandedRowKeys,
        showHeader,
        bordered,
        onTableResizeChange,
        onTableScroll,
    } = props;

    const contentHeight = useRef(0);
    const contentWidth = useRef(0);
    const minScrollY = useRef(0);
    const scrollY = useRef(0);
    const scrollX = useRef(0);
    const minScrollX = useRef(0);
    const tableWidth = useRef(width || 0);
    const tableHeight = useRef(height || 0);
    const columnCount = useRef(0);
    const widthResizeObserver = useRef<ResizeObserver>();
    const heightResizeObserver = useRef<ResizeObserver>();
    const headerOffset = useRef<ElementOffset | null>(null);
    const tableOffset = useRef<ElementOffset | null>(null);

    const autoHeight = autoHeightProp;

    const getRowHeight = useCallback(
        (rowData?: Row) => {
            return typeof rowHeight === 'function' ? rowHeight(rowData) : rowHeight;
        },
        [rowHeight]
    );

    const calculateTableContextHeight = useCallback(() => {
        const prevContentHeight = contentHeight.current;
        const table = tableRef?.current as HTMLDivElement;
        const rows = table?.querySelectorAll(`.${prefix?.('row')}`) || [];

        //TODO: Optimize this to use just the reduce and not map and then reduce.
        //TODO: Research this and add something like auto row height. for calcualating table 
        //height.
        let nextContentHeight = rows.length
            ? (
                Array.from(rows).map(
                    (row: Element, index: number) => {
                        const rowHeight = getHeight(row) || getRowHeight(data?.[index])
                        return rowHeight;
                    }
                ) as number[]
            ).reduce((x: number, y: number) => x + y)
            : 0;

        contentHeight.current = Math.round(
            nextContentHeight - (headerHeight)
        );

        const hasHorizontalScrollbar = contentWidth.current > tableWidth.current;
        let tableBodyHeight = getTableHeight() - (headerHeight);

        minScrollY.current = -(nextContentHeight - tableBodyHeight) - (hasHorizontalScrollbar ? SCROLLBAR_WIDTH : 0)

        // If the height of the content area is less than the height of the table, the vertical scroll bar is reset.
        // TODO: Look into this.
        if (nextContentHeight < height) {
            onTableScroll?.({ y: 0 });
        }

        const currentScrollTop = Math.abs(scrollY.current);

        // When Table is set to virtualized, the logic will be entered every time the wheel event is
        // triggered to avoid resetting the scroll bar after scrolling to the bottom, so add the SCROLLBAR_WIDTH value.
        const maxScrollTop = nextContentHeight + SCROLLBAR_WIDTH - tableBodyHeight;

        // If the top value of the current scroll is greater than the scrollable range,
        // keep the vertical scroll bar at the bottom.
        if (maxScrollTop > 0 && currentScrollTop > maxScrollTop) {
            onTableScroll?.({ y: maxScrollTop });
        }

        if (prevContentHeight !== contentHeight.current) {
            onTableResizeChange?.(prevContentHeight, 'bodyHeightChanged');
        }

    }, [
        tableRef,
        prefix,
        affixHeader,
        headerHeight,
        autoHeight,
        maxHeight,
        showHeader,
        getRowHeight,
        data,
        onTableScroll,
        onTableResizeChange
    ]);

    const setOffsetByAffix = useCallback(() => {
        const headerNode = headerWrapperRef?.current;
        if (isNumberOrTrue(affixHeader) && headerNode) {
            headerOffset.current = getOffset(headerNode);
        }

        if (isNumberOrTrue(affixHorizontalScrollbar) && tableRef?.current) {
            tableOffset.current = getOffset(tableRef?.current);
        }
    }, [affixHeader, affixHorizontalScrollbar, headerWrapperRef, tableRef]);

    const calculateTableContentWidth = useCallback(() => {
        const prevWidth = contentWidth.current; //0
        const prevColumnCount = columnCount.current; //0
        const table = tableRef?.current; //undefined
        const row = table?.querySelector(`.${prefix('row')}:not(.virtualized)`); //undefined

        let nextContentWidth = row ? getWidth(row) - (
            props.hasRowSelection
                ? (ROW_SELECTION_COL_WIDTH)
                : 0
        ) : 0;

        // Accounting for the width of the scroll bar if present.
        const hasHorizontalScrollbar = contentWidth.current > tableWidth.current;
        const scrollbarWidth = hasHorizontalScrollbar ? 0 : SCROLLBAR_WIDTH;

        contentWidth.current = nextContentWidth - (autoHeight ? scrollbarWidth : 0);
        columnCount.current = row?.querySelectorAll(`.${prefix('cell')}`).length || 0;

        // The value of SCROLLBAR_WIDTH is subtracted so that the scroll bar does not block the content part.
        // There is no vertical scroll bar after autoHeight.
        const minScrollWidth =
            -(nextContentWidth - tableWidth.current) - (SCROLLBAR_WIDTH);

        if (minScrollX.current !== minScrollWidth) {
            minScrollX.current = minScrollWidth;

            if (scrollX.current < minScrollWidth) {
                // fix: 405#issuecomment-1464831646
                scrollX.current = minScrollWidth;
            }
        }

        /**
         * If the width of the content area and the number of columns change,
         * the horizontal scroll bar is reset.
         * fix: https://github.com/rsuite/rsuite/issues/2039
         */
        if (
            (prevWidth > 0 && prevWidth !== contentWidth.current) ||
            (prevColumnCount > 0 && prevColumnCount !== columnCount.current)
        ) {
            onTableResizeChange?.(prevWidth, 'bodyWidthChanged');
        }
    }, [autoHeight, onTableResizeChange, prefix, tableRef]);

    const calculateTableWidth = useCallback(
        (nextWidth?: number) => {
            const prevWidth = tableWidth.current;

            if (tableRef?.current) {
                tableWidth.current = nextWidth || (getWidth(tableRef?.current)
                    - (props.hasRowSelection
                        ? (ROW_SELECTION_COL_WIDTH)
                        : 0)
                );
            }

            if (prevWidth && prevWidth !== tableWidth.current) {
                onTableResizeChange?.(prevWidth, 'widthChanged');
            }

            setOffsetByAffix();
        },
        [onTableResizeChange, setOffsetByAffix, tableRef, props.hasRowSelection]
    );

    const calculateTableHeight = useCallback((nextHeight?: number) => {
        const prevHeight = tableHeight.current;

        if (nextHeight) {
            tableHeight.current = nextHeight;
        } else if (tableRef?.current) {
            tableHeight.current = getHeight(tableRef.current.parentNode as Element);
        }

        if (autoHeight && tableRef?.current) {
            const tableOffset = tableRef.current.getBoundingClientRect().top;

            if (tableOffset !== undefined) {
                const maxTableHeight = innerHeight - tableOffset - bottomPadding;
                tableHeight.current = Math.min(maxTableHeight, contentHeight.current - bottomPadding - tableOffset);
            }
        }


        if (prevHeight && prevHeight !== tableHeight.current) {
            onTableResizeChange?.(prevHeight, 'heightChanged');
        }
    },
        [onTableResizeChange]
    );

    useMount(() => {
        calculateTableContextHeight();
        calculateTableContentWidth();

        calculateTableWidth();
        calculateTableHeight();
        setOffsetByAffix();

        heightResizeObserver.current = new ResizeObserver(entries => {
            calculateTableHeight(entries[0].contentRect.height);
        });

        widthResizeObserver.current = new ResizeObserver(
            debounce(entries => {
                const { width } = entries[0].contentRect;

                const widthWithBorder = width + 2;

                calculateTableWidth(bordered ? widthWithBorder : width);
            }, 20)
        );

        if (tableRef?.current) {
            heightResizeObserver.current.observe(tableRef?.current?.parentNode as Element);
            widthResizeObserver.current.observe(tableRef?.current as Element);
        }

        return () => {
            widthResizeObserver.current?.disconnect();
            heightResizeObserver.current?.disconnect();
        };
    });

    useUpdateLayoutEffect(() => {
        calculateTableWidth();
        calculateTableHeight();

        calculateTableContentWidth();
        calculateTableContextHeight();
    }, [
        data,
        expandedRowKeys,
        children,
        calculateTableContextHeight,
        calculateTableContentWidth,
        tableRef?.current,
    ]);

    const isVisible = useIntersectionObserver(tableRef);

    useUpdateLayoutEffect(() => {
        if (isVisible) {
            calculateTableWidth();
            calculateTableHeight();
            calculateTableContentWidth();
        }
    }, [isVisible]);

    const setScrollY = useCallback((value: number) => {
        scrollY.current = value;
    }, []);

    const setScrollX = useCallback((value: number) => {
        scrollX.current = value;
    }, []);

    const getTableHeight = () => {
        if (data?.length === 0) {
            return props.height;
        }

        const height = autoHeight
            ? tableHeight.current
            : props.height - headerHeight;

        if (maxHeight && height > maxHeight) {
            return maxHeight;
        }

        if (minHeight && height < minHeight) {
            return minHeight;
        }

        return height;
    };

    return {
        contentHeight,
        contentWidth,
        minScrollY,
        minScrollX,
        scrollY,
        scrollX,
        tableWidth,
        headerOffset,
        tableOffset,
        getTableHeight,
        setScrollY,
        setScrollX
    };
};

export default useTableDimension;
