import React, { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import InputSlider from './InputSlider';

const VideoTimelineWrapper = styled.div`
  position: relative;
  overflow: hidden;
  .slider-container{
    position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 999;
    .slider{
      width:100%;
    }
  }
  *{
    box-sizing: border-box;
  }
  .frames-container{
    height:50px;
    max-width: 100%;
    width: 100%;
    display: flex;
    img{
      height: 100%;
      object-fit: cover;
      display: inline-block;
      width: calc(100%/50);
    }
  }
`
const VideoTimeline: React.FC = ({ url }) => {
  const [video, setVideo] = useState<File | null>(null);
  const [timelineFrames, setTimelineFrames] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVideo(url);
    generateTimeline();
  }, [])


  function log(msg) {
    console.log(`${new Date().toLocaleString("en-us")}: ${msg}`);
  }
  const generateTimeline = () => {
    // if (video) {
    const videoElement = document.createElement('video');
    videoElement.src = url;
    videoElement.crossOrigin = 'anonymous';
    videoElement.addEventListener('loadeddata', () => {
      const duration = videoElement.duration;
      console.log('ducration', duration);
      const frameInterval = duration / 50;
      const numFrames = 50;
      const frames: string[] = [];

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      videoElement.addEventListener('seeked', () => {
        log('video seeked');
        context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const frameImage = canvas.toDataURL('image/jpeg');

        frames.push(frameImage);

        if (frames.length === numFrames) {
          setTimelineFrames(frames);
          setSelectedFrame(frames[0]);
          URL.revokeObjectURL(videoElement.src);
        } else {
          videoElement.currentTime += frameInterval;
        }
        console.log('frames loaded', videoElement.currentTime);
      });

      videoElement.currentTime = 0;
    });
    // }
  };

  const handleSliderChange = () => {
    if (sliderRef.current) {
      const value = parseInt(sliderRef.current.value);
      setSelectedFrame(timelineFrames[value]);
    }
  };
  const style = {
    width: `calc(100%/${timelineFrames.length}px)`,
    padding: 0
  }
  return (
    <VideoTimelineWrapper className="VideoTimeline" data-video={video}>
      <div className="frames-container flex">
        {timelineFrames.map((frame, index) => (
          <img
            key={index}
            src={frame}
            alt={`Frame ${index}`}
            style={style}
            // height={50}
            className={`frame-image ${selectedFrame === frame ? 'selected' : ''
              }`}
          />
        ))}
      </div>
      <div className="slider-container">
        <InputSlider min={0} max={timelineFrames.length - 1} />
        {/* <input
          className='slider'
          type="range"
          min={0}
          max={timelineFrames.length - 1}
          defaultValue={0}
          ref={sliderRef}
          onChange={handleSliderChange}
        /> */}
      </div>
    </VideoTimelineWrapper>
  );
};

export default VideoTimeline;