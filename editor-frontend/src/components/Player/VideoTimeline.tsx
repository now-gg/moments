import { useState, useEffect } from 'react';
import styled from "styled-components";
import InputSlider from './InputSlider';

type VideoProps = {
  url: string,
  startTime: number,
  endTime: number | undefined,
  duration: number | undefined,
};

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
      // width: calc(100%/50);
    }
  }
`
const VideoTimeline = ({ url, startTime, endTime, duration }: VideoProps) => {
  const [video, setVideo] = useState('');

  useEffect(() => {
    setVideo(url);
    // generateTimeline();
  }, [])

  return (
    <VideoTimelineWrapper className="VideoTimeline" data-video={video}>
      <div className="frames-container flex bg-color">

      </div>
      <div className="slider-container">
        <InputSlider minVal={startTime} maxVal={endTime} duration={duration} />
      </div>
    </VideoTimelineWrapper>
  );
};

export default VideoTimeline;