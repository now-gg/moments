import { useState } from "react";
import Editor from "./Editor"
import Header from "./Header"
import LoginPopup from "./LoginPopup/index";
import Sidebar from "./Sidebar"

export default function App() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
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
        <Editor loggedIn={loggedIn} />
        {/* <Editor url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" /> */}
        <Sidebar sidebar="Share Your Video" />
      </div>
      {
        open && <LoginPopup closePopup={() => setOpen(false)} />
      }
    </div>
  )
}