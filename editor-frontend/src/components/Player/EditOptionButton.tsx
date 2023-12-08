import React from 'react'

type OptionButtonProps = {
    children?: React.ReactNode;
    onClick: React.ReactEventHandler<HTMLButtonElement>;
    isActive?: boolean;
}

const EditOptionButton = ({children, onClick, isActive}: OptionButtonProps) => {
  return (
    <button className={`flex justify-center items-center h-10 px-4 gap-2 rounded-lg ${isActive ? "bg-white" : "bg-base-50"} border ${isActive ? "border-accent" : "border-transparent"} text-sm font-semibold text-black`} onClick={onClick}>
        {children}
    </button>
    )
}

export default EditOptionButton