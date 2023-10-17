import { useEffect, useState } from "react";
import VideoControlButtons from "./VideoControlButtons";
import VideoTimeline from "./VideoTimeline";
import styled from "styled-components";

type PlayerProps = {
  url: string;
};

const VideoFrameWrapper = styled.div`
  .video-wrapper{
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    .crop-wrapper-video{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
      background: rgba(255,255,255,.2);
      &.hide{
        display:none;
      }
      .svg-arrow-wrapper{
        height: 100%;
        width: 100%;
        position: relative;
        svg{
          position: absolute;
          &.left{
            left:0;
          }
          &.top{
            top:0;
          }
          &.bottom{
            bottom:0;
          }
          &.right{
            right:0;
          }
          &.svg-2, &.svg-3{
            left: 50%;
            transform: translate(-50%,0);
          }
          &.svg-6, &.svg-7{
            top: 50%;
            transform: translate(0, -50%);
          }
        }
      }
    }
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

const Player = ({ url }: PlayerProps) => {
  const [endTime, setEndTime] = useState(document.querySelector('video')?.duration);
  const [startTime, setStartTime] = useState(0);
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
      // var parent = document.querySelector('.video-wrapper');
      // var parentRect = parent?.getBoundingClientRect();

      // var draggable = document.querySelector('.crop-wrapper-video');
      // var draggableRect = draggable?.getBoundingClientRect();
      // if ((e.clientX >= parentRect.left && (e.clientX + draggableRect.width <= parentRect.right)) &&
      //   (e.clientY >= parentRect.top && (e.clientY + draggableRect.height >= parentRect.bottom))
      // ) {
      //   element.style.left = `${e.clientX}px`;
      //   element.style.top = `${e.clientY}px`;
      // } else {
      //   element.style.top = (element.offsetTop - pos2) + "px";
      //   element.style.left = (element.offsetLeft - pos1) + "px";
      // }
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

  useEffect(() => {
    dragElement(document.querySelector('.crop-wrapper-video'));
  }, [])
  return (
    // outer most wrapper
    <VideoFrameWrapper className="relative">
      <div className="video-wrapper">
        <video controls id="video-frame" height="100%" width="100%" autoPlay muted loop playsInline preload="none" >
          <source src={url} type="video/mp4" />
        </video>
        <div className="crop-wrapper-video hide">
          <div className="svg-arrow-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-1 top left">
              <path d="M40 2H4C2.89543 2 2 2.90281 2 4.00738C2 19.497 2 23.5073 2 40" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="4" viewBox="0 0 42 4" fill="none" className="svg-2 top">
              <path d="M40 2H2" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="4" viewBox="0 0 42 4" fill="none" className="svg-3 bottom">
              <path d="M40 2H2" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-4 right top">
              <path d="M40 40L40 4C40 2.89543 39.0972 2 37.9926 2C22.503 2 18.4927 2 2 2" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-5 left bottom">
              <path d="M2 2L2 38C2 39.1046 2.90281 40 4.00738 40C19.497 40 23.5073 40 40 40" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="42" viewBox="0 0 4 42" fill="none" className="svg-6 left">
              <path d="M2 2L2 40" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="42" viewBox="0 0 4 42" fill="none" className="svg-7 right">
              <path d="M2 2L2 40" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-8 bottom right">
              <path d="M2 40L38 40C39.1046 40 40 39.0972 40 37.9926C40 22.503 40 18.4927 40 2" stroke="#FF42A5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <section className="relative bg-color timeline-wrapper">
        <VideoTimeline url={url} startTime={startTime} endTime={endTime} setEndTime={setEndTime} duration={document.querySelector('video')?.duration} />
      </section>
      <VideoControlButtons setStartTime={setStartTime} setEndTime={setEndTime} startTime={startTime} endTime={endTime} />
    </VideoFrameWrapper >
  );
};

export default Player;

