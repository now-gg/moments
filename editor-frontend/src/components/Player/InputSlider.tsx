import MultiRangeSlider from "multi-range-slider-react";
import { useState } from "react";
import styled from "styled-components";
const InputSliderWrapper = styled.div`
  .multi-range-slider-black {
    padding: 0;
    background: transparent;
    border: none;
    .bar{
      margin-bottom: -5px;
    }
    .bar-left{
      padding: 1px 0;
    }
    .thumb{
      &::before{
        width: 7px;
        height: 50px;
        border: none;
        margin: 0;
        bottom: 0;
        border-radius: 0;
        box-shadow: none;
      }
      &.thumb-left{
        &::before{
          background: url(https://cms-cdn.now.gg/cms-media/2023/10/slider-left-label.png) no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
      &.thumb-right{
        &::before{
          background: url(https://cms-cdn.now.gg/cms-media/2023/10/slider-right-label.png) no-repeat;
          background-size: cover;
          background-position: center;
          right:1px;
        }
      }
    }
    .caption{
      display:none;
    }
    .bar-inner{
      background: #FF42A5;
      border: none;
      box-shadow: none;
    }
    .ruler{
      margin: -5px;
      .ruler-rule{
        padding: 3px 0;
        .ruler-sub-rule{
          padding: 3px 0px;
          margin-bottom: 1px;
          border-left: none
          border-bottom: none;
          .ruler-sub-rule{
            border-bottom: none;
          }
        }
      }
    }
    .labels{
      margin: 0;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 8px;
      .label{
        font-size: 60%;
      }
    }
  }

`

type SliderProps = {
  minVal: number;
  maxVal: number | undefined,
  duration: number | undefined,
  setStartTime: any,
  setEndTime: any,
};

const InputSlider = ({ minVal, maxVal, setStartTime, setEndTime, duration }: SliderProps) => {
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(100);
  const getTimeLabels = (): string[] => {
    let arr: string[] = [];
    if (duration) {
      for (let i = 0; i <= duration; i++) {
        arr.push(i.toString().padStart(2, "0") + ":00");
      }
    }
    return arr;
  };

  const handleInput = (e: any) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  }

  const handleChanges = (e: any) => {
   setStartTime(e.minValue || 0);
   setEndTime(e.maxValue || maxVal);
  }

  return (
     <InputSliderWrapper className="stuff">
      <MultiRangeSlider
        baseClassName="multi-range-slider-black"
        min={0}
        max={duration}
        step={1}
        minValue={minVal}
        maxValue={maxVal}
        ruler={true}
        // label={true}
        labels={getTimeLabels()}
        subSteps={true}
        onInput={(e: any) => {
          handleInput(e);
        }}
        onChange={(e: any) => {
          handleChanges(e);
        }
        }
      ></MultiRangeSlider>
    </InputSliderWrapper>
  )
}

export default InputSlider;