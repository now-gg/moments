type CropOptionButtonProps = {
    text?: string;
    value: string;
    isActive: boolean;
    onClick: (aspectRatio: string) => void;
}

const CropOptionButton = ({text, value, isActive, onClick}: CropOptionButtonProps) => {
  console.log(value, isActive);
  const valueText = value.replace("/", ":")
  return (
    <button className={`flex py-2 px-3 text-xs ${isActive ? "text-black" : "text-base-100"} border-none rounded-md bg-white shadow-sm`} onClick={() => { onClick(value) }}>{text ?? valueText}</button>
  )
}

type CropOptionsProps = {
    aspectRatio: string;
    onOptionClick: (aspectRatio: string) => void;
}

const CropOptions = ({onOptionClick, aspectRatio}: CropOptionsProps) => (
    <div className="flex bg-additional-link px-1 h-10 gap-1 rounded-md">
        <div className="flex p-1 gap-1">
        <CropOptionButton value="16/9" text='Default' onClick={onOptionClick} isActive={aspectRatio === "16/9"} />
        <CropOptionButton value="1/1" onClick={onOptionClick} isActive={aspectRatio === "1/1"} />
        <CropOptionButton value="9/16" onClick={onOptionClick} isActive={aspectRatio === "9/16"} />
        <CropOptionButton value="3/4" onClick={onOptionClick} isActive={aspectRatio === "3/4"} />
        <CropOptionButton value="4/3" onClick={onOptionClick} isActive={aspectRatio === "4/3"} />
        </div>
    </div>
)

export default CropOptions;