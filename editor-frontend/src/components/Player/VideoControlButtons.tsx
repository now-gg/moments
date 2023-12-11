import React, { ReactEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import VideoTimeline from './VideoTimeline';
import { IconCrop, IconPause, IconPlay, IconTrim, IconReset } from '../../assets/icons';
import EditOptionButton from './EditOptionButton';
import CropOptions from './CropOptions';
import Divider from '../Divider';
import Save from "./Save";
import { toast } from "react-hot-toast";

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
  playPointer: number,
  aspectRatio: string,
  setAspectRatio: Function,
  thumbnails: string[],
  isCropActive: boolean,
  setIsCropActive: Function,
  videoInfo: any,
  left: number,
  top: number,
  title: string,
  setVideoInfo: React.Dispatch<React.SetStateAction<any>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
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

const VideoControlButtons = ({ videoUrl, startTime, endTime, setStartTime, setEndTime, duration, playing, streamRef, playPointer, aspectRatio, setAspectRatio, thumbnails, isCropActive, setIsCropActive, videoInfo, left, top, title, setVideoInfo, setTitle }: ControlProps) => {


  const [trimStartTime, setTrimStartTime] = useState(startTime || 0);
  const [trimEndTime, setTrimEndTime] = useState(endTime || duration);
  const [isTrimActive, setIsTrimActive] = useState(false);
  const [showEditingOverlay, setShowEditingOverlay] = useState(false);

  useEffect(() => {
    setTrimStartTime(startTime);
  }, [startTime]);

  useEffect(() => {
    setTrimEndTime(endTime);
  }, [endTime]);

  const validateTrimTimes = (start: any, end: any) => {
    const res = {
      "status": false,
      "message": ""
    }
    if(start === "" || end === ""){
      res.message = "Trim start and end times cannot be empty";
      return res;
    }
    if (isNaN(start) || isNaN(end)) {
      res.message = "Trim start and end times must be numbers";
      return res;
    }
    const startNum = Number(start);
    const endNum = Number(end);
    if (startNum < 0 || endNum > duration || startNum >= endNum) {
        res.message = "Invalid trim values";
        return res;
    }
    if(startNum === 0 && endNum === duration){
      return res;
    }
    res.status = true;
    return res;
  }

  const onSaveButtonClick = async () => {
    console.log("sendAPIRequest")

    const headers = {
      'Content-Type': 'application/json',
      token: `${localStorage['ng_token']}`,
    }

    const payload:any = {
      "videoId": videoInfo.videoId,
    }

    if(title !== videoInfo.title)
      payload["title"] = title;

    if (isTrimActive) {
      const trimValidation = validateTrimTimes(trimStartTime, trimEndTime);
      if(trimValidation.status) {
        payload["trim"] = {
          start: Math.floor(trimStartTime),
          end: Math.floor(trimEndTime)
        }
      }
      else if(trimValidation.message) 
        toast.error(trimValidation.message);
    }

    if (isCropActive) {
      const cropper = document.querySelector(".draggable");
      console.log(cropper)
      if(!cropper) return;
      payload["crop"] = {
        x1: Math.floor(left),
        y1: Math.floor(top),
        x2: Math.floor(left + cropper.clientWidth),
        y2: Math.floor(top + cropper.clientHeight),
      }
    }

    if(payload["trim"] || payload["crop"]) {
      payload["title"] = title;
      const loadingToast = toast.loading("editing video");
      setShowEditingOverlay(true);
      fetch(`${import.meta.env.VITE_BACKEND_HOST}/video/process`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      })
      .then(response => { 
        if(response.status === 401) {
          localStorage.removeItem('ng_token');
          toast.remove(loadingToast);
          toast.error("Unauthorized. Please login again.");
          setShowEditingOverlay(false);
        }
        else if(response.status >= 400) {
          toast.remove(loadingToast);
          toast.error("Error while editing video");
          setShowEditingOverlay(false);
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        const newVideoId = data.new_video_id;
        let t = 0;
        const timer = setInterval(() => {
          if(t > 180) {
            clearInterval(timer);
            toast.remove(loadingToast);
            toast.error("Error while editing video");
            setShowEditingOverlay(false);
            return;
          }
          const videoStatusCheckUrl = `${import.meta.env.VITE_BACKEND_HOST}/video/status`;
          const statusPayload = {
            "oldVideoId": videoInfo.videoId,
            "newVideoId": newVideoId
          }
          fetch(videoStatusCheckUrl, {
            method: 'POST',
            body: JSON.stringify(statusPayload)
          })
          .then(response => {
            console.log(response)
            return response.json()
          })
          .then(data => {
            console.log(data)
            if(data.status === "success") {
              clearInterval(timer);
              toast.remove(loadingToast);
              toast.success("Video edited successfully");
              const currentPageUrl = window.location.href;
              const newUrl = currentPageUrl.replace(videoInfo.videoId, newVideoId);
              setTimeout(() => {
                window.location.href = newUrl;
              }, 3*1000);
            }
            else if(data.status === "failed") {
              clearInterval(timer);
              toast.remove(loadingToast);
              toast.error("Error while editing video");
              setShowEditingOverlay(false);
            }
          })
          .catch(error => {
            console.error(error)
          })
          t = t + 30;
        }, 30*1000)
      })
      .catch((error) => {
        toast.remove(loadingToast);
        toast.error("Error adding video to queue");
        console.error('Error:', error);
        setShowEditingOverlay(false);
      });
    }
    else if(payload["title"]) {
      const loadingToast = toast.loading("updating title");
      fetch(`${import.meta.env.VITE_BACKEND_HOST}/video/title`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      })
      .then(response => { 
        toast.remove(loadingToast);
        if(response.status === 200) {
          toast.success("Title Updated");
          setVideoInfo({...videoInfo, title: title});
        }
        else if(response.status === 401) {
          localStorage.removeItem('ng_token');
          toast.error("Unauthorized. Please login again.");
        }
        else {
          toast.error("Error while updating title");
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
      })
      .catch((error) => {
        toast.error("Error while updating title");
        console.error('Error:', error);
      });
    }
  }

  const onTrimButtonClick: ReactEventHandler = () => { 
    setIsTrimActive(!isTrimActive);
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
    setTitle(videoInfo.title);
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

  const isSaveAllowed = isCropActive || isTrimActive || title !== videoInfo.title;

  return (
    <>
    {showEditingOverlay && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[1000] flex justify-center items-center"></div>}
      <VideoTimeline isTrimActive={isTrimActive} setIsTrimActive={setIsTrimActive} url={videoUrl} setStartTime={setStartTime} setEndTime={setEndTime} startTime={startTime} endTime={endTime} duration={duration} playPointer={playPointer} thumbnails={thumbnails} />
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
                  <input 
                    className="bg-white appearance-none py-1.5 px-3 rounded-md text-sm text-black placeholder:text-base-100 max-w-[8ch] outline-none"
                    value={trimStartTime} 
                    placeholder="0 sec" 
                    onChange={(e) => setTrimStartTime(e.target.value)} 
                  />
                </div>
                <div className='flex justify-center items-center gap-1'>
                  <span className="text-xs text-white">End Time</span>
                  <input 
                    className="bg-white appearance-none py-1.5 px-3 rounded-md text-sm text-black  placeholder:text-base-100 max-w-[8ch] outline-none" 
                    value={trimEndTime}
                    placeholder={`${duration} sec`} 
                    onChange={(e) => setTrimEndTime(e.target.value)} />
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
          <Save onClick={onSaveButtonClick} isActive={isSaveAllowed} />
        </div>
      </VideoControlsWrapper >
    </>
  );
};

export default VideoControlButtons;
