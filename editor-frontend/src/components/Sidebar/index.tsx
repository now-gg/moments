import { MouseEventHandler, ReactEventHandler, ReactNode, useState } from 'react'
import { IconTiktok, IconYoutube } from '../../assets/icons';
import YoutubeSignin from './YoutubeSignin';

const Sidebar = ({videoInfo}: {videoInfo: any}) => {

  const [youtubeSigninPrompt, setYoutubeSigninPrompt] = useState(false);

  const handleYoutubeClick = () => {
    console.log("Youtube clicked for video: ", videoInfo?.downloadUrl);
    setYoutubeSigninPrompt(true);
  }

  return (
    <div className="bg-white rounded-lg p-6 flex flex-col gap-5 flex-grow flex-shrink w-1/4">
      {youtubeSigninPrompt && <YoutubeSignin closePopup={() => setYoutubeSigninPrompt(false)} />}
      <p className="font-semibold text-base text-black">Share your video</p>
      <SidebarButton onClick={handleYoutubeClick}>
        <IconYoutube /> Upload to Youtube
      </SidebarButton>
      <SidebarButton onClick={() => {}}>
        <IconYoutube /> Upload to Youtube Shorts
      </SidebarButton>
      <SidebarButton onClick={() => {}}>
        <IconTiktok /> Send to Tiktok
      </SidebarButton>
    </div>
  )
}

export const SidebarButton = ({children, onClick}: {children: ReactNode, onClick: MouseEventHandler}) => {
  return (
    <button
      onClick={onClick} 
      className="px-5 py-3 text-xs font-semibold text-base-800 flex items-center justify-start gap-2 border border-base-400 rounded-lg w-full">
      {children}
    </button>
  )
}

export default Sidebar;