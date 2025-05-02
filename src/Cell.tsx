import React, { useCallback } from 'react';
import { omit } from "lodash";
import { isNil } from "lodash";
import { get } from "lodash";
import { ROW_HEADER_HEIGHT, ROW_HEIGHT } from './constants';
import { useClassNames, convertToFlex } from './utils';
import TableContext from './TableContext';
import { StandardProps, RowDataType, RowKeyType } from './@types/common';
import { columnHandledProps } from './Column';

export interface CellProps<Row extends RowDataType> extends StandardProps {
    /** Data binding key, but also a sort of key */
    dataKey?: string;

    /** Row Number */
    rowIndex?: number;

    /** Row Data */
    rowData?: Row;
}

export interface InnerCellProps<Row extends RowDataType, Key extends RowKeyType>
    extends Omit<CellProps<Row>, 'children'> {
    align?: React.CSSProperties['justifyContent'];
    verticalAlign?: React.CSSProperties['alignItems'] | 'top' | 'middle' | 'bottom';
    isHeaderCell?: boolean;
    width?: number;
    height?: number | ((rowData: Row) => number);
    left?: number;
    headerHeight?: number;
    style?: React.CSSProperties;
    fullText?: boolean;
    firstColumn?: boolean;
    lastColumn?: boolean;
    hasChildren?: boolean;
    children?: React.ReactNode | ((rowData: Row, rowIndex?: number) => React.ReactNode);
    rowKey?: Key;
    rowSpan?: number;
    depth?: number;
    wordWrap?: boolean | 'break-all' | 'break-word' | 'keep-all';
    removed?: boolean;
    treeCol?: boolean;
    expanded?: boolean;
    predefinedStyle?: React.CSSProperties;
    onTreeToggle?: (rowKey?: Key, rowIndex?: number, rowData?: Row, event?: React.MouseEvent) => void;
    renderTreeToggle?: (
        expandButton: React.ReactNode,
        rowData?: Row,
        expanded?: boolean
    ) => React.ReactNode;
    renderCell?: (contentChildren: any) => React.ReactNode;
}

const groupKeys = [
    'groupCount',
    'groupHeader',
    'groupHeaderHeight',
    'groupAlign',
    'groupVerticalAlign',
    'renderSortIcon'
];

const Cell = React.memo(React.forwardRef(
    <Row extends RowDataType, Key extends RowKeyType>(
        props: InnerCellProps<Row, Key>,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const {
            classPrefix = 'cell',
            width = 0,
            left = 0,
            headerHeight = ROW_HEADER_HEIGHT,
            depth = 0,
            height = ROW_HEIGHT,
            style,
            className,
            fullText,
            firstColumn,
            lastColumn,
            isHeaderCell,
            align,
            children,
            rowData,
            dataKey,
            rowIndex,
            removed,
            rowKey,
            rowSpan,
            wordWrap,
            verticalAlign,
            expanded,
            treeCol,
            hasChildren,
            predefinedStyle,
            renderCell,
            renderTreeToggle,
            onClick,
            onTreeToggle,
            ...rest
        } = props;

        const { rtl, hasCustomTreeCol, isTree } = React.useContext(TableContext);

        const isTreeCol = treeCol || (!hasCustomTreeCol && firstColumn && isTree);
        const cellHeight =
            typeof height === 'function' ? (rowData ? height(rowData) : ROW_HEIGHT) : height;

        if (isTreeCol && !isHeaderCell && !rowData) {
            throw new Error('[Table.Cell]: `rowData` is required for tree column');
        }

        const handleTreeToggle = useCallback(
            (event: React.MouseEvent) => {
                event.stopPropagation();
                onTreeToggle?.(rowKey, rowIndex, rowData, event);
            },
            [onTreeToggle, rowData, rowIndex, rowKey]
        );

        const { withClassPrefix, merge, prefix } = useClassNames(classPrefix);
        const classes = merge(
            className,
            withClassPrefix({
                expanded: expanded && isTreeCol,
                first: firstColumn,
                last: lastColumn,
                rowspan: rowSpan && !isHeaderCell,
                'full-text': fullText
            })
        );

        const nextHeight = isHeaderCell ? headerHeight : cellHeight;

        const styles = {
            ...predefinedStyle,
            width: width,
            height: nextHeight,
            zIndex: depth,
            [rtl ? 'right' : 'left']: left
        };

        const paddingKey = rtl ? 'paddingRight' : 'paddingLeft';

        const contentStyles: React.CSSProperties = {
            ...convertToFlex({ align, verticalAlign }),
            display: 'flex',
            flexWrap: 'wrap',
            ...style,
            [fullText ? 'minWidth' : 'width']: width,
            height: nextHeight,
            /* 
             * For now I don't think so, this indent is required.
             * [paddingKey]: isTreeCol ? depth * LAYER_WIDTH + 10 : style?.[paddingKey] || style?.padding 
             * */
            [paddingKey]: style?.[paddingKey] || style?.padding
        };

        if (wordWrap) {
            contentStyles.wordBreak = typeof wordWrap === 'boolean' ? 'break-all' : wordWrap;
            contentStyles.overflowWrap = wordWrap === 'break-word' ? wordWrap : undefined;
        }

        let cellContent: React.ReactNode = null;

        if (typeof children === 'function') {
            if (!rowData) {
                cellContent = null;
            } else {
                cellContent = children(rowData, rowIndex);
            }
        } else if (isNil(children)) {
            if (rowData && dataKey) {
                cellContent = get(rowData, dataKey);
            }
        } else {
            cellContent = children;
        }

        const ExpandedIcon = <svg
            width="100%"
            height="100%"
            className=" bt-cell-expand-icon bt-cell-expand-icon-expanded"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.85031 14.2932C11.4784 14.5437 15.5131 9.82024 17.5581 7.27144C18.074 6.62843 17.6108 5.69724 16.7864 5.69724L3.25537 5.69728C2.42339 5.69728 1.96363 6.64709 2.49235 7.28946C4.48139 9.70602 8.25044 14.0471 9.85031 14.2932Z"
                fill="currentColor"
            />
        </svg>

        const CollapsedIcon = <svg
            width="100%"
            height="100%"
            className="bt-cell-expand-icon bt-cell-expand-icon-collapsed"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.85031 14.2932C11.4784 14.5437 15.5131 9.82024 17.5581 7.27144C18.074 6.62843 17.6108 5.69724 16.7864 5.69724L3.25537 5.69728C2.42339 5.69728 1.96363 6.64709 2.49235 7.28946C4.48139 9.70602 8.25044 14.0471 9.85031 14.2932Z"
                fill="currentColor"
            />
        </svg>

        const renderTreeNodeExpandIcon = () => {
            const expandIconComponent = expanded ? ExpandedIcon : CollapsedIcon;
            if (isTreeCol && hasChildren) {
                return (
                    <span
                        role="button"
                        tabIndex={-1}
                        className='bt-cell-expansion-con'
                        onClick={handleTreeToggle}>
                        {expandIconComponent}
                    </span>
                );
            }

            if (isTreeCol && !isHeaderCell)
                return <span style={{ width: 24 }}>
                </span>;

            return null;
        };

        const isExpandableColumn = hasChildren && isTreeCol;

        const content = (
            <div
                style={{
                    display: isTreeCol && hasChildren ? 'flex' : "inherit",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {renderTreeNodeExpandIcon()}
                {renderCell ? renderCell(cellContent) : cellContent}
            </div>
        );

        if (removed) return null;

        return (
            <div
                ref={ref}
                role={isHeaderCell ? 'columnheader' : 'gridcell'}
                {...omit(rest, [...groupKeys, ...columnHandledProps])}
                onClick={(e) => {
                    onClick?.(e);
                    isTreeCol && hasChildren && handleTreeToggle?.(e);
                }}
                className={classes}
                style={styles}>
                <div
                    className={prefix('content') + (isExpandableColumn ? ' bt-cell-expandable' : '')}
                    style={contentStyles}>
                    {content}
                </div>
            </div>
        );
    }
))

Cell.displayName = 'Table.Cell';

export default Cell as <Row extends RowDataType, Key extends RowKeyType>(
    props: InnerCellProps<Row, Key> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
