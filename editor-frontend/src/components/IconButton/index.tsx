import React from "react"
import cn from "classnames"

type IconButtonProps = {
    children?: React.ReactNode
    className?: string;
    color?: 'warning' | 'link'
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    style?: Record<string, string>;
    type?: 'primary' | 'secondary'
}

const IconButton = ({ children, className, color = "warning", onClick, style, type = "primary" }: IconButtonProps) => {
    const commonStyles = "group flex items-center justify-center w-9 h-9 rounded";
    const primaryStyles = cn(commonStyles, "bg-surface hover:bg-accent")
    const secondaryStyles = cn(commonStyles, `bg-transparent border border-additional-${color} hover:bg-additional-${color}`)

    return (
        <button
            style={style}
            onMouseDown={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            }}
            onClick={onClick}
            className={cn(className, { [primaryStyles]: type === "primary", [secondaryStyles]: type === "secondary" })}>
            {children}
        </button >
    )
}

export default IconButton