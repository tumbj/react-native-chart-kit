import React from "react";
import { View, ViewStyle } from "react-native";
import {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";

import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "../AbstractChart";

import { GanttData } from ".";

export interface GanttChartProps extends AbstractChartProps {
  data: [GanttData];
  width: number;
  height: number;
  fromZero?: boolean;
  withHorizontalInnerLines?: boolean;
  withVerticalInnerLines?: boolean;
  withAxesLines?: boolean;
  yAxisLabel: string;
  yAxisSuffix: string;
  chartConfig: AbstractChartConfig;
  style?: Partial<ViewStyle>;
  horizontalLabelRotation?: number;
  verticalLabelRotation?: number;
  /**
   * Show vertical labels - default: True.
   */
  withVerticalLabels?: boolean;
  /**
   * Show horizontal labels - default: True.
   */
  withHorizontalLabels?: boolean;
  withCustomBarColorFromData?: boolean;
  flatColor?: boolean;
  dateFormatter?: (date: Date) => string;
  barRoundedCap?: boolean;
  setScale?: number;
  setTimeLabelNumber?: string;
}

type GanttChartState = {};

class GanttChart extends AbstractChart<GanttChartProps, GanttChartState> {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  calcBarSize = (barCount: number, length: number, defaultBarSize = 32) => {
    const gap = Math.floor(length / barCount) - defaultBarSize;
    return Math.max(
      Math.min(gap / defaultBarSize, 1) *
        defaultBarSize *
        this.getBarPercentage(),
      10
    );
  };

  timeDifference = (
    labelNumber: string,
    lowwerBoundary: number,
    secPerHour: number
  ): number => {
    switch (labelNumber) {
      case "even":
        return (new Date(lowwerBoundary * 1000).getHours() % 2) * secPerHour;
      case "odd":
        return (new Date(lowwerBoundary * 1000).getHours() % 3) * secPerHour;
      default:
        return 0;
    }
  };

  calcTimeBoundary = (): [Date, Date, number, number] => {
    const data = this.props.data
      .flatMap(data => data.periods)
      .flatMap(period => [period[0], period[1]])
      .map(date => date.valueOf());

    const secPerHour = 3600;

    if (data.length === 0) {
      return [new Date(), new Date(), secPerHour, 0];
    }

    const startTime = Math.min(...data);
    const endTime = Math.max(...data);
    const duration = (endTime - startTime) / 1000;

    const numberOfHour = duration / secPerHour;

    const timeScales = [
      [24, 12] /** [hour, multiplier] */,
      [12, 6],
      [6, 3],
      [3, 1],
      [1, 0.5],
      [0, 0.25]
    ];

    const scale =
      timeScales.find(([duration, _]) => {
        return numberOfHour > duration;
      }) || timeScales[1];
    const interval =
      (this.props.setScale ? this.props.setScale : scale[1]) * secPerHour;

    const lowwerBoundary = Math.floor(startTime / 1000 / interval) * interval;
    const timeDifference = this.timeDifference(
      this.props.setTimeLabelNumber
        ? this.props.setTimeLabelNumber.toLocaleLowerCase()
        : "",
      lowwerBoundary,
      secPerHour
    );
    const upperBoundary = Math.ceil(endTime / 1000 / interval) * interval;
    const count = Math.floor(
      Math.abs(upperBoundary - lowwerBoundary) / interval
    );
    return [
      new Date((lowwerBoundary - timeDifference) * 1000),
      new Date(upperBoundary * 1000),
      interval,
      count === Infinity || count === NaN ? 0 : count
    ];
  };

  getTimeLabels = () => {
    const [startTime, endTime, interval, count] = this.calcTimeBoundary();
    return new Array(count)
      .fill(startTime)
      .map(
        (_, index) => new Date(startTime.valueOf() + index * interval * 1000)
      )
      .map(date =>
        this.props.dateFormatter
          ? this.props.dateFormatter(date)
          : date.toLocaleString()
      );
  };

  renderBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    barRadius,
    barRoundedCap,
    withCustomBarColorFromData
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingTop" | "paddingRight" | "barRadius"
  > & {
    data: [number, number][][];
    barRoundedCap: boolean;
    withCustomBarColorFromData: boolean;
  }) => {
    const basePosition = height - height / 4;
    const barHeight = this.calcBarSize(data.length, height - paddingTop);
    const maxWidth = width - paddingRight;
    const [startTime, endTime] = this.calcTimeBoundary();
    const flattenData = [
      startTime.valueOf(),
      endTime.valueOf(),
      ...data.flatMap(value => value).flatMap(val => val)
    ];

    return data
      .map((periods, index) => {
        return periods.map(([startTime, endTime]) => {
          const x1 = this.calcHeight(startTime, flattenData, maxWidth);
          const x2 = this.calcHeight(endTime, flattenData, maxWidth);

          return (
            <Rect
              key={Math.random()}
              x={paddingRight + x1}
              y={
                paddingTop +
                (index * basePosition) / data.length -
                barHeight / 2
              }
              rx={barRoundedCap ? barHeight / 2 : barRadius}
              width={x2 - x1}
              height={Math.abs(barHeight)}
              fill={
                withCustomBarColorFromData
                  ? `url(#customColor_${index}_0)`
                  : "url(#fillShadowGradient)"
              }
            />
          );
        });
      })
      .flatMap(val => val);
  };

  renderColors = (data: GanttData[], flatColor: boolean) => {
    return data.map((dataset, index) => (
      <Defs key={`container-color-${index}`}>
        {dataset.colors?.map((color, colorIndex) => {
          const highOpacityColor = color(1.0);
          const lowOpacityColor = color(0.1);
          return (
            <LinearGradient
              id={`customColor_${index}_${colorIndex}`}
              key={`${index}_${colorIndex}_${Math.random()}-color`}
              x1={0}
              y1={0}
              x2={0}
              y2={1}
            >
              <Stop offset="0" stopColor={highOpacityColor} stopOpacity="1" />
              {flatColor ? (
                <Stop offset="1" stopColor={highOpacityColor} stopOpacity="1" />
              ) : (
                <Stop offset="1" stopColor={lowOpacityColor} stopOpacity="0" />
              )}
            </LinearGradient>
          );
        })}
      </Defs>
    ));
  };

  renderHorizontalLabels = ({
    labels = [],
    width,
    height,
    paddingRight,
    paddingTop,
    horizontalOffset = 0,
    stackedBar = false,
    horizontalLabelRotation = 0,
    formatYLabel = yLabel => yLabel
  }: Pick<
    AbstractChartConfig,
    | "labels"
    | "width"
    | "height"
    | "paddingRight"
    | "paddingTop"
    | "horizontalOffset"
    | "stackedBar"
    | "horizontalLabelRotation"
    | "formatYLabel"
  >) => {
    const {
      yAxisLabel = "",
      xLabelsOffset = 0,
      yLabelsOffset = 12,
      hidePointsAtIndex = []
    } = this.props;

    const fontSize = 12;

    let fac = 1;
    if (stackedBar) {
      fac = 0.71;
    }

    return labels.map((label, i) => {
      if (hidePointsAtIndex.includes(i)) {
        return null;
      }

      const x = paddingRight - yLabelsOffset;
      const y = paddingTop + (i * ((height * 3) / 4)) / labels.length;
      return (
        <Text
          origin={`${x}, ${y}`}
          rotation={horizontalLabelRotation}
          key={Math.random()}
          x={x}
          y={y}
          textAnchor="end"
          {...this.getPropsForLabels()}
          {...this.getPropsForHorizontalLabels()}
        >
          {`${formatYLabel(label)}${yAxisLabel}`}
        </Text>
      );
    });
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withVerticalInnerLines = false,
      withHorizontalInnerLines = false,
      withCustomBarColorFromData = false,
      flatColor = false,
      barRoundedCap = false
    } = this.props;

    const { borderRadius = 0, paddingTop = 32, paddingRight = 64 } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (this.props.chartConfig && this.props.chartConfig.decimalPlaces) ?? 2,
      formatYLabel:
        (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
        function(label) {
          return label;
        },
      formatXLabel:
        (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
        function(label) {
          return label;
        }
    };

    const [, , , count] = this.calcTimeBoundary();

    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          {this.renderColors(this.props.data, flatColor)}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLine({
              ...config,
              paddingTop,
              paddingRight
            })}
          </G>
          <G>
            {withHorizontalInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: data.length,
                  paddingTop
                })
              : null}
          </G>

          <G>
            {withVerticalInnerLines
              ? this.renderVerticalLines({
                  ...config,
                  data: new Array(Math.max(count, 1)).fill(1),
                  paddingRight: paddingRight as number,
                  paddingTop: paddingTop as number
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  labels: data.map(value => value.name),
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: this.getTimeLabels(),
                  paddingRight: paddingRight as number,
                  paddingTop: paddingTop as number
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.map(task =>
                task.periods.map(([start, end]) => [
                  start.valueOf(),
                  end.valueOf()
                ])
              ),
              paddingTop: paddingTop as number,
              paddingRight: paddingRight as number,
              withCustomBarColorFromData: withCustomBarColorFromData,
              barRoundedCap: barRoundedCap
            })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default GanttChart;
