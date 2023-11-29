import { useEffect, useState } from "react";
import VideoControlButtons from "./VideoControlButtons";
import styled from "styled-components";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import * as React from "react";
import CropWidget from "./CropWidget";
import {DndContext, DragEndEvent, useDroppable} from "@dnd-kit/core"

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
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [aspectRatio, setAspectRatio] = useState("16/9");

  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });

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

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedItem = event.activatorEvent.target;
    const parentDiv = document.querySelector('.droppable');
    const left = draggedItem?.offsetLeft ?? 0;
    const top = draggedItem?.offsetTop ?? 0;
    const maxLeft = parentDiv?.clientWidth - draggedItem.clientWidth;
    const maxTop = parentDiv?.clientHeight - draggedItem.clientHeight;
    let x = left + event.delta.x;
    let y = top + event.delta.y;
    if(x < 0)
      x = 0;
    else if(x > maxLeft)
      x = maxLeft;
    if(y < 0)
      y = 0;
    else if(y > maxTop)
      y = maxTop;
    setLeft(x);
    setTop(y);
  }

  return (
    // outer most wrapper
    <VideoFrameWrapper>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="border-4 border-green-500 relative droppable" data-id={videoID} ref={setNodeRef} >
          {videoID && <Stream controls src={videoID} height="100%" width="100%" currentTime={startTime} autoplay muted onLoadedData={showThumbnails} streamRef={ref} onPlay={() => { setPlaying(true) }} onPause={() => { setPlaying(false) }} primaryColor={'#FF42A5'} />}
          <CropWidget left={left} top={top} aspectRatio={aspectRatio} />
        </div>
      </DndContext>
      {endTime && (
      <VideoControlButtons 
        videoUrl={videoURL} 
        setPlaying={setPlaying} 
        playing={playing} 
        setStartTime={setStartTime} 
        setEndTime={setEndTime} 
        startTime={startTime}
        endTime={endTime} 
        duration={duration} 
        setVideoID={setVideoID} 
        loggedIn={loggedIn} 
        streamRef={ref}
        palyPointer={palyPointer} 
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />)}
      </VideoFrameWrapper >
  );
};

export default Player;

