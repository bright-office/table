import { Children, isValidElement, ReactElement } from "react";
import { RowDataType } from "../@types/common";
import { ColumnProps } from "../Column";

type tColumn = ReactElement<ColumnProps<RowDataType>>;

type textractPinnedColumnsReturn = tColumn[]

export const extractPinnedColumns = (colums: tColumn[]): textractPinnedColumnsReturn => {
    const left: tColumn[] = [];
    const right: tColumn[] = [];
    const unpinned: tColumn[] = [];

    let leftMostCount = 0;
    let rightMostCount = 0;

    Children.forEach(colums, (column) => {
        if (!isValidElement(column))
            return;

        if (column.props.fixedPin === "left") {
            leftMostCount++;
            left.splice(leftMostCount, 0, column);
            return;
        }

        // We want the fixedright to be in the 
        // rightmost of the right array
        // in the order they are defined.
        if (column.props.fixedPin === "right") {
            rightMostCount++;
            right.splice(right.length + rightMostCount, 0, column);
            return;
        }

        if (column.props.pinned === "left" ||
            (typeof column.props.pinned === "boolean" && column.props.pinned === true)
        ) {
            left.push(column);
            return;
        }

        // We want the rightmost column to be
        // as the last of the right array.
        // so, we are prepending all the columns that 
        // have pinned right. 
        if (column.props.pinned === "right") {
            right.unshift(column);
            return;
        }

        unpinned.push(column);
    })

    return [left, unpinned, right].flat();
}
