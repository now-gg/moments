import { useEffect, useState } from "react";
import Header from "./Header"
import LoginPopup from "./LoginPopup/index";
import Player from "./Player";
import Page404 from "./Page404";
import Toaster from "./Toaster";
import Sidebar from "./Sidebar";

export default function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [videoInfo, setVideoInfo] = useState({});
  const [title, setTitle] = useState('');
  const [show404, setShow404] = useState(false);
  const [userData, setUserData] = useState({});

  const fetchVideo = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const searchParams = new URLSearchParams(location.search);
    const videoId = searchParams.get('videoId');
    if(!videoId) {
      setShow404(true);
      return;
    }
    let videoInfoUrl = `${import.meta.env.VITE_BACKEND_HOST}/video/info?videoId=${videoId}`;
    if(import.meta.env.VITE_CURRENT_ENV === 'staging' || import.meta.env.VITE_CURRENT_ENV === 'production')
      videoInfoUrl = `${import.meta.env.VITE_VIDEO_BASE}/7/api/vid/v1/getVideoInfo?videoId=${videoId}`;
    fetch(videoInfoUrl)
      .then((res) => {
        if(res.status == 404) {
          setShow404(true);
        }
         return res.json()
      })
      .then((data) => {
        console.log(data);
        if(data?.status === 'FailureVideoNotExist' || data?.status === 'FailureNotPublished') {
          setShow404(true);
          return;
        }
        setVideoInfo(data?.video);
        setTitle(data?.video?.title);
      });
  }

  useEffect(() => {
    fetchVideo();
  }, []);
  
  return (
    <div className="bg-background min-h-screen">
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' />
      <link href='https://fonts.googleapis.com/css2?family=Audiowide&display=swap' rel='stylesheet'/>
      <link href='https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap' rel='stylesheet'/>
      <Toaster />
      <Header setShowLoginPopup={setShowLoginPopup} loggedIn={loggedIn} setLoggedIn={setLoggedIn} videoInfo={videoInfo} title={title} setTitle={setTitle} userData={userData} setUserData={setUserData} />
      <div className="font-poppins p-4 max-w-full mx-auto bg-background flex gap-4" style={{height: 'calc(100vh - 72px)'}} >
          <Player loggedIn={loggedIn} videoInfo={videoInfo} setVideoInfo={setVideoInfo} title={title} setTitle={setTitle} userData={userData}  />
          <Sidebar videoInfo={videoInfo} />
      </div>
      {showLoginPopup && <LoginPopup closePopup={() => setShowLoginPopup(false)} />}
      {show404 && <Page404 />}
    </div>
  )
}