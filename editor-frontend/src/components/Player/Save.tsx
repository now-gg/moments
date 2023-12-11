import { ReactEventHandler } from 'react'

type SaveProps = {
    onClick: ReactEventHandler;
    isActive: boolean;
}

const Save = ({onClick, isActive} : SaveProps) => {
  return (
    <button 
        className='bg-accent text-white flex justify-center items-center h-10 px-3 gap-3 rounded-md shadow-md text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed'
        onClick={onClick}
        disabled={!isActive}>
        Save Copy
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.64645 5.64645C3.84171 5.45118 4.15829 5.45118 4.35355 5.64645L8 9.29289L11.6464 5.64645C11.8417 5.45118 12.1583 5.45118 12.3536 5.64645C12.5488 5.84171 12.5488 6.15829 12.3536 6.35355L8.35355 10.3536C8.15829 10.5488 7.84171 10.5488 7.64645 10.3536L3.64645 6.35355C3.45118 6.15829 3.45118 5.84171 3.64645 5.64645Z" fill="white" fillOpacity="0.5" />
        </svg>
    </button>
  )
}

export default Save