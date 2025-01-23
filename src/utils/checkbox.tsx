import React, { HtmlHTMLAttributes, useRef, LegacyRef } from "react";
import { Icon } from "../Icons";

type checkBoxProps = { active: boolean, onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void } & HtmlHTMLAttributes<HTMLInputElement>

const CheckBox = ({ active, className, onClick, ...rest }: checkBoxProps) => {
    const checkboxRef = useRef<HTMLInputElement>();

    return <div className="w-[18px] h-18px">
        <input
            type="checkbox"
            {...rest}
            // TODO: tailwind remove
            className={("outline-none border-none appearance-none relative")}
            ref={checkboxRef as LegacyRef<HTMLInputElement>}
        />

        <div
            // TODO: tailwind remove
            /* className={("cursor-pointer absolute inset-0 flex items-center justify-center", className)} */
            onClick={(e) => { onClick(e) }} >
            {active
                // TODO: tailwind remove
                ? <Icon name="checkedCheckbox" className="h-[18px]" />
                // TODO: tailwind remove
                : <div className={(
                    "unchecked h-[18px] aspect-square rounded-[4px] border-gray-200 bg-gray-100  border-[1px]"
                    /* "group-hover:bg-gray-200 group-hover:border-gray-300" */
                )}>
                </div>}
        </div>
    </div>
}

export default CheckBox;
