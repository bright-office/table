import React, { HtmlHTMLAttributes, useRef, LegacyRef } from "react";
import { cn } from "../tailwind/twMerge";
import { Icon } from "../Icons";

type checkBoxProps = { active: boolean, onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void } & HtmlHTMLAttributes<HTMLInputElement>

const CheckBox = ({ active, className, onClick, ...rest }: checkBoxProps) => {
    const checkboxRef = useRef<HTMLInputElement>();

    return <div className="w-[18px] h-18px">
        <input
            type="checkbox"
            {...rest}
            className={cn("outline-none border-none appearance-none relative")}
            ref={checkboxRef as LegacyRef<HTMLInputElement>}
        />

        <div
            className={cn("cursor-pointer absolute inset-0", className)}
            onClick={(e) => { onClick(e) }} >
            {active
                ? <Icon name="checkedCheckbox" className="h-[18px]" />
                : <div className={cn(
                    "unchecked h-[18px] aspect-square rounded-[4px] border-gray-200 bg-gray-100  border-[1px]",
                    "group-hover:bg-gray-200 group-hover:border-gray-300"
                )}>
                </div>}
        </div>
    </div>
}

export default CheckBox;
