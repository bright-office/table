import React from 'react';
import { RowDataType } from './@types/common';

export type ColumnProps<Row extends RowDataType> = {
  /** Alignment */
  align?: React.CSSProperties['justifyContent'];

  /** Merges column cells to merge when the dataKey value for the merged column is null or undefined. */
  colSpan?: number;

  /** Merges rows on the specified column. */
  rowSpan?: (rowData: Row) => number;

  /** Whether to display the full text of the cell content when the mouse is hovered */
  fullText?: boolean;

  /** Vertical alignment */
  verticalAlign?: React.CSSProperties['alignItems'] | 'top' | 'middle' | 'bottom';

  /** Column width */
  width?: number;

  /** Customizable Resize Column width */
  resizable?: boolean;

  /** Sortable */
  sortable?: boolean;

  /** A column of a tree */
  treeCol?: boolean;

  /** Set the column width automatically adjusts, when set flexGrow cannot set resizable and width property */
  flexGrow?: number;

  /** When you use flexGrow, you can set a minimum width by  minwidth */
  minWidth?: number;

  /** Configure the cells of the column */
  children?: React.ReactNode;

  /** Callback function for resize the colum */
  onResize?: (columnWidth?: number, dataKey?: string) => void;

  isHidden?: boolean;
} & (tnoCustomizableFields | tcustomizableField)

export type tnoCustomizableFields = {
  /**
   * Customizable Field 
   * if set to true, the column can be customized
   * by customized I mean, it can be searched, sorted, or hidden.
   */
  customizable?: undefined | false,
  id?: string

  sort?: never;
  pinned?: never;
  hidden?: never;
  onHeaderClick?: never;
}

export type tcustomizableField = {
  /**
   * Customizable Field 
   * if set to true, the column can be customized
   * by customized I mean, it can be searched, sorted, or hidden.
   */
  customizable?: true;
  id: string;
  sort?: "asc" | "desc";
  pinned?: "right" | "left";

  /**
   * When the header is clicked,
   * the callback function will be called.
   */
  onHeaderClick?: (headerProps: Record<string, any>, event: React.MouseEvent) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Column<Row extends RowDataType>(_props: ColumnProps<Row>) {
  return <></>;
}

Column.displayName = 'Table.Column';
export const columnHandledProps = ["align", "verticalAlign", "width", "fixed", "resizable", "sortable", "flexGrow", "minWidth", "colSpan", "rowSpan", "treeCol", "onResize", "children", "fullText"];

export default Column;
