import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Avatar(props:HTMLAttributes<HTMLDivElement>){
    const {className, children, ...otherProps}=props;
    return (
        <div className={twMerge('overflow-hidden rounded-full size-20 border border-blue-500 p-1 ',className)} {...otherProps}>
            {children}
        </div>
    )
}