import React, { createContext, ReactNode, useContext, useState } from "react"
import { SelectionCheckboxProps, TreeTableCheckbox } from "../components/SelectionCheckbox"

type selectedRows = ({
    parentId: string,
    childIds: string[]
} | string)[]
export type rowSelectionState = {
    selectedRows: selectedRows
    allSelected: boolean,

    // defines the type of selection 
    // if set to false works as normal selected rows  = selected rows
    // if set to true works inverse selected rows contains the rows that are not selected.
    isInverseSelection?: boolean,
}

export const RowSelectionContext = createContext<{
    rowSelectionState: rowSelectionState,
    setRowSelectionState: React.Dispatch<React.SetStateAction<rowSelectionState>>
}>({
    rowSelectionState: {
        selectedRows: [],
        allSelected: false,
        isInverseSelection: false,
    },
    setRowSelectionState: () => { }
});

export const RowSelectionWrapper = ({ children }: { children: ReactNode }) => {
    const [rowSelectionState, setRowSelectionState] = useState<rowSelectionState>({
        selectedRows: [],
        allSelected: false,
        isInverseSelection: false,
    });

    return (
        <RowSelectionContext.Provider
            value={{
                rowSelectionState: rowSelectionState,
                setRowSelectionState: setRowSelectionState
            }}>
            {children}
        </RowSelectionContext.Provider>)
}

export const useRowSelection = () => {
    const context = useContext(RowSelectionContext);
    if (!context)
        throw new Error("Cannot use row selection context outside it's provider");

    const { rowSelectionState: rowSelection, setRowSelectionState: setRowSelection } = context;

    const getSelectedChilds = (parentId: string): undefined | string[] => {
        // first of all it should be a parent to get it's selected childs.
        const MatchRec = rowSelection.selectedRows.find((selections) => selections[parentId])
        if (!MatchRec || typeof MatchRec === "string") return;

        return MatchRec[parentId];
    }

    const areAllChildSelected = ({
        parentId,
        childrens
    }: {
        parentId: string,
        childrens: string[],
    }): boolean => {
        const MatchRec = rowSelection.selectedRows.find((selections) => selections[parentId])
        if (!MatchRec || typeof MatchRec === "string") return false;

        const selectedChildrens = MatchRec[parentId];

        return childrens.every(child => selectedChildrens.includes(child));
    }

    const isGlobalChecked = () => {
        return rowSelection.allSelected
    }

    const isIdSelected = (queryId: string) => {
        if (!rowSelection.selectedRows.length)
            return false

        return rowSelection?.selectedRows?.some(id => {
            if (typeof id !== "object")
                return id === queryId

            return id?.[0]?.some((child) => {
                return child === queryId
            })
        })
    }

    type handleTreeRowSelection = {
        treeProps: TreeTableCheckbox;
        currentRowId: string;
        onRowSelect?: (selectionState: rowSelectionState) => void;
    }

    const handleTreeRowSelection = ({ treeProps, currentRowId, onRowSelect }: handleTreeRowSelection) => {

        const { parentId, childrenIds = [] } = treeProps;

        const isChild = parentId !== undefined;
        const isNotNested = !isChild && childrenIds.length === 0;
        const isParent = !isChild && !isNotNested;

        setRowSelection((prevRowSelection) => {

            // when the clicked checkbox is that of children
            if (isChild) {
                let updatedState = prevRowSelection
                const parent = prevRowSelection.selectedRows
                    .find(data => typeof data === "string"
                        ? false
                        : data.parentId === parentId) as { parentId: string, childIds: string[] } | undefined

                if (!parent) {
                    updatedState = {
                        ...updatedState,
                        allSelected: false,
                        selectedRows: [
                            ...updatedState.selectedRows,
                            {
                                parentId: parentId,
                                childIds: [currentRowId]
                            }
                        ]
                    }

                    onRowSelect?.(updatedState)

                    return { ...updatedState };
                }

                const isChildAlreadyChecked = parent.childIds.some(id => id === currentRowId);
                const updatedData = {
                    parentId,
                    childIds: isChildAlreadyChecked
                        ? parent.childIds.filter(id => id !== currentRowId)
                        : [...parent.childIds, currentRowId as string]
                }

                const parentIndex = updatedState.selectedRows.indexOf(parent)

                updatedState = {
                    ...prevRowSelection,
                    allSelected: false,
                    selectedRows: [...prevRowSelection.selectedRows
                        .filter((_, i) => i !== parentIndex),
                        updatedData]
                }

                onRowSelect?.(updatedState)
                return { ...updatedState };
            }

            if (isNotNested) {
                const isAlreadySelected = prevRowSelection.selectedRows.includes(currentRowId);
                const newSelectedRows = (isAlreadySelected
                    ? prevRowSelection.selectedRows.filter(rowId => rowId !== currentRowId)
                    : [...prevRowSelection.selectedRows, currentRowId])

                const updatedState: rowSelectionState = {
                    ...prevRowSelection,
                    selectedRows: newSelectedRows,
                    allSelected: false,
                }

                onRowSelect?.(updatedState);

                return { ...updatedState };
            }

            if (isParent) {
                const stateParent = prevRowSelection.selectedRows.find((obj) => {
                    const isValidParent = typeof obj !== "string";
                    if (!isValidParent)
                        return false;

                    // since parent will have parent set to undefined
                    if (obj.parentId === currentRowId)
                        return true;
                }) as { parentId: string, childIds: string[] }

                let updatedState: any


                const stateParentIndex = prevRowSelection.selectedRows.indexOf(stateParent);
                if (!stateParent || (stateParent && stateParent?.childIds?.length === 0)) {
                    updatedState = {
                        ...prevRowSelection,
                        allSelected: false,
                        selectedRows: [
                            ...prevRowSelection.selectedRows.filter((_, i) => i !== stateParentIndex),
                            {
                                parentId: currentRowId,
                                childIds: childrenIds
                            }
                        ]
                    }
                } else {
                    updatedState = {
                        ...prevRowSelection,
                        selectedRows: [
                            ...prevRowSelection.selectedRows.map(ids => {
                                const nonObj = typeof ids === "string"
                                if (nonObj)
                                    return ids;

                                // resetting the children ids without removing the entry
                                // to better handle the global checkbox and inversion conditions
                                //
                                if (ids.parentId === currentRowId)
                                    return { ...ids, childIds: [] };

                                return ids
                            })
                        ],
                        allSelected: false,
                    }
                }


                onRowSelect?.({ ...updatedState });
                return { ...updatedState };
            }

            // default case if everyhing goes wrong
            return { ...prevRowSelection };
        })

        return;
    }

    const handleHeaderSelection = ({ onRowSelect }: { onRowSelect?: (selectionState: rowSelectionState) => void }) => {
        setRowSelection((prevRowSelection) => {
            const newAllSelected = !prevRowSelection.allSelected;
            const updatedState = {
                selectedRows: [],
                allSelected: newAllSelected,
                isInverseSelection: newAllSelected
            }
            onRowSelect?.(updatedState);
            return { ...updatedState };
        });
        return;

    }

    const handleNormalSelection = ({
        currentRowId,
        onRowSelect
    }: {
        currentRowId: string,
        onRowSelect?: (selectionState: rowSelectionState) => void
    }) => {
        setRowSelection((prevSelectionState: any) => {
            const isRowSelected = currentRowId ? isIdSelected?.(currentRowId) : false
            const updatedState = {
                ...prevSelectionState,
                allSelected: false,
                selectedRows:
                    isRowSelected
                        ? prevSelectionState.selectedRows.filter((id: string | number) => id !== currentRowId)
                        : [...prevSelectionState.selectedRows, currentRowId]
            }
            onRowSelect?.(updatedState);
            return { ...updatedState };
        });
    }


    type getRowSelectedStatus = {
        variants: {
            isHeader: boolean,
            isTree: boolean,
            isNormal: boolean,
        },
        checkboxProps: SelectionCheckboxProps
    }
    const getRowSelectedStatus = ({ variants, checkboxProps }: getRowSelectedStatus): boolean => {
        if (variants.isHeader)
            return rowSelection.allSelected;

        const currentRowId = checkboxProps.currentRowId as string;
        const isInversed = rowSelection.isInverseSelection;
        const allSelected = rowSelection.allSelected;

        // inversed case
        if (variants.isNormal) {
            const isInState = rowSelection.selectedRows.includes(currentRowId);

            // should invert the selection.
            // meaning remove those which are already selected.
            if (isInversed)
                return !isInState;

            return isInState || allSelected;
        }

        if (variants.isTree) {
            const treeprops = checkboxProps as TreeTableCheckbox;
            const { parentId, childrenIds } = treeprops;

            const isChild = parentId !== undefined;
            const isNotNested = !isChild && childrenIds.length === 0;
            const isParent = !isChild && !isNotNested;

            if (isNotNested) {
                const isInState = rowSelection.selectedRows.includes(currentRowId);

                if (isInversed)
                    return !isInState

                return isInState || allSelected
            }

            if (isChild) {
                const parent = rowSelection.selectedRows.find((parent) =>
                    typeof parent !== "string" && parent.parentId === parentId
                ) as { parentId: string, childIds: string[] }

                if (!parent)
                    return isInversed ? true : false;


                const isInState = parent?.childIds?.includes(currentRowId)

                if (isInversed)
                    return !isInState

                return isInState || allSelected;
            }

            if (isParent) {
                const parent = rowSelection.selectedRows.find((parent) =>
                    typeof parent !== "string" && parent.parentId === currentRowId
                ) as { parentId: string, childIds: string[] }

                if (isInversed)
                {
                    // if parent is not found then it should be selected.
                    if(!parent)
                        return true;

                    // if all children are missing then it should be selected.
                    const areAllChildMissing = parent.childIds.length === 0;
                    return areAllChildMissing;
                }

                //Normal condition
                const areAllChildsInState = childrenIds.every((child) => {
                    return parent?.childIds?.includes(child);   
                })

                return areAllChildsInState;
            }
        }

        return false;
    }

    return {
        rowSelection,
        setRowSelection,
        getSelectedChilds,
        areAllChildSelected,
        isIdSelected,
        isGlobalChecked,
        handleTreeRowSelection,
        handleHeaderSelection,
        handleNormalSelection,
        getRowSelectedStatus
    } as const
}
