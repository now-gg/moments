
type DeletePopupProps = {
    closePopup: () => void,
    deleteVideo: () => void
}

const DeletePopup = ({closePopup, deleteVideo}: DeletePopupProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closePopup}>
          <div className="bg-white rounded-md p-4 flex flex-col justify-center gap-4 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base-500 text-md font-bold">Delete your Video?</h2>
            <p className="text-base-500 text-sm font-normal">Are you sure you want to delete your video. Once deleted you wont be able to access it again.</p>
            <div className="flex justify-end gap-x-2.5 mt-4 w-full">
              <button className="w-1/2 bg-white text-accent border border-accent flex justify-center items-center h-10 px-3 gap-3 rounded-md text-sm font-semibold" onClick={closePopup}>Cancel</button>
              <button className='w-1/2 bg-accent text-white border border-accent flex justify-center items-center h-10 px-3 gap-3 rounded-md shadow-md text-sm font-semibold' onClick={deleteVideo}>Delete</button>
            </div> 
          </div>
        </div>
  )
}

export default DeletePopup