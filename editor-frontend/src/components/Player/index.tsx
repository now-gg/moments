import { useEffect, useState } from "react";
import VideoControlButtons from "./VideoControlButtons";
import VideoTimeline from "./VideoTimeline";
import styled from "styled-components";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import * as React from "react";
import CropWidget from "./CropWidget";

type PlayerProps = {
  loggedIn: boolean
}
const VideoFrameWrapper = styled.div`
  .video-wrapper{
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: block;
    margin: 0 auto;
    max-width: calc((100vh * 1.7) - 332px);
  }
  .canvas-wrapper{
    position: absolute;
    bottom: 0;
    z-index: 9;
    canvas{
      height: 20px;
      color: #fff;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 33.52%, rgba(0, 0, 0, 0.80) 81.29%), lightgray -223.782px -1.135px / 145.81% 102.381% no-repeat;
    }
  }
  section.relative{
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 33.52%, rgba(0, 0, 0, 0.80) 81.29%), lightgray -223.782px -1.135px / 145.81% 102.381% no-repeat;
    &.bg-color{
      background: rgba(0,0,0, .7);
    }
  }
`

const Player = ({ loggedIn }: PlayerProps) => {
  const [endTime, setEndTime] = useState(document.querySelector('video')?.duration || 0);
  const [startTime, setStartTime] = useState(0);
  // const ref = React.useRef<StreamPlayerApi | undefined>(null);
  const ref = React.useRef() as React.MutableRefObject<StreamPlayerApi | undefined>;
  // const ref = MutableRefObject<StreamPlayerApi | undefined>
  const [videoID, setVideoID] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [palyPointer, setPlayPointer] = useState(0);
  const [cursorTimer, setCursorTimer] = useState<any>();

  const dragElement = (element: any) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragMouseDown = (e: any) => {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    const elementDrag = (e: any) => {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    const closeDragElement = () => {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
    if (element) {
      element.onmousedown = dragMouseDown;
    }
  }

  const fetchVideo = () => {
    console.log("=====import.meta.env.VITE_SOME_KEY", import.meta.env)
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let searchParams = new URLSearchParams(location.search);
    let videoId = searchParams.get('videoId') || 'doykcyaxtx5bkb';
    let videoInfoUrl = `${import.meta.env.VITE_VIDEO_PROCESS}/video/info?videoId=${videoId}`;
    if(import.meta.env.VITE_CURRENT_ENV === 'staging' || import.meta.env.VITE_CURRENT_ENV === 'production')
      videoInfoUrl = `${import.meta.env.VITE_VIDEO_BASE}/7/api/vid/v1/getVideoInfo?videoId=${videoId}`;
    fetch(videoInfoUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        setVideoID(data?.video?.cflVideoId);
        setVideoURL(data?.video?.thumbnailUrl);
        setDuration(data?.video?.durationSecs);
        setEndTime(data?.video?.durationSecs);
        setPlaying(true);
      });
  }

  function cursorSynch() {
    if (cursorTimer) {
      clearInterval(cursorTimer);
    }
    let timer = setInterval(() => {
      let currentPlayTime = ref?.current?.currentTime || 0
      setPlayPointer(currentPlayTime);
      if (duration && duration > 0 && currentPlayTime >= (endTime - .15)) {
        let startBound = 0;
        if (startTime) {
          startBound = parseInt(startTime?.toString());
        }
        setStartTime(1);
        setTimeout(() => { setStartTime(startBound); }, 100)
        ref?.current?.pause();
      }
    }, 260)
    setCursorTimer(timer);
  }

  useEffect(() => {
    cursorSynch();
  }, [startTime, endTime])


  useEffect(() => {
    dragElement(document.querySelector('.crop-wrapper-video'));
    document.querySelector('iframe')?.addEventListener('onloadeddata', (e) => {
      console.log('e', e);
    })
    fetchVideo();
  }, [])

  function toDataURL(src: any, callback: any) {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function (e: any) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = e.target.naturalHeight;
      canvas.width = e.target.naturalWidth;
      context?.drawImage(e.target, 0, 0);
      var dataURL = canvas.toDataURL('image/jpeg');
      callback(dataURL);
    };
    image.src = src;
  }

  const showThumbnails = () => {
    console.log("SHOW THUMBNAILS")
    let frameCount = ref?.current?.duration || 2;
    for (let i = 0; i < Math.floor(frameCount); i++) {
      let newNode = document.createElement('img');
      newNode.setAttribute('style', `width:calc(100%/${frameCount})`)
      toDataURL(`${videoURL}?time=${i}s`, function (dataURL: any) {
        // alert(dataURL);
        newNode.src = dataURL;
      })
      document.querySelector('.frames-container')?.appendChild(newNode);
    }
  }

  // const videoID = 'b3952a3e477c4165931a8253663edcbc';
  return (
    // outer most wrapper
    <VideoFrameWrapper className="relative">
      <div className="video-wrapper" data-id={videoID}>
        {videoID && <Stream controls src={videoID} height="100%" width="100%" currentTime={startTime} autoplay muted onLoadedData={showThumbnails} streamRef={ref} onPlay={() => { setPlaying(true) }} onPause={() => { setPlaying(false) }} primaryColor={'#FF42A5'} />}
        <CropWidget />
      </div>
      {endTime && <VideoControlButtons videoUrl={videoURL} setPlaying={setPlaying} playing={playing} setStartTime={setStartTime} setEndTime={setEndTime} startTime={startTime} endTime={endTime} duration={duration} setVideoID={setVideoID} loggedIn={loggedIn} streamRef={ref} palyPointer={palyPointer} />}
    </VideoFrameWrapper >
  );
};

export default Player;

