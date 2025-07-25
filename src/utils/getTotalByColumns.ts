import React from 'react';
import { isPlainObject } from "lodash";
import getColumnProps from './getColumnProps';
import { RowDataType } from '../@types/common';
import { ColumnProps } from '../Column';

function getTotalByColumns<Row extends RowDataType>(
  columns: React.ReactElement<ColumnProps<Row>> | React.ReactElement<ColumnProps<Row>>[]
) {
  let totalFlexGrow = 0;
  let totalWidth = 0;
  let totalVisibleFlexGrow = 0;
  let totalVisibleColWidth = 0;

  const count = (items: React.ReactNode[]) => {
    Array.from(items).forEach(column => {
      if (React.isValidElement(column)) {
        const { flexGrow, width = 0, isHidden } = getColumnProps(column);
        totalFlexGrow += flexGrow || 0;
        totalWidth += flexGrow ? 0 : width;

        if (!isHidden) {
          totalVisibleColWidth += flexGrow ? 0 : width;
          totalVisibleFlexGrow += flexGrow || 0;
        }

      } else if (Array.isArray(column)) {
        count(column);
      }
    });
  };

  if (Array.isArray(columns)) {
    count(columns);
  } else if (isPlainObject(columns)) {
    const { flexGrow, width = 0, isHidden } = columns?.props;

    totalFlexGrow = flexGrow || 0;
    totalWidth = flexGrow ? 0 : width;

    if (!isHidden) {
      totalVisibleColWidth += flexGrow ? 0 : width;
      totalVisibleFlexGrow += flexGrow || 0;
    }

  }

  return {
    totalFlexGrow,
    totalWidth,
    totalVisibleColWidth,
    totalVisibleFlexGrow,
  };
}

export default getTotalByColumns;
