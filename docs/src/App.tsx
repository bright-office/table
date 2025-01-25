import { Cell, Column, ColumnGroup, HeaderCell, Table } from "bright-table"
import { data, mockNestedData, } from "./faker";
import { useEffect, useState } from "react";
import { larvelPaginationObject } from "bright-table/types/src/Pagination.d.ts";
import StyleGuide from "./styleGuide";

function App() {
    const [data, setData] = useState<data[]>([]);
    const [loading, setLoading] = useState(true);
    const [pin, setPin] = useState(false);

    useEffect(() => {
        const data = mockNestedData(101);
        setData(data);
        setLoading(false);
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

    return (
        <div className="p-20">
            <h1>
                MP
            </h1>

            <Table
                name="MP"
                rowSelection
                headerHeight={80}
                renderTableTopNav={() => {
                    return (
                        <div className="flex items-center justify-between h-20 bg-blue-500 text-white">
                            I am the nav
                        </div>
                    )
                }}
                isTree
                rowKey={"id"}
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
                loading={true}
                shouldUpdateScroll={false}
                data={data}
                cellBordered
                height={innerHeight - 200}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column width={100} align="center" fixed={"left"} >
                    <HeaderCell customizable>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <ColumnGroup header="User Name">
                    <Column width={250} fixed={pin ? "right" : false} >
                        <HeaderCell>First Name</HeaderCell>
                        <Cell dataKey="firstname" />
                    </Column>

                    <Column width={150}>
                        <HeaderCell>Last Name</HeaderCell>
                        <Cell dataKey="lastname" />
                    </Column>

                </ColumnGroup>

                <Column width={300} flexGrow={1}>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column>
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

            <h1>
                MNP
            </h1>

            <Table
                name="MNP"
                rowSelection
                headerHeight={80}
                renderTableTopNav={() => {
                    return (
                        <div className="flex items-center justify-between h-20 bg-blue-500 text-white">
                            I am the nav
                        </div>
                    )
                }}
                isTree
                rowKey={"id"}
                loading={loading}
                shouldUpdateScroll={false}
                data={data}
                cellBordered
                height={innerHeight - 200}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column width={100} align="center" fixed={"left"} >
                    <HeaderCell customizable>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <ColumnGroup header="User Name">
                    <Column width={250} fixed={pin ? "right" : false} >
                        <HeaderCell>First Name</HeaderCell>
                        <Cell dataKey="firstname" />
                    </Column>

                    <Column width={150}>
                        <HeaderCell>Last Name</HeaderCell>
                        <Cell dataKey="lastname" />
                    </Column>

                </ColumnGroup>

                <Column width={300} flexGrow={1}>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column>
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

            <h1>
                SP
            </h1>

            <Table
                name="SP"
                rowSelection
                renderTableTopNav={() => {
                    return (
                        <div className="flex items-center justify-between h-20 bg-blue-500 text-white">
                            I am the nav
                        </div>
                    )
                }}

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
                isTree
                rowKey={"id"}
                loading={loading}
                shouldUpdateScroll={false}
                data={data}
                cellBordered
                height={innerHeight - 200}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column width={100} align="center" fixed={"left"} >
                    <HeaderCell customizable>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={250} fixed={pin ? "right" : false} >
                    <HeaderCell>First Name</HeaderCell>
                    <Cell dataKey="firstname" />
                </Column>

                <Column width={150}>
                    <HeaderCell>Last Name</HeaderCell>
                    <Cell dataKey="lastname" />
                </Column>

                <Column width={300} flexGrow={1}>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column>
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

            <h1>
                SNP
            </h1>

            <Table
                name="SNP"
                rowSelection
                renderTableTopNav={() => {
                    return (
                        <div className="flex items-center justify-between h-20 bg-blue-500 text-white">
                            I am the nav
                        </div>
                    )
                }}
                isTree
                rowKey={"id"}
                loading={loading}
                shouldUpdateScroll={false}
                data={data}
                cellBordered
                height={innerHeight - 200}
                onRowClick={rowData => {
                    console.log(rowData);
                }}
            >
                <Column width={100} align="center" fixed={"left"} >
                    <HeaderCell customizable>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={250} fixed={pin ? "right" : false} >
                    <HeaderCell>First Name</HeaderCell>
                    <Cell dataKey="firstname" />
                </Column>

                <Column width={150}>
                    <HeaderCell>Last Name</HeaderCell>
                    <Cell dataKey="lastname" />
                </Column>

                <Column width={300} flexGrow={1}>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="email" />
                </Column>

                <Column>
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

            <StyleGuide />
        </div >
    )
}

export default App
