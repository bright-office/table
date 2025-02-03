import React, { cloneElement, ReactElement, useRef, useState } from "react";
import { useClassNames } from "./utils";
import { Icon } from "./Icons";
import DirectionAwareContainer from "./utils/directionAwareeContainer";

type rowPerPageSwitcherProps = {
    options: number[],
    selectedOption: number,
    onChange: (newRowPerPage: number) => void;
}

const RowPerPageSwitcher = (props: rowPerPageSwitcherProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [active, setActive] = useState<number>(props.selectedOption || defaultRowsPerPageOptions[0]);

    const activatorRef = useRef<HTMLDivElement>(null);

    return <div className="bt-pagination-rpp-con">
        <div className=""> Rows Per Page:</div>
        <div
            ref={activatorRef}
            className="bt-pagination-rpp-sb"
            onClick={() => setIsVisible(true)} >
            <span>
                {active}
            </span>
            <Icon name="arrow_right" className="bt-pagination-rpp-sb-icon" />
        </div>

        {isVisible &&
            <DirectionAwareContainer
                direction="bottom"
                centerAlignContainer
                directionPriority={["top", "right", "left", "bottom"]}
                activatorRef={activatorRef}
                activateWith="ref"
                onOutsideClick={() => {
                    setIsVisible(false);
                }}
                active={isVisible}
                className="bt-pagination-rpp-sb-options-con"
            >
                {props.options.map((option, index) => (
                    <div
                        key={`RPP-${index}`}
                        onClick={() => {
                            setIsVisible(false);
                            setActive(option)
                            props.onChange(option);
                        }}
                        className={`bt-pagination-rpp-sb-option 
                            ${option == active && "bt-pagination-rpp-sb-option-active"}
                            `}
                    >
                        {option}
                    </div>
                ))}
            </DirectionAwareContainer>
        }
    </div >
};

{/* className={"bt-cursor-pointer hover:bt-bg-gray-200 bt-text-gray-700 bt-rounded-sm"} > */ }
{/* /* option == props.selectedOption */ }
{/* ? "bg-[var(--blue-primary-500)] bt-text-white hover:bg-[var(--blue-primary-500)]" */ }
{/* : "RPP-option" */ }

export type larvelPaginationObject = {
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: {
        url: null | string,
        label: string,
        active: boolean
    }[],
    next_page_url: null | string,
    path: string,
    per_page: number,
    prev_page_url: null | string,
    to: number,
    total: number,
}

export interface paginationProps {
    /** Accepts the larvel pagination response object **/
    serverResponse: larvelPaginationObject | null,

    /** Options to show while switching rowsPerPage */
    rowsPerPageOptions?: rowsPerPageOptions;

    /** Depending on the react framework in use link tags may differ 
     * It makes sure the correct on is used.
     * @default <a href> <a/> is the default tag used.
    * */
    linkComponent?: {
        element: ReactElement,
        urlProp: string,
    };

    /** Method that gets called during page change*/
    onPageChange?: (newPageNumber: number) => void;

    /** Method that gets called when page is set to first page 
     * works only after change meaning, it will not run by default as first page is default.
     * And will only run after page is again set to 1.
    * */
    onFirstPage?: () => void;

    /** Method that gets called when it's the last page */
    onLastPage?: () => void;

    /** Method that gets called when rows per page changes */
    onRowsPerPageChange?: (newRowsPerPage: number) => void;
}

export type rowsPerPageOptions = number[];

export const defaultRowsPerPageOptions = [10, 25, 50, 75, 100];

const Pagination = React.forwardRef<HTMLDivElement, paginationProps>((props, ref) => {
    const {
        serverResponse,
        onRowsPerPageChange,
        onLastPage,
        onFirstPage,
        onPageChange,
        rowsPerPageOptions = defaultRowsPerPageOptions,
        linkComponent = {
            element: <a></a>,
            urlProp: "href",
        }
    } = props;

    // if there is only one link to paginate it is not shown here.
    if (!serverResponse || (serverResponse && serverResponse.links.length < 4))
        return;

    const currentlyActivePage = serverResponse.links.find((link) => link.active);

    const { prefix } = useClassNames("btp");

    const statusString = `${serverResponse.from}-${serverResponse.to} of ${serverResponse.total}`;

    const GoToLastPage = () => {
        const isDisabled = parseInt(currentlyActivePage?.label || "") === serverResponse.last_page;

        return cloneElement(linkComponent.element, {
            onClick: () => {
                onPageChange?.(serverResponse.last_page);
                onLastPage?.()
            },
            [linkComponent.urlProp]: isDisabled ? null : `${serverResponse.last_page_url}&per_page=${serverResponse.per_page}`,
            "aria-disabled": isDisabled,
            children: <Icon
                name="arrow_right_doubled"
                className={`bt-pagination-arrow-btn  ${isDisabled && "bt-pagination-arrow-btn-disabled"}`}
            />
        })
    }

    const GoToFirstPage = () => {
        const isDisabled = parseInt(currentlyActivePage?.label || "") === 1;
        return cloneElement(linkComponent.element, {
            onClick: () => {
                onPageChange?.(1);
                onFirstPage?.()
            },
            [linkComponent.urlProp]: isDisabled ? null : `${serverResponse.first_page_url}&per_page=${serverResponse.per_page}`,
            "aria-disabled": isDisabled,
            children: <Icon
                name="arrow_right_doubled"
                className={`bt-pagination-arrow-btn  ${isDisabled && "bt-pagination-arrow-btn-disabled"}`}
                style={{
                    transform: `rotate(180deg)`
                }}
            />
        })
    }

    const GoBackOnePage = () => {
        const isDisabled = parseInt(currentlyActivePage?.label || "") === 1;
        return cloneElement(linkComponent.element, {
            onClick: () => {
                onPageChange?.(parseInt(currentlyActivePage?.label || "") - 1)
            },
            [linkComponent.urlProp]: isDisabled ? null : `${serverResponse.prev_page_url}&per_page=${serverResponse.per_page}`,
            "aria-disabled": parseInt(currentlyActivePage?.label || "") === 1,
            children: <Icon name="arrow_right"
                className={`bt-pagination-arrow-btn  ${isDisabled && "bt-pagination-arrow-btn-disabled"}`}
                style={{
                    transform: `rotate(180deg)`
                }}
            />
        })
    }


    const GoForwardOnePage = () => {
        const isDisabled = parseInt(currentlyActivePage?.label || "") === serverResponse.last_page;
        return cloneElement(linkComponent.element, {
            onClick: () => {
                onPageChange?.(parseInt(currentlyActivePage?.label || "") + 1)
            },
            [linkComponent.urlProp]: isDisabled ? null : `${serverResponse.next_page_url}&per_page=${serverResponse.per_page}`,
            "aria-disabled": isDisabled,
            children: <Icon
                name="arrow_right"
                className={`bt-pagination-arrow-btn  ${isDisabled && "bt-pagination-arrow-btn-disabled"}`}
            />

        })
    }

    const NumberedSwitcher = () => {
        return <div className={(prefix("numbered-switcher"), "bt-pagination-nps")}>
            {serverResponse.links.slice(1, serverResponse.links.length - 1).map((link, index) => {
                const isDisabled = link.active;

                return cloneElement(linkComponent.element, {
                    onClick: () => {
                        onPageChange?.(parseInt(link.label))
                    },
                    [linkComponent.urlProp]: isDisabled ? null : `${link.url}&per_page=${serverResponse.per_page}`,
                    role: "button",
                    key: `page-${index}`,
                    "aria-disabled": link.active,
                    className: `
                    bt-pagination-nps-btn
                    ${(link.label === "...") && "bt-pagination-nps-btn-unknown"} 
                    ${isDisabled && "bt-pagination-nps-btn-disabled"} 
                    ${link.active && "bt-pagination-nps-btn-active"}`,
                    children: link.label
                })
            })}
        </div>
    }

    return (
        <div
            ref={ref}
            className={("bt-pagination-container")}
        >
            <div className={prefix("status")}>
                {statusString}
            </div>

            <div className={prefix("rpp")}>
                <RowPerPageSwitcher
                    onChange={(newRowPerPage: number) => {
                        onRowsPerPageChange?.(newRowPerPage);
                    }}
                    selectedOption={serverResponse.per_page}
                    options={rowsPerPageOptions}
                />
            </div>

            <div className={(prefix("page-switcher"), "bt-pagination-ps")}>
                <GoToFirstPage />
                <GoBackOnePage />

                <NumberedSwitcher />

                <GoForwardOnePage />
                <GoToLastPage />
            </div>
        </div>
    )
});

Pagination.displayName = 'Pagination';

export default Pagination;
