import React from 'react'

type TrimInputProps = {
    label: string;
    value: string;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onEnterClick: () => void;
}


const TrimInput = ({label, value, placeholder, onChange, onBlur, onEnterClick}: TrimInputProps) => {
  return (
    <div className='flex justify-center items-center gap-1'>
        <span className="text-xs text-white">{label}</span>
        <input 
        className="bg-white appearance-none py-1.5 px-3 rounded-md text-sm text-black  placeholder:text-base-100 max-w-[8ch] outline-none" 
        value={value}
        placeholder={placeholder} 
        onChange={onChange} 
        onBlur={onBlur}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                onEnterClick()
            }
        }}
        />
    </div>
  )
}

export default TrimInput