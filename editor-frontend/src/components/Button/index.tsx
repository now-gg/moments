import React from "react"
import cn from "classnames"

type ButtonProps = {
    active?: boolean;
    children?: React.ReactNode
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    style?: Record<string, string>;
    type?: 'primary' | 'secondary'
}

const Button = ({ active = false, children, className, onClick, style, type = "primary", }: ButtonProps) => {
    const primaryStyles = cn("group px-4 h-9 bg-base-50 rounded-lg text-black hover:bg-surface", { 'border border-accent': active })
    const secondaryStyles = "group px-4 h-9 bg-transparent rounded border border-accent text-accent font-normal text-sm hover:bg-accent hover:text-white"

    return (
        <button
            style={style}
            onMouseDown={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            }}
            onClick={onClick}
            className={cn(className, `${type === "primary" ? primaryStyles : secondaryStyles}`)}>
            {children}
        </button >
    )
}

export default Button