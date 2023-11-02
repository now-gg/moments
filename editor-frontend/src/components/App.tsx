import Editor from "./Editor"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function App() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="font-poppins p-4 flex justify-between">
        {/* <Editor url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" /> */}
        <Editor url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
        <Sidebar sidebar="Share Your Video" />
      </div>
    </div>
  )
}