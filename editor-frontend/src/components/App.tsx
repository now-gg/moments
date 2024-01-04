import { useEffect, useState } from "react";
import Header from "./Header"
import LoginPopup from "./LoginPopup/index";
import Player from "./Player";
import Page404 from "./Page404";
import Toaster from "./Toaster";

export default function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [videoInfo, setVideoInfo] = useState({});
  const [title, setTitle] = useState('');
  const [show404, setShow404] = useState(false);
  const [userData, setUserData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (e: any) => {
    // Update the state with the selected file
    setSelectedFile(e.target.files[0]);
  };

  const uploadVideo = () => {
    if(!selectedFile)
      return;
    const headers = new Headers();
    headers.append("Authorization", "Bearer ya29.a0AfB_byDBU2ACki-ffARHst1NYS-hYcCYOhOLospFUJsLNGG6KQz9BuAwnXnHmxl5Sti7qrX5xDikLPqkhGnBdzqbTImZ74CmjGj_737jpKIFiqf9FFxzp_UURGdaKr33XW5E09T9x37vuzamCQgSZo-YwM2ewHDEaQaCgYKAVMSARASFQHGX2Mi6WitdXEzutqib3NW8VnylQ0169");
    headers.append("Content-Type", "video/*");
    headers.append("Content-Length", "4683375");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const url = "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet%2Cstatus&uploadType=resumable&upload_id=ABPtcPqUP2vT8vzUOWxLPp7dd1Q29Oan2BY7LdkWQ4g-OwXfl6sbmi1nkfYzJuQ7u5hrxHfWNF2DUS7Hqr2EReLvGwZCtUi_WqKcS2E_WDVg185jRw";

    fetch(url, {
      method: 'PUT',
      headers: headers,
      body: formData
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    })
  }
  
  return (
    <div className="bg-background min-h-screen">
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' />
      <link href='https://fonts.googleapis.com/css2?family=Audiowide&display=swap' rel='stylesheet'/>
      <link href='https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap' rel='stylesheet'/>
      <Toaster />
      <Header setShowLoginPopup={setShowLoginPopup} loggedIn={loggedIn} setLoggedIn={setLoggedIn} videoInfo={videoInfo} title={title} setTitle={setTitle} userData={userData} setUserData={setUserData} />
      <div className="font-poppins p-4 max-w-screen flex" style={{height: 'calc(100vh - 72px)'}} >
          <Player loggedIn={loggedIn} videoInfo={videoInfo} setVideoInfo={setVideoInfo} title={title} setTitle={setTitle} userData={userData}  />
          <div className="h-full bg-red-100 w-full flex flex-col gap-12">
            <input type='file' accept='video/*' onChange={handleFileChange} />
            <button 
              onClick={uploadVideo}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload
            </button>

          </div>
      </div>
      {showLoginPopup && <LoginPopup closePopup={() => setShowLoginPopup(false)} />}
      {show404 && <Page404 />}
    </div>
  )
}