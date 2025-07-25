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

    const serverResponse: larvelPaginationObject = {
        "first_page_url": "https://localschool.test/app/messages?page=1",
        "from": 1,
        "last_page": 70,
        "last_page_url": "https://localschool.test/app/messages?page=70",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": "https://localschool.test/app/messages?page=2",
                "label": "2",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=3",
                "label": "3",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=4",
                "label": "4",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=5",
                "label": "5",
                "active": false
            },
            {
                "url": null,
                "label": "...",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=69",
                "label": "69",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=70",
                "label": "70",
                "active": false
            },
            {
                "url": "https://localschool.test/app/messages?page=2",
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "next_page_url": "https://localschool.test/app/messages?page=2",
        "path": "https://localschool.test/app/messages",
        "per_page": 10,
        "prev_page_url": null,
        "to": 10,
        "total": 697
    }
    const [sort, setSort] = useState<"asc" | "desc" | undefined>();

    return (
        <div className="p-20 h-full">
            <Table
                name="MP"
                rowSelection
                headerHeight={80}
                isTree
                rowKey={"id"}
                rowBordered
                pagination={{
                    serverResponse,
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
                        setSort((prev) => {
                            if (prev === "asc") {
                                return "desc"
                            }
                            if (prev === "desc") {
                                return undefined
                            }
                            return "asc"
                        })
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

            {/* <StyleGuide /> */}
        </div>
    )
}

export default App
