import axios from 'axios';
import { ReactEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import VideoTimeline from './VideoTimeline';
import CropOptionButton from './CropOptionButton';
import { IconCrop, IconTrim } from '../../assets/icons';
import EditOptionButton from './EditOptionButton';
import { IconReset } from '../../assets/icons/IConReset';
import CropOptions from './CropOptions';

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

const VideoControlButtons = ({ videoUrl, startTime, endTime, setStartTime, setEndTime, duration, setVideoID, loggedIn, playing, streamRef, palyPointer, aspectRatio, setAspectRatio }: ControlProps) => {

  const [cropSelectedValue, setCropSelectedValue] = useState('16/9');
  const [saveBtnActive, setSaveBtnActive] = useState('disabled');

  const [trimStartTime, setTrimStartTime] = useState(startTime || 0);
  const [trimEndTime, setTrimEndTime] = useState(endTime || 0);

  const [isTrimActive, setIsTrimActive] = useState(false);
  const [isCropActive, setIsCropActive] = useState(false);

  // useEffect(()=>{
  //   console.log("useEffect")
  // }[startTime])

  useEffect(() => {
    console.log("startTime", startTime);

    setTrimStartTime(startTime);
  }, [startTime]);

  useEffect(() => {
    console.log("endTime", endTime);

    
    setTrimEndTime(endTime);
    console.log(streamRef)
  }, [endTime]);

  const handleAspectRatioChange = (cropRatio: string) => {
    setAspectRatio(cropRatio);
  }

  const sendAPIRequest = async () => {
    if (cropSelectedValue == '' && endTime && endTime > duration) {
      document.querySelector('input.end-time')?.classList.add('error-input');
      return;
    }
    if (saveBtnActive == '' && (cropSelectedValue != '' || endTime && endTime != 0)) {
      let searchParams = new URLSearchParams(location.search);
      let payload = {};
      if (cropSelectedValue != '' && endTime != 0) {
        payload = {
          "title": document.querySelector('.video-title')?.innerHTML.trim(),
          "videoId": searchParams.get('videoId') || 'rhjij8mlboksww',
          "trim": { "start": startTime, "end": endTime },
          "crop": {
            "x1": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().left,
            "y1": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().top,
            "x2": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().right,
            "y2": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().bottom
          }
        }
      } else if (cropSelectedValue != '') {
        payload = {
          "title": document.querySelector('.video-title')?.innerHTML.trim(),
          "videoId": searchParams.get('videoId') || 'rhjij8mlboksww',
          "crop": {
            "x1": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().left,
            "y1": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().top,
            "x2": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().right,
            "y2": document.querySelector('.crop-wrapper-video')?.getBoundingClientRect().bottom
          }
        }
        console.log('payload', payload);
      } else {
        payload = {
          "title": document.querySelector('.video-title')?.innerHTML.trim(),
          "videoId": searchParams.get('videoId') || 'rhjij8mlboksww',
          "trim": { "start": startTime, "end": endTime },
        }
        // setStartTime('');
        // setEndTime('');
        console.log('payload', payload);
      }

      if (payload && Object.keys(payload).length > 0) {
        await axios
          .post(`${import.meta.env.VITE_VIDEO_PROCESS}/video/process`, payload, {
            headers: {
              'Content-Type': 'application/json',
              token: `${localStorage['ng_token']}`,
            },
          })
          .then(function (res: any) {
            if (res && res.status === 200) {
              // localStorage.setItem('ng_token', res.token);
              console.log('res', res);
              setVideoID('');
            }
          })
          .catch((err: any) => {
            console.log('err', err);
            // console.log('signup not possible -- error 401');
          });
      }
    }
  }

  const onTrimButtonClick: ReactEventHandler = () => { 
    setIsTrimActive(!isTrimActive);
    setIsCropActive(false);
    if (loggedIn) setSaveBtnActive('');
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
    setIsTrimActive(false);
    setIsCropActive(!isCropActive);
    if (loggedIn) setSaveBtnActive('');
  }

  return (
    <>
      <section className="relative bg-color timeline-wrapper">
        <VideoTimeline url={videoUrl} setStartTime={setStartTime} setEndTime={setEndTime} startTime={startTime} endTime={endTime} duration={duration} palyPointer={palyPointer} />
      </section>
      <VideoControlsWrapper className="flex">
        <div className="play-trim-crop-options flex">
          <button className="play-btn ">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" className={`${playing ? 'hide' : ''}`} onClick={() => { streamRef.current.play(); }}>
              <rect width="36" height="36" rx="8" fill="#FAFAFB" />
              <path d="M28.25 17.567C28.5833 17.7594 28.5833 18.2406 28.25 18.433L13.25 27.0933C12.9167 27.2857 12.5 27.0452 12.5 26.6603L12.5 9.33975C12.5 8.95485 12.9167 8.71428 13.25 8.90673L28.25 17.567Z" fill="#FF42A5" stroke="white" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="36" height="36" viewBox="0 0 36 36" fill="none" className={`${playing ? '' : 'hide'}`} onClick={() => { streamRef.current.pause(); }}>
              <rect width="36" height="36" rx="8" fill="#FAFAFB" />
              <g transform='translate(6, 6)'>
                <path fill="#fe42a4" d="M 2.5,2.5 C 4.83333,2.5 7.16667,2.5 9.5,2.5C 9.5,8.5 9.5,14.5 9.5,20.5C 7.16667,20.5 4.83333,20.5 2.5,20.5C 2.5,14.5 2.5,8.5 2.5,2.5 Z" />
                <path fill="#fe42a4" d="M 13.5,2.5 C 15.8333,2.5 18.1667,2.5 20.5,2.5C 20.5,8.5 20.5,14.5 20.5,20.5C 18.1667,20.5 15.8333,20.5 13.5,20.5C 13.5,14.5 13.5,8.5 13.5,2.5 Z" />
              </g>
            </svg>
          </button>
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
          <EditOptionButton onClick={() => {}}>
            <IconReset />
            Reset
          </EditOptionButton>
          <button className={`save-btn flex ${saveBtnActive}`} onClick={sendAPIRequest}>
            Save
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.64645 5.64645C3.84171 5.45118 4.15829 5.45118 4.35355 5.64645L8 9.29289L11.6464 5.64645C11.8417 5.45118 12.1583 5.45118 12.3536 5.64645C12.5488 5.84171 12.5488 6.15829 12.3536 6.35355L8.35355 10.3536C8.15829 10.5488 7.84171 10.5488 7.64645 10.3536L3.64645 6.35355C3.45118 6.15829 3.45118 5.84171 3.64645 5.64645Z" fill="white" fillOpacity="0.5" />
            </svg>
          </button>
        </div>
      </VideoControlsWrapper >
    </>
  );
};

export default VideoControlButtons;
