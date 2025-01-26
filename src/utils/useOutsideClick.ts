import { RefObject, useEffect } from "react";

type useOutsideClickProps = {
    ref: RefObject<HTMLElement | null>,
    callback: () => void,
    active: boolean,
}

/**
 * A handy hook to run actions based on the click outside the given reference.
 * NOTE: Keep in mind that propagation of the `action` or `callback` must be
 * prevented to ensure this runs perfectly.
 *
 * @param ref {RefObject<HTMLElement | null>} Html ref element.
 * @param callback {() => void}
 * @param active {boolean} trigger to register the event listener.
 *
 */
export const useOutsideClick = ({
    ref,
    callback,
    active,
}: useOutsideClickProps) => {
    useEffect(() => {
        let timeout: any;
        if (!active) return

        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (ref.current && !(ref.current).contains(e.target as HTMLElement)) {
                callback();
            }
        };
        timeout = setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
            document.addEventListener("touchstart", handleOutsideClick);
        }, 0)

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        }
    }, [active])
}

