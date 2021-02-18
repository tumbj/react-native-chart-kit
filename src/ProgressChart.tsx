import Pie from "paths-js/pie";
import React from "react";
import { View, ViewStyle } from "react-native";
import {
  Circle,
  Defs,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";

import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "./AbstractChart";

export type ProgressChartData =
  | Array<number>
  | {
      labels?: Array<string>;
      colors?: Array<string>;
      gradientColors?: Array<Element>;
      data: Array<number>;
      goalPointData?: Array<number>;
      goalPointColors?: Array<string>;
    };

export interface ProgressChartProps extends AbstractChartProps {
  data: ProgressChartData;
  width: number;
  height: number;
  accessor: string;
  backgroundColor: string;
  paddingLeft: string;
  center?: Array<number>;
  absolute?: boolean;
  hasLegend?: boolean;
  style?: Partial<ViewStyle>;
  chartConfig?: AbstractChartConfig;
  hideLegend?: boolean;
  strokeWidth?: number;
  radius?: number;
  withCustomBarColorFromData?: boolean;
  withCustomColorGoalPoint?: boolean;
  /**
   * show shadow of pie data - default: false.
   */
  isShowPieShadow?: boolean;
  /**
   * ring will rotation when data more than 1.0  - default: false.
   */
  isShouldRotation?: boolean;
}

type ProgressChartState = {};

class ProgressChart extends AbstractChart<
  ProgressChartProps,
  ProgressChartState
> {
  public static defaultProps = { style: {}, strokeWidth: 16, radius: 32 };

  render() {
    let {
      width,
      height,
      style,
      data,
      hideLegend,
      strokeWidth,
      radius,
      isShowPieShadow = false,
      isShouldRotation = false
    } = this.props;

    const { borderRadius = 0, margin = 0, marginRight = 0 } = style;

    if (Array.isArray(data)) {
      data = {
        data
      };
    }

    const calCentroid = (spotData: number, i: number) => {
      const r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      let doubleSpotData: number = spotData * 2;
      let isLeftZone: boolean = false;
      if (doubleSpotData > 1.0) {
        doubleSpotData -= 1;
        isLeftZone = true;
      }
      return {
        centroid: Pie({
          r,
          R: r,
          center: [0, 0],
          data: [doubleSpotData, 1 - doubleSpotData],
          accessor(x: string) {
            return x;
          }
        }).curves[isLeftZone ? 1 : 0].sector.centroid
      };
    };

    const goalPoints = data.goalPointData?.map((goalData, i) => {
      return calCentroid(goalData, i);
    });
    const shadowPoints = data.data?.map((shadowData, i) => {
      return calCentroid(shadowData, i);
    });
    const pies = data.data.map((pieData, i) => {
      const r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      let limitData = pieData;
      if (pieData > 1.0) {
        limitData = 1.0;
      }
      return Pie({
        r,
        R: r,
        center: [0, 0],
        data: [limitData, 1 - limitData],
        accessor(x: string) {
          return x;
        }
      });
    });

    const pieBackgrounds = data.data.map((_, i) => {
      const r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      return Pie({
        r,
        R: r,
        center: [0, 0],
        data: [0.999, 0.001],
        accessor(x: string) {
          return x;
        }
      });
    });

    const withLabel = (i: number) =>
      (data as any).labels && (data as any).labels[i];

    const withColor = (i: number) =>
      (data as any).colors && (data as any).colors[i];

    const withGoalPointColor = (i: number) =>
      (data as any).goalPointColors && (data as any).goalPointColors[i];

    const withData = (i: number) => (data as any).data && (data as any).data[i];

    const legend = !hideLegend && (
      <>
        <G>
          {pies.map((_, i) => {
            return (
              <Rect
                key={Math.random()}
                width="16px"
                height="16px"
                fill={this.props.chartConfig.color(0.2 * (i + 1), i)}
                rx={8}
                ry={8}
                x={this.props.width / 2.5 - 24}
                y={
                  -(this.props.height / 2.5) +
                  ((this.props.height * 0.8) /
                    (Array.isArray(data) ? data.length : data.data.length)) *
                    i +
                  12
                }
              />
            );
          })}
        </G>
        <G>
          {pies.map((_, i) => {
            return (
              <Text
                key={Math.random()}
                x={this.props.width / 2.5}
                y={
                  -(this.props.height / 2.5) +
                  ((this.props.height * 0.8) /
                    (Array.isArray(data) ? data.length : data.data.length)) *
                    i +
                  12 * 2
                }
                {...this.getPropsForLabels()}
              >
                {withLabel(i)
                  ? `${(data as any).labels[i]} ${Math.round(
                      100 * (data as any).data[i]
                    )}%`
                  : `${Math.round(100 * (data as any).data[i])}%`}
              </Text>
            );
          })}
        </G>
      </>
    );
    const calDegree = (fraction: number) => {
      return fraction * 360;
    };
    const defaultShadowRotation = 90;
    const circuleCircumference = 2 * Math.PI * (strokeWidth / 2);
    const pieShadow = (fraction: number, xAxis: number, yAxis: number) => {
      return (
        <G
          rotation={calDegree(fraction) - defaultShadowRotation}
          originX={xAxis}
          originY={yAxis}
        >
          <Circle
            cx={xAxis}
            cy={yAxis}
            r={strokeWidth / 2}
            stroke="url(#shadowChart)"
            strokeDasharray={circuleCircumference}
            strokeDashoffset={circuleCircumference / 2}
          />
        </G>
      );
    };
    return (
      <View
        style={{
          width,
          height,
          padding: 0,
          ...style
        }}
      >
        <Svg
          width={width - (margin as number) * 2 - (marginRight as number)}
          height={height}
          fill="none"
        >
          {this.renderDefs({
            width: this.props.height,
            height: this.props.height,
            ...this.props.chartConfig
          })}
          <Defs>
            {data.gradientColors}
            <RadialGradient
              id="shadowChart"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="rotate(90 0 110) scale(110)"
            >
              <Stop stopColor="transparent" stopOpacity={0} />
              <Stop offset={1} stopColor="#000000" stopOpacity={0.7} />
            </RadialGradient>
          </Defs>
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G
            x={this.props.width / (hideLegend ? 2 : 2.5)}
            y={this.props.height / 2}
          >
            <G>
              {pieBackgrounds.map((pie, i) => {
                return (
                  <Path
                    key={Math.random()}
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={strokeWidth}
                    stroke={this.props.chartConfig.color(0.2, i)}
                  />
                );
              })}
            </G>
            <G>
              {pies.map((pie, i) => {
                const pieData = withData(i);
                const RingDegree =
                  isShouldRotation && pieData > 1.0
                    ? calDegree(pieData % 1)
                    : 0;
                return (
                  <G key={`pie-data-id${i}`}>
                    <G rotation={RingDegree}>
                      <Path
                        key={Math.random()}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={pie.curves[0].sector.path.print()}
                        strokeWidth={strokeWidth}
                        stroke={
                          this.props.withCustomBarColorFromData
                            ? withColor(i)
                            : this.props.chartConfig.color(
                                (i / pies.length) * 0.5 + 0.5,
                                i
                              )
                        }
                      />
                    </G>
                    {isShowPieShadow &&
                      pieShadow(
                        pieData % 1,
                        shadowPoints[i].centroid[0],
                        shadowPoints[i].centroid[1]
                      )}
                  </G>
                );
              })}
            </G>
            <G>
              {goalPoints &&
                goalPoints.map((goal, i) => {
                  return (
                    <Circle
                      key={Math.random()}
                      cx={goal.centroid[0]}
                      cy={goal.centroid[1]}
                      r={strokeWidth / 2}
                      fill={
                        this.props.withCustomColorGoalPoint
                          ? withGoalPointColor(i)
                          : this.props.chartConfig.color(
                              (i / pies.length) * 0.5 + 0.5,
                              i
                            )
                      }
                    />
                  );
                })}
            </G>
            {legend}
          </G>
        </Svg>
      </View>
    );
  }
}

export default ProgressChart;
