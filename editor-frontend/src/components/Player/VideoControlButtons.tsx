import { ReactEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import VideoTimeline from './VideoTimeline';
import { IconCrop, IconPause, IconPlay, IconTrim, IconReset } from '../../assets/icons';
import EditOptionButton from './EditOptionButton';
import CropOptions from './CropOptions';
import Divider from '../Divider';
import Save from "./Save";

type ControlProps = {
  videoUrl: string;
  startTime: any,
  endTime: any,
  setStartTime: Function,
  setEndTime: Function,
  duration: number,
  setVideoID: Function,
  loggedIn: boolean,
  setPlaying: Function,
  playing: boolean,
  streamRef: any,
  palyPointer: number,
  aspectRatio: string,
  setAspectRatio: Function,
  thumbnails: string[],
  isCropActive: boolean,
  setIsCropActive: Function,
  videoInfo: any,
  left: number,
  top: number,
};

const VideoControlsWrapper = styled.section`
  justify-content: space-between;
  margin-top:8px;
  .play-trim-crop-options{
    gap:16px;
  }
  .reset-btn{
    margin-right: 16px;
    position: relative;
    &::after{
      content: "";
      background: rgba(0, 0, 0, 0.20);
      width: 1px;
      position: absolute;
      right: -16px;
      top: 0;
      bottom: 0;
    }
  }
  .play-btn{
    height:36px;
    width:36px;
    margin-right: 16px;
    position: relative;
    &::after{
      content: "";
      background: rgba(0, 0, 0, 0.20);
      width: 1px;
      position: absolute;
      right: -16px;
      top: 0;
      bottom: 0;
    }
  }
  .reset-save-options{
    gap: 12px;
  }
  .trim-action, .crop-action, .reset-save-options{
    overflow: hidden;
    // gap: 12px;
    .trim-btn, .crop-btn, .reset-btn, .save-btn{
      border-radius: 8px;
      background: #E3DFEC;
      padding: 8px 16px;
      gap: 8px;
      font-size: .88em;
      font-weight: 600;
      line-height: 1em;
      justify-content: center;
      align-items: center;
      height: 36px;
    }
    .trim-options, .crop-options{
      border-radius: 8px;
      background: var(--additional-link, #0397EB);
      align-items: center;
      animation: 500ms slide-right;
      overflow: hidden;
      margin-left: 12px;
      &.hide{
        animation: 500ms slide-left;
        width: 0;
        margin-left: 0;
      }
      .padding-wrapper{
        padding: 0px 4px 0px 8px;
        gap: 4px;
      }
      .span-time{
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        line-height: 150%;
        color: rgba(255,255,255,.8);
        gap:4px;
      }
      .input-time, .input-crop{
        border-radius: 6px;
        border: 1px solid var(--Background, #EEEDF0);
        background: var(--White, #FFF);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
        width: 72px;
        height: 30px;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 400;
        line-height: 150%;
        text-align: center;
        color: #B5ACCD;
        cursor:pointer;
      }
      .error-input{
        border : 1px solid red;
      }
      input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    .crop-options{
      gap:4px;
      .input-crop{
        &.selected{
          color:#332A4B;
        }
        &:not(:first-child){
          width: 42px;
        }
        &:first-child{
          width:76px;
        }
      }
    }
    .save-btn{
      border-radius: 6px;
      border: 1px solid var(--Background, #EEEDF0);
      background: var(--Accent, #FF42A5);
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04);
      color: #FFF;
      &.disabled{
        opacity: .4;
      }
    }
  }
  
  @keyframes slide-right {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  @keyframes slide-left {
    from {
      width:100%;
    }
    to {
      width: 0%;
    }
  }
`

const VideoControlButtons = ({ videoUrl, startTime, endTime, setStartTime, setEndTime, duration, playing, streamRef, palyPointer, aspectRatio, setAspectRatio, thumbnails, isCropActive, setIsCropActive, videoInfo, left, top }: ControlProps) => {


  const [trimStartTime, setTrimStartTime] = useState(startTime || 0);
  const [trimEndTime, setTrimEndTime] = useState(endTime || 0);

  const [isTrimActive, setIsTrimActive] = useState(false);

  useEffect(() => {
    console.log("startTime", startTime);
    setTrimStartTime(startTime);
  }, [startTime]);

  useEffect(() => {
    console.log("endTime", endTime);
    setTrimEndTime(endTime);
    console.log(streamRef)
  }, [endTime]);

  const sendProcessRequest = async () => {
    console.log("sendAPIRequest")

    const headers = {
      'Content-Type': 'application/json',
      token: `${localStorage['ng_token']}`,
    }

    const payload:any = {
      "videoId": videoInfo.videoId,
      "title": videoInfo.title,
    }

    if (isTrimActive) {
      payload["trim"] = {
        start: trimStartTime,
        end: trimEndTime
      }
    }

    if (isCropActive) {
      const cropper = document.querySelector(".draggable");
      console.log(cropper)
      if(!cropper) return;
      payload["crop"] = {
        x1: left,
        y1: top,
        x2: left + cropper.clientWidth,
        y2: top + cropper.clientHeight,
      }
    }

    if(payload["trim"] || payload["crop"]) {
      fetch(`${import.meta.env.VITE_VIDEO_PROCESS}/video/process`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

    // if (payload && Object.keys(payload).length > 0) {
    //   await axios
    //     .post(`${import.meta.env.VITE_VIDEO_PROCESS}/video/process`, payload, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         token: `${localStorage['ng_token']}`,
    //       },
    //     })
    //     .then(function (res: any) {
    //       if (res && res.status === 200) {
    //         // localStorage.setItem('ng_token', res.token);
    //         console.log('res', res);
    //         setVideoID('');
    //       }
    //     })
    //     .catch((err: any) => {
    //       console.log('err', err);
    //       // console.log('signup not possible -- error 401');
    //     });
    // }
  }

  const onTrimButtonClick: ReactEventHandler = () => { 
    setIsTrimActive(!isTrimActive);
  }

  const handleTrimInput: ReactEventHandler = (e) => {
    let x = parseInt(e.target.value);
    console.log("x", x, typeof x)
    if(isNaN(x))
      x = 0;
    if(x > duration || x < 0)
      return;
    if(e.target.id === "start") {
      if(x > endTime)
        return;
      setStartTime(x);
    }
    if(e.target.id === "end") {
      if(x < startTime)
        return;
      setEndTime(x);
    }
  }

  const onCropButtonClick: ReactEventHandler = () => { 
    if(!isCropActive) {
      setIsCropActive(true);
      setAspectRatio(aspectRatio ?? '9/16');
      return;
    }
    setIsCropActive(false);
  }

  const handleAspectRatioChange = (cropRatio: string) => {
    setAspectRatio(cropRatio);
  }

  const resetOptions = () => {
    setStartTime(0);
    setEndTime(duration);
    setAspectRatio('');
    setIsTrimActive(false);
    setIsCropActive(false);
  }

  const handlePLayClick: ReactEventHandler = () => {
    if (playing) {
      streamRef.current?.pause();
      return;
    }
    streamRef.current?.play();
  }

  const isSaveAllowed = isCropActive || isTrimActive;

  return (
    <>
      <VideoTimeline url={videoUrl} setStartTime={setStartTime} setEndTime={setEndTime} startTime={startTime} endTime={endTime} duration={duration} palyPointer={palyPointer} thumbnails={thumbnails} />
      <VideoControlsWrapper className="flex pt-2 pb-4">
        <div className="flex gap-4 items-center">
          <button className="h-9 w-9" onClick={handlePLayClick}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <Divider />
          <div className="flex gap-3">
              <EditOptionButton onClick={onTrimButtonClick} isActive={isTrimActive}>
                <IconTrim />
                Trim
              </EditOptionButton>
            {isTrimActive && <div className="flex justify-center items-center gap-4 pl-2 pr-1 h-10 rounded-lg bg-additional-link">
                <div className=' flex justify-center items-center gap-1'>
                  <span className="text-xs text-white">Start Time</span>
                  <input id="start" className="bg-white py-1.5 px-3 rounded-md text-sm text-black placeholder:text-base-100 max-w-[8ch] outline-none" value={trimStartTime} placeholder="0 sec" onChange={handleTrimInput} />
                </div>
                <div className='flex justify-center items-center gap-1'>
                  <span className="text-xs text-white">End Time</span>
                  <input id="end" className="bg-white py-1.5 px-3 rounded-md text-sm text-black  placeholder:text-base-100 max-w-[8ch] outline-none" value={trimEndTime} placeholder="0 sec" onChange={handleTrimInput} />
                </div>
            </div>}
          </div>
          <div className="flex gap-3">
              <EditOptionButton onClick={onCropButtonClick} isActive={isCropActive}>
                <IconCrop />
                Crop
              </EditOptionButton>
            {isCropActive && <CropOptions onOptionClick={handleAspectRatioChange} aspectRatio={aspectRatio}  />}
          </div>
        </div>
        <div className="reset-save-options flex">
          <EditOptionButton onClick={resetOptions}>
            <IconReset />
            Reset
          </EditOptionButton>
          <Save onClick={sendProcessRequest} isActive={isSaveAllowed} />
        </div>
      </VideoControlsWrapper >
    </>
  );
};

export default VideoControlButtons;
