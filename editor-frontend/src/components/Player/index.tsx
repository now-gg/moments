import React, { useEffect, useState } from "react";
// import ReactPlayer from "react-player/file";
import VideoControlButtons from "./VideoControlButtons";
import VideoTimeline from "./VideoTimeline";
import styled from "styled-components";

type PlayerProps = {
  url: string;
};

const VideoFrameWrapper = styled.div`
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
        // height: 50px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 33.52%, rgba(0, 0, 0, 0.80) 81.29%), lightgray -223.782px -1.135px / 145.81% 102.381% no-repeat;
    }
`

const Player = ({ url }: PlayerProps) => {
  let videoRef = React.createRef();

  return (
    // outer most wrapper
    <VideoFrameWrapper className="relative">
      {/* <ReactPlayer playing={playerData.playing} url={url} wrapper={Wrapper} /> */}
      <video ref={videoRef} src={url} controls id="video-frame" height="100%" width="100%" />
      <section className="relative">
        <VideoTimeline url={url} />
      </section>
      <VideoControlButtons />
    </VideoFrameWrapper >
  );
};

export default Player;

