import { useEffect, useState } from "react";
import VideoControlButtons from "./VideoControlButtons";
import { Stream, StreamPlayerApi } from "@cloudflare/stream-react";
import * as React from "react";
import CropWidget from "./CropWidget";
import {DndContext, DragEndEvent, useDroppable} from "@dnd-kit/core"

type PlayerProps = {
  loggedIn: boolean;
  videoInfo: any;
  title: string;
  setVideoInfo: React.Dispatch<React.SetStateAction<any>>;
}

const Player = ({ loggedIn, videoInfo, title, setVideoInfo }: PlayerProps) => {
  const [endTime, setEndTime] = useState(document.querySelector('video')?.duration || 0);
  const [startTime, setStartTime] = useState(0);
  const ref = React.useRef() as React.MutableRefObject<StreamPlayerApi | undefined>;
  const [videoID, setVideoID] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playPointer, setPlayPointer] = useState(0);
  const [cursorTimer, setCursorTimer] = useState<any>();
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [aspectRatio, setAspectRatio] = useState("");
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isCropActive, setIsCropActive] = useState(false)
  const [videoAspectRatio, setVideoAspectRatio] = useState(16/9);
  const [cropperWidth, setCropperWidth] = useState(0);
  const [cropperHeight, setCropperHeight] = useState(0);

  const {setNodeRef} = useDroppable({
    id: 'droppable',
  });

  function cursorSynch() {
    if (cursorTimer) {
      clearInterval(cursorTimer);
      setPlayPointer(0);
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
    setVideoID(videoInfo?.cflVideoId);
    setVideoURL(videoInfo?.thumbnailUrl);
    setDuration(videoInfo?.durationSecs);
    setEndTime(videoInfo?.durationSecs);
    setPlaying(true);
  }, [videoInfo])

  useEffect(() => {
    // making sure that the new crop widget is in the center of the video
    const parentDiv = document.querySelector('.droppable');
    const w = parentDiv?.clientWidth || 0;
    const h = parentDiv?.clientHeight || 0;
    const [x, y] = aspectRatio.split('/');
    const aspectRatioValue = parseInt(x) / parseInt(y);
    if(aspectRatioValue === videoAspectRatio){
      setLeft(0);
      setTop(0);
    }
    if(aspectRatioValue > videoAspectRatio){
      const cropperH = w / aspectRatioValue;
      const t = (h - cropperH) / 2;
      setTop(t);
      setLeft(0);
      setCropperHeight(cropperH);
      setCropperWidth(w);
    }
    else{
      const cropperW = aspectRatioValue * h;
      const l = (w - cropperW) / 2;
      setLeft(l);
      setTop(0);
      setCropperHeight(h);
      setCropperWidth(cropperW);
    }
  }, [aspectRatio, videoAspectRatio]);



  const showThumbnails = () => {
    const thumbs: string[] = [];
    const step = Math.ceil(Number(videoInfo.durationSecs) / 20);
    for (let i = 0; i < videoInfo.durationSecs; i += step) {
      thumbs.push(videoInfo?.thumbnailUrl + '?time=' + i + 's')
    }
    setThumbnails(thumbs);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedItem = event.activatorEvent.target;
    const parentDiv = document.querySelector('.droppable');
    // @ts-expect-error temporary fix
    const left = draggedItem?.offsetLeft ?? 0;
    // @ts-expect-error temporary fix
    const top = draggedItem?.offsetTop ?? 0;
    // @ts-expect-error temporary fix
    const maxLeft = parentDiv?.clientWidth - draggedItem.clientWidth;
    // @ts-expect-error temporary fix
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

  const getAspectRatioFromImageUrl = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const aspectRatioValue = img.width / img.height;
      setVideoAspectRatio(aspectRatioValue);
    }
  }

  useEffect(() => {
    getAspectRatioFromImageUrl(videoInfo?.thumbnailUrl || '');
  }, [videoInfo])


  return (
    // outer most wrapper
    <div className="h-full">
      <DndContext onDragEnd={handleDragEnd}>
        <div className= "relative droppable brightness-95 mx-auto" data-id={videoID} ref={setNodeRef} style={{height: 'calc(100% - 120px)', aspectRatio: `${videoAspectRatio}`}} >
          {videoID && <Stream className="h-full w-full" poster={videoInfo?.thumbnailUrl} controls responsive={false} src={videoID} height="100%" width="100%" currentTime={startTime} autoplay muted onLoadedData={showThumbnails} streamRef={ref} onPlay={() => { setPlaying(true) }} onPause={() => { setPlaying(false) }} primaryColor={'#FF42A5'} />}
          {aspectRatio && isCropActive && (
            <div className="absolute top-0 left-0 w-full h-full bg-red flex">
              <CropWidget left={left} top={top} width={cropperWidth} height={cropperHeight} aspectRatio={aspectRatio} />
              <div className="h-full bg-black opacity-50 absolute top-0 left-0" style={{width: `${left}px`}}></div>
              <div className="h-full bg-black opacity-50 absolute top-0 right-0" style={{width: `calc(100% - ${cropperWidth}px - ${left}px)`}}></div>
              <div className="w-full bg-black opacity-50 absolute left-0 top-0" style={{height: `${top}px`}}></div>
              <div className="w-full bg-black opacity-50 absolute left-0 bottom-0" style={{height: `calc(100% - ${cropperHeight}px - ${top}px)`}}></div>
            </div>
          )}
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
        playPointer={playPointer} 
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        thumbnails={thumbnails}
        isCropActive={isCropActive}
        setIsCropActive={setIsCropActive}
        videoInfo={videoInfo}
        left={left}
        top={top}
        title={title}
        setVideoInfo={setVideoInfo}
      />)}
      </div >
  );
};

export default Player;

