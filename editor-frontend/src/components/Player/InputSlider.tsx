import React, { useState } from "react";
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";
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
      margin: 0;
      .ruler-rule{
        padding: 2px 0;
        .ruler-sub-rule{
          padding: 1px 0;
          margin-bottom: -14px;
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
const InputSlider = ({ min, max }) => {

  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const getTimeLabels = (): string[] => {
    let arr: string[] = [];
    for (let i = 0; i <= max; i++) {
      arr.push(i.toString().padStart(2, "0") + ":00");
    }
    return arr;
  };
  return (
    <InputSliderWrapper className="stuff">
      <MultiRangeSlider
        baseClassName="multi-range-slider-black"
        min={0}
        max={4}
        step={1}
        minValue={minValue}
        maxValue={maxValue}
        ruler={true}
        // label={true}
        labels={getTimeLabels()}
        subSteps={true}
        onInput={(e: ChangeResult) => {
          setMinValue(e.minValue);
          setMaxValue(e.maxValue);
        }}
      ></MultiRangeSlider>
    </InputSliderWrapper>
  )
}

export default InputSlider;