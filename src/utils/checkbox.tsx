import React, { HtmlHTMLAttributes, useRef, LegacyRef } from "react";
import { Icon } from "../Icons";

type checkBoxProps = { active: boolean, onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void } & HtmlHTMLAttributes<HTMLInputElement>

const CheckBox = ({ active, className, onClick, ...rest }: checkBoxProps) => {
    const checkboxRef = useRef<HTMLInputElement>();

    return <div className="w-[18px] h-18px">
        <input
            type="checkbox"
            {...rest}
            style={{
                outline: "none",
                border: "none",
                appearance: "none",
                position: "relative",
            }}
            ref={checkboxRef as LegacyRef<HTMLInputElement>}
        />

        <div
            style={{
                cursor: "pointer",
                position: "absolute",
                inset: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={(e) => { onClick(e) }} >
            {active
                ? <Icon name="checkedCheckbox" style={{ height: "18px" }} />
                : <div
                    className="bt-checkbox-unchecked"
                    style={{
                        height: "18px",
                        aspectRatio: "1",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }} />
            }
        </div>
    </div>
}

export default CheckBox;
