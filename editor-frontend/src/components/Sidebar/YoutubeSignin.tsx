import { YOUTUBE_AUTH_URL } from "../../youtube"

const YoutubeSignin = ({closePopup}: {closePopup: () => void}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closePopup}>
        <div className="bg-white rounded-md p-16 flex flex-col justify-center gap-4 max-w-md" onClick={(e) => e.stopPropagation()}>
            <a href={YOUTUBE_AUTH_URL} className="cursor-pointer text-md font-bold bg-red-500 text-white rounded-full px-4 py-2">Sign in to upload video on Youtube</a>
        </div>
    </div>
  )
}

export default YoutubeSignin