import React from "react";
import { View, ViewStyle } from "react-native";
import {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Svg,
  Text,
  TextAnchor
} from "react-native-svg";

import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "./AbstractChart";
import { ChartData } from "./HelperTypes";

const barWidth = 32;

export interface BarChartData extends ChartData {
  gradientColors?: Array<Element>;
}

export interface BubbleTextData {
  width?: number;
  height?: number;
  color?: string;
  fontSize?: number;
  textColor?: string;
  textSuffix?: string;
  bubleOffset?: number;
}

export interface ThresholdConfigData {
  text?: string;
  colorLine?: string;
  colorPolygon?: string;
  textColor?: string;
  textAnchor?: TextAnchor;
  fontSize?: number;
  fontFamily?: string;
}

export interface BarChartProps extends AbstractChartProps {
  data: BarChartData;
  width: number;
  height: number;
  fromZero?: boolean;
  withInnerLines?: boolean;
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
  /**
   * Fact for show bubble text when press each bar chart
   */
  isShowBubbleText?: boolean; //default is false
  bubbleTextConfig?: BubbleTextData;
  barPaddingTop?: number;
  /**
   * Threshold of bar chart
   */
  threshold?: number;
  thresholdConfig?: ThresholdConfigData;
  /**
   * Under bar line of bar chart
   */
  isShowUnderBarLine?: boolean;
  underBarLineColor?: string;
}

type BarChartState = {};

class BarChart extends AbstractChart<BarChartProps, BarChartState> {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  state = {
    barIndex: -1
  };

  calcBaseHeight = (data: number[], height: number) => {
    let newData = [...data];
    this.props.threshold ? newData.push(this.props.threshold) : null;
    const min = Math.min(...newData);
    const max = Math.max(...newData);
    if (min >= 0 && max >= 0) {
      return height;
    } else if (min < 0 && max <= 0) {
      return 0;
    } else if (min < 0 && max > 0) {
      return (height * max) / this.calcScaler(newData);
    }
  };

  calcHeight = (val: number, data: number[], height: number) => {
    let newData = [...data];
    this.props.threshold ? newData.push(this.props.threshold) : null;
    const max = Math.max(...newData);
    const min = Math.min(...newData);
    if (min < 0 && max > 0) {
      return height * (val / this.calcScaler(newData));
    } else if (min >= 0 && max >= 0) {
      return this.props.fromZero
        ? height * (val / this.calcScaler(newData))
        : height * ((val - min) / this.calcScaler(newData));
    } else if (min < 0 && max <= 0) {
      return this.props.fromZero
        ? height * (val / this.calcScaler(newData))
        : height * ((val - max) / this.calcScaler(newData));
    }
  };

  renderBubbleText = (
    xAxis: number,
    yAxis: number,
    textData: string,
    {
      width = 71,
      height = 33.2501,
      color = "#00214E",
      textColor = "#FFFFFF",
      fontSize = 12,
      textSuffix = "",
      bubleOffset = 41
    }: BubbleTextData
  ) => {
    return (
      <G>
        <Rect
          key={Math.random()}
          x={xAxis}
          y={yAxis - bubleOffset}
          width={width}
          height={height}
          fill={color}
        />
        <Text
          key={Math.random()}
          x={xAxis + width / 2}
          y={yAxis - bubleOffset + height / 2 + 2}
          stroke={textColor}
          fontSize={fontSize}
          textAnchor="middle"
        >
          {`${textData} ${textSuffix}`}
        </Text>
        <G x={xAxis} y={yAxis - bubleOffset}>
          <Path
            d="M35 42.459L31.5359 34.1465L38.4641 34.1465L35 42.459Z"
            fill={color}
          />
        </G>
      </G>
    );
  };

  numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  renderBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    barRadius,
    withCustomBarColorFromData,
    withLinearGradient,
    colors,
    barPaddingTop
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop" | "barRadius" | "color"
  > & {
    data: number[];
    withCustomBarColorFromData: boolean;
    withLinearGradient?: boolean;
    colors?: ((opacity: number) => string)[];
    barPaddingTop: number;
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      const xAxis =
        paddingRight +
        (i * (width - paddingRight)) / data.length +
        barWidth / 2;
      const yAxis =
        ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
        paddingTop +
        barPaddingTop;
      return (
        <G key={Math.random()}>
          {this.props.isShowBubbleText &&
            this.state.barIndex === i &&
            this.renderBubbleText(
              xAxis - barWidth / 2 - 10,
              yAxis,
              this.numberWithCommas(x),
              this.props.bubbleTextConfig ? this.props.bubbleTextConfig : {}
            )}
          <Rect
            key={Math.random()}
            x={xAxis}
            y={yAxis}
            rx={barRadius}
            width={barWidth}
            height={(Math.abs(barHeight) / 4) * 3}
            fill={
              withCustomBarColorFromData
                ? withLinearGradient
                  ? colors[i](1).toString()
                  : `url(#customColor_0_${i})`
                : "url(#fillShadowGradient)"
            }
            onPress={() => this.setState({ barIndex: i })}
          />
        </G>
      );
    });
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

  renderColors = ({
    data,
    flatColor,
    withLinearGradient
  }: Pick<AbstractChartConfig, "data"> & {
    flatColor: boolean;
    withLinearGradient?: boolean;
  }) => {
    return data.map((dataset, index) => (
      <Defs key={"renderColorsKey"}>
        {!withLinearGradient &&
          dataset.colors?.map((color, colorIndex) => {
            const highOpacityColor = color(1.0);
            const lowOpacityColor = color(0.1);

            return (
              <LinearGradient
                id={`customColor_${index}_${colorIndex}`}
                key={`${index}_${colorIndex}`}
                x1={0}
                y1={0}
                x2={0}
                y2={1}
              >
                <Stop offset="0" stopColor={highOpacityColor} stopOpacity="1" />
                {flatColor ? (
                  <Stop
                    offset="1"
                    stopColor={highOpacityColor}
                    stopOpacity="1"
                  />
                ) : (
                  <Stop
                    offset="1"
                    stopColor={lowOpacityColor}
                    stopOpacity="0"
                  />
                )}
              </LinearGradient>
            );
          })}
      </Defs>
    ));
  };

  renderThresholdLine = ({
    data,
    threshold,
    width,
    height,
    paddingTop,
    paddingRight,
    text = "Threshold",
    colorLine = "#4F58DF",
    colorPolygon = "#4F58DF",
    textColor = "#4F58DF",
    textAnchor = "middle",
    fontSize = 18,
    fontFamily = ""
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
    threshold: number;
    text?: string;
    colorLine?: string;
    colorPolygon?: string;
    textColor?: string;
    textAnchor?: TextAnchor;
    fontSize?: number;
    fontFamily?: string;
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);
    const barHeight = this.calcHeight(threshold, data, height);
    const barWidth = 32 * this.getBarPercentage();
    const yAxis =
      ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
      paddingTop;
    const lineWidth = width - paddingRight - barWidth * 0.5;
    return (
      <G x={paddingRight} y={yAxis}>
        <G rotation={-90} x={-2}>
          <Text
            key={Math.random()}
            fill={textColor}
            fontSize={fontSize}
            textAnchor={textAnchor}
            fontFamily={fontFamily}
          >
            {text}
          </Text>
        </G>
        <Line
          x2={lineWidth}
          stroke={colorLine}
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
        <Polygon
          y={-4}
          points="6,4 0,7.464 0,0.536"
          fill={colorPolygon}
          stroke={colorPolygon}
          strokeWidth="1"
        />
      </G>
    );
  };

  renderUnderBarLine = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    lineColor
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
    lineColor: string;
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);
    const barHeight = this.calcHeight(0, data, height);
    const barWidth = 32 * this.getBarPercentage();
    const yAxis =
      ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
      paddingTop;
    const lineWidth = width - paddingRight - barWidth * 0.5;
    return (
      <G x={paddingRight} y={yAxis}>
        <Line x2={lineWidth} stroke={lineColor} />
      </G>
    );
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
      withInnerLines = true,
      showBarTops = true,
      withCustomBarColorFromData = false,
      showValuesOnTopOfBars = false,
      flatColor = false,
      segments = 4,
      barPaddingTop = 0,
      threshold = false,
      thresholdConfig = {},
      isShowUnderBarLine = false,
      underBarLineColor = "#000000"
    } = this.props;

    const { borderRadius = 0, paddingTop = 16, paddingRight = 64 } = style;

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
          <Defs>{data.gradientColors}</Defs>
          {this.renderColors({
            ...this.props.chartConfig,
            flatColor: flatColor,
            withLinearGradient: data.gradientColors ? true : false
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {threshold
              ? this.renderThresholdLine({
                  ...config,
                  data: data.datasets[0].data,
                  threshold,
                  paddingTop: (paddingTop as number) + barPaddingTop,
                  paddingRight: paddingRight as number,
                  ...thresholdConfig
                })
              : null}
          </G>
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: segments,
                  paddingTop
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: data.datasets[0].data,
                  paddingTop: (paddingTop as number) + barPaddingTop,
                  paddingRight: paddingRight as number
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight: paddingRight as number,
                  paddingTop: (paddingTop as number) + barPaddingTop,
                  horizontalOffset: barWidth * this.getBarPercentage()
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop: paddingTop as number,
              paddingRight: paddingRight as number,
              withCustomBarColorFromData: withCustomBarColorFromData,
              withLinearGradient: data.gradientColors ? true : false,
              colors: data.datasets[0].colors,
              barPaddingTop: barPaddingTop
            })}
          </G>
          <G>
            {isShowUnderBarLine
              ? this.renderUnderBarLine({
                  ...config,
                  data: data.datasets[0].data,
                  paddingTop: (paddingTop as number) + barPaddingTop,
                  paddingRight: paddingRight as number,
                  lineColor: underBarLineColor
                })
              : null}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars({
                ...config,
                data: data.datasets[0].data,
                paddingTop: (paddingTop as number) + barPaddingTop,
                paddingRight: paddingRight as number
              })}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops({
                ...config,
                data: data.datasets[0].data,
                paddingTop: (paddingTop as number) + barPaddingTop,
                paddingRight: paddingRight as number
              })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default BarChart;
