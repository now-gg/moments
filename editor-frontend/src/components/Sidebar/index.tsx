import { MouseEventHandler, ReactNode, useEffect, useState } from 'react'
import { IconTiktok, IconYoutube } from '../../assets/icons';
import { YOUTUBE_AUTH_URL, uploadToYoutube } from '../../youtube';
import EditingOverlay from '../EditingOverlay';
import { toast } from 'react-hot-toast';

const Sidebar = ({videoInfo, videoAspectRatio}: {videoInfo: any, videoAspectRatio: number}) => {

  const [uploadLoader, setUploadLoader] = useState(false);
  const [ytAccessToken, setYtAccessToken] = useState('');

  const handleYoutubeClick = (isShort=false) => {
    if(ytAccessToken === "")
      youtubeLogin();
    else {
      uploadToYoutube(videoInfo, ytAccessToken, setUploadLoader, youtubeLogin, isShort);
    }
  }

  const youtubeLogin = () => {
    window.location.href = YOUTUBE_AUTH_URL + "?state=" + videoInfo?.videoId;
  }

  const handleYoutubeShortClick = () => {
    if(videoInfo?.durationSecs >= 60) {
      toast.error("Video duration should be less than 60 seconds for Youtube Shorts");
      return;
    }
    if(videoAspectRatio >= 1) {
      toast.error("Video needs to be in portrait mode for Youtube Shorts");
      return;
    }
    handleYoutubeClick(true);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ytToken = searchParams.get('ytAccessToken') ?? '';
    if(ytToken === "") return;
    setYtAccessToken(ytToken);
    searchParams.delete('ytAccessToken');
    window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
    uploadToYoutube(videoInfo, ytToken, setUploadLoader, youtubeLogin);
  }, [videoInfo]);


  return (
    <div className="bg-white rounded-lg p-6 flex flex-col gap-5 flex-grow flex-shrink w-1/4">
      {uploadLoader && <EditingOverlay />}
      <p className="font-semibold text-base text-black">Share your video</p>
      <SidebarButton onClick={() => handleYoutubeClick()}>
        <IconYoutube /> Upload to Youtube
      </SidebarButton>
      <SidebarButton onClick={handleYoutubeShortClick}>
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
      className="px-5 py-3 text-xs font-semibold text-base-800 flex items-center justify-start text-left gap-2 border border-base-400 rounded-lg w-full">
      {children}
    </button>
  )
}

export default Sidebar;