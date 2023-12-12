import { ReactEventHandler } from 'react'

type SaveProps = {
    onClick: ReactEventHandler;
    isActive: boolean;
}

const Save = ({onClick, isActive} : SaveProps) => {
  return (
    <button 
        className='bg-accent text-white flex justify-center items-center h-10 px-4 rounded-md shadow-md text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed'
        onClick={onClick}
        disabled={!isActive}>
        Save Copy
    </button>
  )
}

export default Save