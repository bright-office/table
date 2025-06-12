const StyleGuide = () => {
    return (
        <div className="space-y-4 my-5">
            <div className="section">
                <h1 className="font-bold">Style Guide</h1>
                <p>This is a style guide for the table.</p>
            </div>

            <div className="section">
                <h2>Colors</h2>
                <p>
                    For colors both bg and fg are used although only bg is shown and explained for now.
                </p>

                <li>
                    --bg-bt-table-cell: Normal cell background color
                </li>

                <li>
                    --bg-bt-expand-icon: Icon cell background color
                </li>
                <li>
                    --bg-bt-expand-icon-hover: Icon cell background color on hover
                </li>

                <li>
                    --bg-bt-header: Header cell background color.
                </li>

                <li>
                    --bg-bt-odd-row: Odd row cell background color.
                </li>

                <li>
                    --bg-bt-even-row: Even row cell background color.
                </li>

                <li>
                    --bg-bt-tree-col: Tree column cell background color.
                </li>
            </div>
        </div>
    )
}

export default StyleGuide;
