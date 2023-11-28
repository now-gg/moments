import React from 'react'
import { styled } from 'styled-components'

const CropWrapper = styled.div`
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
  }`

const CropWidget = () => {
  return (
    <CropWrapper >
      <div className="crop-wrapper-video hide">
          <div className="svg-arrow-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-1 top left">
              <path d="M40 2H4C2.89543 2 2 2.90281 2 4.00738C2 19.497 2 23.5073 2 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="4" viewBox="0 0 42 4" fill="none" className="svg-2 top">
              <path d="M40 2H2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="4" viewBox="0 0 42 4" fill="none" className="svg-3 bottom">
              <path d="M40 2H2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-4 right top">
              <path d="M40 40L40 4C40 2.89543 39.0972 2 37.9926 2C22.503 2 18.4927 2 2 2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-5 left bottom">
              <path d="M2 2L2 38C2 39.1046 2.90281 40 4.00738 40C19.497 40 23.5073 40 40 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="42" viewBox="0 0 4 42" fill="none" className="svg-6 left">
              <path d="M2 2L2 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="42" viewBox="0 0 4 42" fill="none" className="svg-7 right">
              <path d="M2 2L2 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-8 bottom right">
              <path d="M2 40L38 40C39.1046 40 40 39.0972 40 37.9926C40 22.503 40 18.4927 40 2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          </div>
      </div>
    </CropWrapper>
  )
}

export default CropWidget