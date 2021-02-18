import React from "react";
import { LinearGradient, RadialGradient, Stop } from "react-native-svg";

export interface linearProps {
  data: number;
}

export const KcalLinearGradient: React.FC<linearProps> = ({ data }) => {
  let stopElement: Array<JSX.Element> = [
    <Stop key={"green"} offset="0.5" stopColor={"#08D2B4"} />
  ];
  if (data > 0.65) {
    stopElement.push(
      <Stop
        key={"purple"}
        offset="0.7"
        stopOpacity="0.9"
        stopColor={"#4F58DF"}
      />
    );
  }
  return (
    <LinearGradient
      id="kcalLinearGradient"
      key={"kcalLinearGradient"}
      x1={0}
      y1={0}
      x2={0}
      y2={1}
      gradientTransform="rotate(110) translate(0 30)"
    >
      {stopElement.map((stopElement, i) => {
        return stopElement;
      })}
    </LinearGradient>
  );
};
