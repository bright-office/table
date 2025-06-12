# Bright Table

A table library released by and for Brightsoftware. It is open for everyone to use and contribute.


![Example screenshot from the example/react](https://github.com/user-attachments/assets/74116377-e84f-43e1-ac88-b71876f18803)


## ✨ Features

### 🔧 Core Functionality
- **Virtual Scrolling** - High performance rendering for large datasets ( probably in future ).
- **Server-side Pagination** - Laravel-compatible pagination support
- **Sorting** - Built-in column sorting with custom sort indicators ( requires manual sorting by the way. )
- **Row Selection** - Single and multi-row selection with checkboxes
- **Tree Tables** - Hierarchical data display with expandable rows

### 🎨 UI/UX Features
- **RTL Support** - Right-to-left language compatibility
- **Striped Rows** - Alternating row colors for better readability
- **Hover Effects** - Interactive row highlighting
- **Loading States** - Built-in loading indicators and empty states

### 📱 Layout & Styling
- **Fixed Columns** - Pin columns to left or right
- **Column Groups** - Group related columns with headers
- **Auto Height** - Dynamic table height based on content
- **Custom Cell Rendering** - Flexible cell content with custom components
- **Cell and Row span** - Span cells across rows and columns
- **CSS Variables** - Easy theming and customization

## 📦 Installation

```bash
npm install @brightsoftware/table
# or
yarn add @brightsoftware/table
# or
bun add @brightsoftware/table
```

## 🚀 Example
> [!NOTE]
> This is the code for above displayed table.

```tsx
import { Cell, Column, ColumnGroup, HeaderCell, Table } from "@brightsoftware/table"
import { data, mockNestedData, } from "./faker";
import { useEffect, useState } from "react";
import { larvelPaginationObject } from "@brightsoftware/table/types/src/Pagination.d.ts";

function App() {
    const [data, setData] = useState<data[]>([]);

    useEffect(() => {
        const data = mockNestedData(101);
        setData(data);
    }, []);

    const [sort, setSort] = useState<"asc" | "desc" | undefined>();

    return (
            <Table
                name="MP"
                rowSelection
                headerHeight={80}
                isTree
                rowKey={"id"}
                rowBordered
                pagination={{
                    // laravel pagination serverResponse,
                    onRowsPerPageChange(newRowPerPage) {
                        console.log(newRowPerPage)
                    },
                    linkComponent: {
                        element: <a />,
                        urlProp: "href"
                    }
                }}
                shouldUpdateScroll={false}
                stripeRows
                data={data}
                cellBordered
                autoHeight
            >
                <Column width={200} customizable id="sn">
                    <HeaderCell>
                        sn
                    </HeaderCell>
                    <Cell>
                        {(_, i) => {
                            return (i || 0 + 1);
                        }}
                    </Cell>
                </Column>

                <ColumnGroup header="User Name">
                    <Column width={250} customizable id="firstname">
                        <HeaderCell>First Name</HeaderCell>
                        <Cell >
                            {(rd) => {
                                return rd.firstname;
                            }}
                        </Cell>
                    </Column>

                    <Column width={150} customizable id="lastname">
                        <HeaderCell>Last Name</HeaderCell>
                        <Cell dataKey="lastname" />
                    </Column>

                </ColumnGroup>

                <Column
                    width={300}
                    minWidth={300}
                    flexGrow={1}
                    align="left"
                    customizable
                    id="email"
                    sort={sort}
                    onHeaderClick={() => {
                      // your actions
                    }}
                >
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column width={100} align="center">
                    <HeaderCell>...</HeaderCell>
                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <button onClick={() => alert(`id:${rowData.id}`)}>
                                Edit
                            </button>
                        )}
                    </Cell>
                </Column>
            </Table>
    )
}

export default App
```

## 🏢 About

Developed by [Bright Office System](https://brightit.com.np/) - A leading software development company focused on creating modern, efficient web solutions.

---

For more examples, please visit the example/react folder for now.

