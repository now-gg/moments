import { useEffect, useState } from "react";
import Header from "./Header"
import LoginPopup from "./LoginPopup/index";
import Player from "./Player";

export default function App() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [videoInfo, setVideoInfo] = useState({});

  const fetchVideo = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const searchParams = new URLSearchParams(location.search);
    const videoId = searchParams.get('videoId') || 'doykcyaxtx5bkb';
    let videoInfoUrl = `${import.meta.env.VITE_VIDEO_PROCESS}/video/info?videoId=${videoId}`;
    if(import.meta.env.VITE_CURRENT_ENV === 'staging' || import.meta.env.VITE_CURRENT_ENV === 'production')
      videoInfoUrl = `${import.meta.env.VITE_VIDEO_BASE}/7/api/vid/v1/getVideoInfo?videoId=${videoId}`;
    fetch(videoInfoUrl)
      .then((res) => res.json())
      .then((data) => {
        setVideoInfo(data?.video);
      });
  }

  useEffect(() => {
    fetchVideo();
  }, []);
  
  console.log('open', open);
  return (
    <div className="bg-background min-h-screen">
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' />
      <link
        href='https://fonts.googleapis.com/css2?family=Audiowide&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap'
        rel='stylesheet'
      />
      <Header setOpen={setOpen} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div className="font-poppins p-4 flex justify-between" style={{ gap: '24px' }}>
        <section style={{ flex: 1 }}>
            <Player loggedIn={loggedIn} videoInfo={videoInfo}  />
        </section>
      </div>
      {
        open && <LoginPopup closePopup={() => setOpen(false)} />
      }
    </div>
  )
}