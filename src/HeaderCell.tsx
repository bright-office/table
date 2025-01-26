import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from "lodash";
import { FixedType } from './ColumnResizeHandler';
import { useUpdateEffect, useClassNames } from './utils';
import Cell, { InnerCellProps } from './Cell';
import { RowDataType, RowKeyType } from './@types/common';

export interface HeaderCellProps<Row extends RowDataType, Key extends RowKeyType>
    extends Omit<InnerCellProps<Row, Key>, 'onResize'> {
    index?: number;
    minWidth?: number;

    /** @deprecated  in favour of customizable*/
    sortColumn?: string;
    /** @deprecated */
    sortType?: 'desc' | 'asc';
    /** @deprecated */
    sortable?: boolean;
    /** @deprecated as not needed */
    resizable?: boolean;

    groupHeader?: boolean;
    flexGrow?: number;
    fixed?: boolean | 'left' | 'right';
    children: React.ReactNode;

    /**
     * Hides the header cell.
     * And it's data cell.
    * */
    isHidden?: boolean;


    /** @deprecated as unsupported */
    onResize?: (columnWidth?: number, dataKey?: string) => void;
    /** @deprecated as unsupported */
    onSortColumn?: (dataKey?: string) => void;
    /** @deprecated as unsupported */
    onColumnResizeStart?: (columnWidth?: number, left?: number, fixed?: boolean) => void;
    /** @deprecated as unsupported */
    onColumnResizeMove?: (columnWidth?: number, columnLeft?: number, columnFixed?: FixedType) => void;
    /** @deprecated as unsupported */
    onColumnResizeEnd?: (
        columnWidth?: number,
        cursorDelta?: number,
        dataKey?: any,
        index?: number
    ) => void;

    /** @deprecated as not required, and customizable icon is displayed */
    renderSortIcon?: (sortType?: 'desc' | 'asc') => React.ReactNode;

    /** Customizable
     * shows a 3 dot icon besides the header Name
    * */
    customizable?: boolean;

    /**
     * Header customize btn click function.
     */
    onHeaderCustomizeClick?: (headerProps: Record<string, any>, event: React.MouseEvent) => void;
}


const HeaderCell = React.forwardRef(
    <Row extends RowDataType, Key extends RowKeyType>(
        props: HeaderCellProps<Row, Key>,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const {
            className,
            classPrefix = 'cell-header',
            width,
            dataKey,
            headerHeight,
            children,
            left,
            sortable,
            sortColumn,
            sortType,
            groupHeader,
            resizable,
            fixed,
            minWidth,
            index,
            flexGrow,
            align,
            verticalAlign,
            onColumnResizeEnd,
            onResize,
            onColumnResizeStart,
            onColumnResizeMove,
            onSortColumn,
            renderSortIcon,
            customizable,
            onHeaderCustomizeClick,
            isHidden = false,
            ...rest
        } = props;

        const [_, setColumnWidth] = useState(isNil(flexGrow) ? width : 0);

        useUpdateEffect(() => {
            setColumnWidth(isNil(flexGrow) ? width : 0);
        }, [flexGrow, width]);

        const { withClassPrefix, merge } = useClassNames(classPrefix);
        const classes = merge(className, withClassPrefix({ sortable }));

        let ariaSort;

        if (sortColumn === dataKey) {
            ariaSort = 'other';
            if (sortType === 'asc') {
                ariaSort = 'ascending';
            } else if (sortType === 'desc') {
                ariaSort = 'descending';
            }
        }

        const renderCustomizeIcon = () => {
            if (customizable && !groupHeader)
                return (
                    <span
                        style={{
                            height: '20px',
                            width: '20px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(90deg)',
                        }}
                        className='bt-header-cust-icon'
                        onClick={(e) => {
                            onHeaderCustomizeClick?.(props, e as React.MouseEvent)
                        }} >
                        <svg width="15" height="15" viewBox="0 0 21 21" fill="none" className='bt-rotate-90'>
                            <path
                                d="M5.66666 10.2529C5.66666 11.0029 5.05867 11.6109 4.30867 11.6109C3.55867 11.6109 2.95068 11.0029 2.95068 10.2529C2.95068 9.50295 3.55867 8.89496 4.30867 8.89496C5.05867 8.89496 5.66666 9.50295 5.66666 10.2529Z"
                                fill="currentColor" />
                            <path
                                d="M18.7553 10.2529C18.7553 11.0029 18.1473 11.6109 17.3973 11.6109C16.6473 11.6109 16.0393 11.0029 16.0393 10.2529C16.0393 9.50295 16.6473 8.89496 17.3973 8.89496C18.1473 8.89496 18.7553 9.50295 18.7553 10.2529Z"
                                fill="currentColor" />
                            <path
                                d="M12.2172 10.2529C12.2172 11.0029 11.6092 11.6109 10.8592 11.6109C10.1092 11.6109 9.50122 11.0029 9.50122 10.2529C9.50122 9.50295 10.1092 8.89496 10.8592 8.89496C11.6092 8.89496 12.2172 9.50295 12.2172 10.2529Z"
                                fill="currentColor" />
                        </svg>
                    </span>);
            return null;
        };

        {/* // TODO: tailwind remove */ }
        if (!isHidden)
            return (
                <div ref={ref} className={classes} >
                    <Cell
                        aria-sort={ariaSort}
                        {...rest}
                        width={width}
                        dataKey={dataKey}
                        left={left}
                        headerHeight={headerHeight}
                        isHeaderCell={true}
                        align={!groupHeader ? align : undefined}
                        verticalAlign={!groupHeader ? verticalAlign : undefined}
                    >
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '4px',
                            }}>
                            {children}
                            {renderCustomizeIcon()}
                        </div>
                    </Cell >
                </div >
            );

        return null;
    }
);

HeaderCell.displayName = 'HeaderCell';
HeaderCell.propTypes = {
    index: PropTypes.number,
    sortColumn: PropTypes.string,
    sortType: PropTypes.oneOf(['desc', 'asc']),
    sortable: PropTypes.bool,
    resizable: PropTypes.bool,
    minWidth: PropTypes.number,
    onColumnResizeStart: PropTypes.func,
    onColumnResizeEnd: PropTypes.func,
    onResize: PropTypes.func,
    onColumnResizeMove: PropTypes.func,
    onSortColumn: PropTypes.func,
    flexGrow: PropTypes.number,
    fixed: PropTypes.any,
    children: PropTypes.node,
    renderSortIcon: PropTypes.func
};

export default HeaderCell as <Row extends RowDataType, Key extends RowKeyType>(
    props: HeaderCellProps<Row, Key> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
