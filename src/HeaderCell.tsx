import React, { useState } from 'react';
import { isNil } from "lodash";
import { useUpdateEffect, useClassNames } from './utils';
import Cell, { InnerCellProps } from './Cell';
import { RowDataType, RowKeyType } from './@types/common';
import { tcustomizableField } from './Column';
import { Icon } from './Icons';

export interface HeaderCellProps<Row extends RowDataType, Key extends RowKeyType>
  extends Omit<InnerCellProps<Row, Key>, 'onResize'> {
  index?: number;
  minWidth?: number;

  resizable?: boolean;

  groupHeader?: boolean;
  flexGrow?: number;
  fixed?: boolean | 'left' | 'right';
  children: React.ReactNode;
};

export type tinternalHeaderCellProps = {
  isColHidden: boolean;
  id: string;
} & Partial<tcustomizableField>

const HeaderCell = React.memo(React.forwardRef(
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
      groupHeader,
      resizable,
      fixed,
      minWidth,
      index,
      flexGrow,
      align,
      verticalAlign,
      isColHidden = false,
      onHeaderClick,
      sort,
      pinned,
      hidden,
      customizable,
      ...rest
    } = props as HeaderCellProps<Row, Key> & tinternalHeaderCellProps;

    const [_, setColumnWidth] = useState(isNil(flexGrow) ? width : 0);

    useUpdateEffect(() => {
      setColumnWidth(isNil(flexGrow) ? width : 0);
    }, [flexGrow, width]);

    const { merge } = useClassNames(classPrefix);
    const classes = merge(className);

    const getCustIconName = (): Icon => {
      if (sort === "asc")
        return "ascSort" as Icon;

      if (sort === "desc")
        return "descSort" as Icon;

      return "noSort" as Icon;
    }

    const renderCustomizeIcon = () => {
      if (customizable && !groupHeader)
        return (
          <Icon
            name={getCustIconName()}
            style={{
              height: '16px',
              width: '16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className='bt-header-cust-icon'
          />
        );

      return null;
    };

    if (!isColHidden)
      return (
        <div
          ref={ref}
          className={classes}
          onClick={(e) => {
            onHeaderClick?.(props, e as React.MouseEvent)
          }} >
          <Cell
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '4px',
                height: 'max-content',
                width: 'max-content',
                borderRadius: '4px',
                padding: '4px',
                cursor: customizable ? 'pointer' : 'default',
              }}
              className='bt-header-cust'
            >
              <span>
                {children}
              </span>
              {renderCustomizeIcon()}
            </div>
          </Cell>
        </div>
      );

    return null;
  }
));

HeaderCell.displayName = 'HeaderCell';
export default HeaderCell;
