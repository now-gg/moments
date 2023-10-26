import axios from 'axios';
import { useState } from "react";
import styled from "styled-components";

type ControlProps = {
  startTime: number,
  endTime: number | undefined,
  setStartTime: Function,
  setEndTime: Function,
  duration: number
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

const VideoControlButtons = ({ startTime, endTime, setStartTime, setEndTime, duration }: ControlProps) => {

  const [cropSelectedValue, setCropSelectedValue] = useState('');
  const [saveBtnActive, setSaveBtnActive] = useState('disabled');

  const showAspectWrapper = (e: any) => {
    const cropOptionElement = e.target;
    document.querySelector('.input-crop.selected')?.classList.remove('selected');
    cropOptionElement.classList.add('selected');
    const cropOption = cropOptionElement.getAttribute('data-option');
    document.querySelector('.crop-wrapper-video')?.classList.remove('hide');
    if (cropOption != '') {
      document.querySelector('.crop-wrapper-video')?.setAttribute('style', `aspect-ratio:${cropOption};background:url(https://cms-cdn.now.gg/cms-media/2023/10/${cropOption.replace('/', '')}-grid-lines.png), rgba(255,255,255,.2) no-repeat center  / cover; background-repeat:no-repeat;background-size:cover;`);
      setCropSelectedValue(cropOption);
    } else {
      document.querySelector('.crop-wrapper-video')?.setAttribute('style', ``);
      document.querySelector('.crop-wrapper-video')?.classList.add('hide');
      setCropSelectedValue('');
    }
  }

  const handleChange = (e: any) => {
    const inputClass = e.target.classList.contains('start-time') ? 'start' : 'end';
    console.log('e.target', e.target);
    if (inputClass == 'start') {
      setStartTime(e.target.value);
    } else {
      setEndTime(e.target.value);
    }
  }

  const toggleOptions = async (e: any) => {
    const toggleButton = e.target;
    toggleButton.closest('.action-buttons').querySelector('.options-wrapper').classList.toggle('hide');
    setSaveBtnActive('');
    console.log('toggleButton', toggleButton.classList);
    // if (toggleButton.classList.contains('crop-btn') && cropSelectedValue != '') {
    //   setSelectedOption('cropAPI');
    // } else {
    //   if (toggleButton.classList.contains('trim-btn') && endTime && endTime != 0) {
    //     setSelectedOption('trimAPI');
    //     setSaveBtnActive('');
    //   }
    // }
  }

  const sendAPIRequest = async () => {
    if (saveBtnActive == '' && (cropSelectedValue != '' || endTime && endTime != 0)) {
      if (cropSelectedValue != '') {
        let searchParams = new URLSearchParams(location.search);
        let payload = {
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
        await axios
          .post(`https://api-moments.testngg.net`, payload, {
            headers: {
              'Content-Type': 'application/json',
              token: `${localStorage['ng_token']}`,
            },
          })
          .then(function (res: any) {
            if (res && res.status === 200) {
              console.log('res', res);
            }
          })
          .catch((err: any) => {
            console.log('err', err);
            // console.log('signup not possible -- error 401');
          });
      } else {
        let searchParams = new URLSearchParams(location.search);
        let payload = {
          "title": document.querySelector('.video-title')?.innerHTML.trim(),
          "videoId": searchParams.get('videoId') || 'rhjij8mlboksww',
          "trim": { "start": startTime, "end": endTime },
        }
        // setStartTime('');
        // setEndTime('');
        console.log('payload', payload);
        await axios
          .post(`https://api-moments.testngg.net`, payload, {
            headers: {
              'Content-Type': 'application/json',
              token: `${localStorage['ng_token']}`,
            },
          })
          .then(function (res: any) {
            if (res && res.status === 200) {
              // localStorage.setItem('ng_token', res.token);
              console.log('res', res);
            }
          })
          .catch((err: any) => {
            console.log('err', err);
            // console.log('signup not possible -- error 401');
          });
      }
    }
  }
  return (
    <VideoControlsWrapper className="flex">
      <div className="play-trim-crop-options flex">
        <button className="play-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#FAFAFB" />
            <path d="M28.25 17.567C28.5833 17.7594 28.5833 18.2406 28.25 18.433L13.25 27.0933C12.9167 27.2857 12.5 27.0452 12.5 26.6603L12.5 9.33975C12.5 8.95485 12.9167 8.71428 13.25 8.90673L28.25 17.567Z" fill="#FF42A5" stroke="white" />
          </svg>
        </button>
        <div className="trim-action flex action-buttons">
          <button className="trim-btn flex" onClick={(e) => { toggleOptions(e) }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6219 11.1515C14.4962 11.4617 14.1428 11.6112 13.8326 11.4855L8.09396 9.1483L5.5738 10.17C6.30567 10.6591 6.78767 11.4928 6.78767 12.4391C6.78767 13.9453 5.56659 15.1663 4.06042 15.1663C2.55419 15.1663 1.33317 13.9453 1.33317 12.4391C1.33317 11.4935 1.81438 10.6603 2.54528 10.1711C2.68892 10.075 2.84219 9.99211 3.00334 9.92429L6.50131 8.4997L3.00334 7.07508C2.84219 7.00725 2.68892 6.92438 2.54528 6.82823C1.81438 6.33898 1.33317 5.50581 1.33317 4.56024C1.33317 3.05403 2.55419 1.83301 4.06042 1.83301C5.56659 1.83301 6.78767 3.05403 6.78767 4.56024C6.78767 5.50656 6.30567 6.3403 5.5738 6.82939L8.09396 7.85105L13.8326 5.5139C14.1428 5.38814 14.4962 5.53765 14.6219 5.84785C14.7477 6.15804 14.5982 6.51145 14.288 6.6372L9.69386 8.4997L14.288 10.3622C14.5982 10.4879 14.7477 10.8413 14.6219 11.1515ZM4.06042 3.04511C4.8972 3.04511 5.57556 3.72346 5.57556 4.56024C5.57556 5.39703 4.8972 6.07537 4.06042 6.07537C3.22358 6.07537 2.54528 5.39703 2.54528 4.56024C2.54528 3.72346 3.22358 3.04511 4.06042 3.04511ZM4.06042 13.9542C4.8972 13.9542 5.57556 13.2759 5.57556 12.4391C5.57556 11.6023 4.8972 10.924 4.06042 10.924C3.22358 10.924 2.54528 11.6023 2.54528 12.4391C2.54528 13.2759 3.22358 13.9542 4.06042 13.9542Z" fill="#FF42A5" />
            </svg>
            Trim
          </button>
          <div className="trim-options flex options-wrapper hide">
            <div className="padding-wrapper flex">
              <span className="span-time flex">
                Start Time
                <input className="start-time input-time" placeholder="0 sec" type="number" onChange={(e) => { handleChange(e) }} />
              </span>
              <span className="span-time flex">
                End Time
                <input className="end-time input-time" placeholder={`${duration} sec`} type="number" onChange={(e) => { handleChange(e) }} />
              </span>
            </div>
          </div>
        </div>
        <div className="crop-action flex action-buttons">
          <button className="crop-btn flex" onClick={(e) => { toggleOptions(e) }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <g clip-path="url(#clip0_176_25447)">
                <path d="M3.33333 1.5V13.1667H15M1 3.83333H12.6667V15.5" stroke="#FF42A5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_176_25447">
                  <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                </clipPath>
              </defs>
            </svg>
            Crop
          </button>
          <div className="crop-options flex options-wrapper hide">
            <div className="padding-wrapper flex">
              <span className="input-crop" data-option="" onClick={(e) => { showAspectWrapper(e) }}>Original</span>
              <span className="input-crop" data-option="1/1" onClick={(e) => { showAspectWrapper(e) }}>1:1</span>
              <span className="input-crop" data-option="9/16" onClick={(e) => { showAspectWrapper(e) }}>9:16</span>
              <span className="input-crop" data-option="3/4" onClick={(e) => { showAspectWrapper(e) }}>3:4</span>
              <span className="input-crop" data-option="4/3" onClick={(e) => { showAspectWrapper(e) }}>4:3</span>
            </div>
          </div>
        </div>
      </div>
      <div className="reset-save-options flex">
        <button className={`reset-btn flex`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00173 6V2C6.00173 1.72386 5.77788 1.5 5.50173 1.5H1.50173C1.22559 1.5 1.00173 1.72386 1.00173 2C1.00173 2.27614 1.22559 2.5 1.50173 2.5H4.39622C2.89613 3.40123 1.7291 4.86389 1.24026 6.68829C0.239664 10.4226 2.45574 14.2609 6.19 15.2615C9.92427 16.2621 13.7626 14.046 14.7632 10.3118C15.7638 6.5775 13.5477 2.73914 9.81347 1.73855C9.54674 1.66707 9.27257 1.82537 9.2011 2.0921C9.12963 2.35883 9.28792 2.633 9.55465 2.70447C12.7554 3.56212 14.6549 6.85214 13.7973 10.0529C12.9396 13.2537 9.64962 15.1532 6.44882 14.2956C3.24803 13.4379 1.34853 10.1479 2.20618 6.94711C2.62935 5.36782 3.64383 4.10597 4.94884 3.33477C4.96746 3.32377 4.9851 3.31175 5.00173 3.29883V6C5.00173 6.27614 5.22559 6.5 5.50173 6.5C5.77788 6.5 6.00173 6.27614 6.00173 6ZM5.00173 2.5097V2.5H4.98884C4.99318 2.50316 4.99748 2.5064 5.00173 2.5097Z" fill="#FF42A5" />
          </svg>
          Reset
        </button>
        <button className={`save-btn flex ${saveBtnActive}`} onClick={sendAPIRequest}>
          Save
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.64645 5.64645C3.84171 5.45118 4.15829 5.45118 4.35355 5.64645L8 9.29289L11.6464 5.64645C11.8417 5.45118 12.1583 5.45118 12.3536 5.64645C12.5488 5.84171 12.5488 6.15829 12.3536 6.35355L8.35355 10.3536C8.15829 10.5488 7.84171 10.5488 7.64645 10.3536L3.64645 6.35355C3.45118 6.15829 3.45118 5.84171 3.64645 5.64645Z" fill="white" fill-opacity="0.5" />
          </svg>
        </button>
      </div>
    </VideoControlsWrapper >
  );
};

export default VideoControlButtons;
