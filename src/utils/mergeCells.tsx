import React from 'react';
import { isFunction } from "lodash";
import { get } from "lodash";
import { isNil } from "lodash";
import ColumnGroup from '../ColumnGroup';
import HeaderCell, { tinternalHeaderCellProps } from '../HeaderCell';
import SelectionCheckbox from '../components/SelectionCheckbox';
import { rowSelectionState } from './useRowSelection';
import { ROW_SELECTION_COL_WIDTH } from './useTableDimension';

function cloneCell(Cell, props) {
  return React.cloneElement(Cell, props);
}

const CHECKBOX_WIDTH = 50

function mergeCells(
  cells,
  props: (Record<"shouldRenderCheckbox" | string, any>) & {
    onRowSelect?: (state: rowSelectionState) => void,
    leftFixedWidth?: number
    rowSelection?: boolean
  }
) {
  const nextCells: React.ReactNode[] = [];
  let {
    shouldRenderCheckbox: shouldRowRenderCheckbox = false,
    onRowSelect,
    leftFixedWidth = 0,
    rowSelection = false,
    ...additionalProps
  } = props;

  const rowSelectionWidth = rowSelection ? ROW_SELECTION_COL_WIDTH : 0;

  let checkboxCol = false;

  for (let i = 0; i < cells.length; i += 1) {
    checkboxCol = (i === 0 && shouldRowRenderCheckbox);

    // will still be present in final cell props
    const {
      width,
      colSpan,
      groupCount,
      groupHeader,
      groupAlign,
      groupVerticalAlign,
      isHeaderCell,
      headerHeight,
      groupHeaderHeight,
      height,
    } = cells[i].props;

    const groupChildren: React.ReactNode[] = [];

    const currentRowId = cells[i]?.props?.rowData?.id;

    // will be removed from the final cell props
    const {
      childrenIds = [],
      expandedRowKeys = [],
      parentId = undefined,
      siblingsIds = [],
      isTree = false,
      ...nativeCellProps
    } = cells[i].props

    // discarding all the non native props
    cells[i] = {
      ...cells[i],
      props: nativeCellProps
    }

    if (!currentRowId && !isHeaderCell)
      throw new Error("No field with id provided");

    const RowCheckbox = () => {
      // header row
      if (isHeaderCell)
        return (
          <SelectionCheckbox
            variant='header'
            onRowSelect={onRowSelect}
            isHeaderCell={true}
            index={i}
            headerHeight={headerHeight}
          />)


      // tree table row
      if (isTree)
        return (
          <SelectionCheckbox
            height={height}
            onRowSelect={onRowSelect}
            index={i}
            currentRowId={currentRowId}
            isTree
            parentId={parentId}
            childrenIds={childrenIds}
            siblingsIds={siblingsIds}
            variant='tree'
          />)

      // Normal row 
      return (
        <SelectionCheckbox
          variant='normal'
          height={height}
          onRowSelect={onRowSelect}
          index={i}
          currentRowId={currentRowId}
        />)
    }

    // Add grouping to column headers.
    // header cells
    if (groupCount && isHeaderCell) {
      let nextWidth = width;
      let left = 0;

      for (let j = 0; j < groupCount; j += 1) {
        const nextCell = cells[i + j];
        const {
          width: nextCellWidth,
          children,
          dataKey,
          align,
          verticalAlign,
        } = nextCell.props;

        if (j !== 0) {
          nextWidth += nextCellWidth;
          left += cells[i + j - 1].props.width;
          cells[i + j] = cloneCell(nextCell, { removed: true, ...additionalProps });
        }

        groupChildren.push(
          <HeaderCell
            left={left}
            key={j}
            align={align}
            verticalAlign={verticalAlign}
            dataKey={dataKey}
            width={nextCellWidth}
            {...additionalProps as tinternalHeaderCellProps}
          >
            {children}
          </HeaderCell>
        );
      }

      nextCells.push(
        cloneCell(cells[i], {
          width: nextWidth,
          left: rowSelectionWidth + cells[i].props.left,
          children: (
            <ColumnGroup
              rowSelectionWidth={0}
              width={nextWidth}
              headerHeight={headerHeight}
              header={groupHeader}
              align={groupAlign}
              verticalAlign={groupVerticalAlign}
              groupHeaderHeight={groupHeaderHeight}
              {...additionalProps}
            >
              {groupChildren}
            </ColumnGroup>
          )
        })
      );
      continue;
    } else if (colSpan) {
      // colSpan cells
      // If there is a colSpan attribute, go to its next Cell.
      // Determine whether the value is null or undefined, then merge this cell.

      let nextWidth = width;
      for (let j = 0; j < colSpan; j += 1) {
        const nextCell = cells[i + j];
        if (nextCell) {
          const {
            rowData,
            rowIndex,
            children,
            width: colSpanWidth,
            isHeaderCell,
            dataKey
          } = nextCell.props;

          const cellText = isFunction(children)
            ? children(rowData, rowIndex)
            : get(rowData, dataKey);

          if ((rowData && isNil(cellText)) || (isHeaderCell && isNil(children))) {
            nextWidth += colSpanWidth;
            cells[i + j] = cloneCell(nextCell, {
              removed: true,
              ...additionalProps
            });
          }
        }
      }

      nextCells.push(
        checkboxCol && <RowCheckbox key={`checkbox-${currentRowId}-${i}`} />,
        cloneCell(cells[i], {
          width: nextWidth,
          left: shouldRowRenderCheckbox
            ? cells[i].props.left + CHECKBOX_WIDTH + leftFixedWidth
            : cells[i].props.left + rowSelectionWidth,
          'aria-colspan': nextWidth > width ? colSpan : undefined,
          ...additionalProps
        })
      );
      continue;
    }

    // normal cell
    nextCells.push(
      checkboxCol && <RowCheckbox key={`checkbox-${currentRowId}-${i}`} />,
      cloneCell(cells[i], {
        left: shouldRowRenderCheckbox
          ? cells[i]?.props?.left + CHECKBOX_WIDTH + leftFixedWidth
          : cells[i]?.props?.left + rowSelectionWidth,
        ...additionalProps
      }));
  }

  return [
    ...nextCells
  ];
}

export default mergeCells;
