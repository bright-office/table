import React, { cloneElement, SVGProps } from "react";

const Icons = {
    arrow_right: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" color="currentColor" fill="none">
        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="inherit" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    arrow_right_doubled: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" color="currentColor" fill="none">
        <path d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6" stroke="currentColor" strokeWidth="inherit" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6" stroke="currentColor" strokeWidth="inherit" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    checkedCheckbox: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
        <rect x="0.5" y="0.5" width="17" height="17" rx="4.5" fill="#1B84FF" />
        <rect x="0.5" y="0.5" width="17" height="17" rx="4.5" stroke="#026DE9" />
        <path fillRule="evenodd" clipRule="evenodd" d="M13.1754 4.76258C13.5827 5.13561 13.6105 5.76817 13.2374 6.17544C12.0843 7.43437 11.5299 8.20192 10.697 9.69219C10.3826 10.2548 10.0343 11.0352 9.75672 11.699C9.62 12.026 9.50411 12.3157 9.42249 12.5235C9.38173 12.6273 9.34962 12.7104 9.32786 12.7671L9.30323 12.8316L9.29714 12.8476L9.29573 12.8514C9.17161 13.1812 8.88277 13.4221 8.53594 13.4843C8.18908 13.5465 7.83511 13.4215 7.60417 13.1554L4.74469 9.85969C4.38275 9.44254 4.42751 8.81096 4.84466 8.44901C5.26182 8.08707 5.8934 8.13183 6.25534 8.54898L8.04513 10.6118C8.30929 9.99536 8.63434 9.28338 8.95116 8.71649C9.85954 7.0911 10.5049 6.19765 11.7626 4.82457C12.1356 4.41731 12.7682 4.38955 13.1754 4.76258Z" fill="white" />
    </svg>,
}

export type Icon = keyof typeof Icons;

type iconProps = { name: Icon } & SVGProps<SVGSVGElement>;

export const Icon = ({ name, ...svgProps }: iconProps) => {
    const CurrentIcon = Icons[name];
    if (!CurrentIcon)
        return <p>
            {name} Icon Not found
        </p>

    return cloneElement(CurrentIcon, svgProps);
}
