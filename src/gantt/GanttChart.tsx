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

export interface GanttData {
  /** The data coresponding to  the y-axis label. */
  name: string;

  /** The periods corresponding to the x-axis label. */
  periods: [Date, Date][];

  /** A function returning the color of the stroke given an input opacity value. */
  color?: (opacity: number) => string;

  /** A function returning array of the colors of the stroke given an input opacity value for each data value. */
  colors?: Array<(opacity: number) => string>;
}

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
  /**
   * The number of horizontal lines
   */
  segments?: number;
  showBarTops?: boolean;
  showValuesOnTopOfBars?: boolean;
  withCustomBarColorFromData?: boolean;
  flatColor?: boolean;
  dateFormatter?: (date: Date) => string;
  barRoundedCap?: boolean;
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

  getTimeLabels = (count = 4) => {
    const data = this.props.data
      .flatMap(data => data.periods)
      .flatMap(period => [period[0], period[1]])
      .map(date => date.valueOf());
    const startTime = Math.min(...data);
    const endTime = Math.max(...data);
    // const duration = Math.floor((endTime - startTime) / 1000);
    // const secondForDay = 86400;
    // if (duration > secondForDay) {

    // } else if () {

    // }

    const labels = new Array(count)
      .fill(1)
      .map((_, index) => ((endTime - startTime) / count) * index + startTime)
      .map(tick => new Date(tick))
      .map(date =>
        this.props.dateFormatter
          ? this.props.dateFormatter(date)
          : date.toLocaleString()
      );
    return labels;
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
    | "width"
    | "height"
    | "paddingTop"
    | "paddingRight"
    | "barRadius"
    | "barRoundedCap"
    | "withCustomBarColorFromData"
  > & {
    data: [number, number][][];
    withCustomBarColorFromData: boolean;
  }) => {
    const flattenData = data.flatMap(value => value).flatMap(val => val);
    const basePosition = height - height / 4;
    const barHeight = this.calcBarSize(data.length, height - paddingTop);
    const maxWidth = width - paddingRight;

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

  renderBarTops = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
          width={barWidth}
          height={2}
          fill={this.props.chartConfig.color(0.6)}
        />
      );
    });
  };

  renderColors = (data: GanttData[], flatColor: boolean) => {
    return data.map((dataset, index) => (
      <Defs>
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

  renderValuesOnTopOfBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return (
        <Text
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 1
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
          fill={this.props.chartConfig.color(0.6)}
          fontSize="12"
          textAnchor="middle"
        >
          {data[i]}
        </Text>
      );
    });
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
          {...this.getPropsForVerticalLabels()}
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
      showBarTops = true,
      withCustomBarColorFromData = false,
      showValuesOnTopOfBars = false,
      flatColor = false,
      barRoundedCap = false,
      segments = 4
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
                  data: new Array(data.length).fill(1),
                  paddingRight,
                  paddingTop
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
                  labels: this.getTimeLabels(4),
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
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars({
                ...config,
                data: [], // data.datasets[0].data,
                paddingTop: paddingTop as number,
                paddingRight: paddingRight as number
              })}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops({
                ...config,
                data: [], //data.datasets[0].data,
                paddingTop: paddingTop as number,
                paddingRight: paddingRight as number
              })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default GanttChart;
