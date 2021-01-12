import "babel-polyfill";

import React from "react";
import { Dimensions, ScrollView, StatusBar, Text } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import ScrollableTabView from "react-native-scrollable-tab-view";

import {
  contributionData,
  data,
  ganttChartData,
  pieChartData,
  progressChartData,
  stackedBarGraphData
} from "./data";
import {
  ContributionGraph,
  LineChart,
  // PieChart,
  ProgressChart,
  StackedBarChart
} from "./dist/";

import { BarChart } from "./src";
import { GanttChart, PieChart } from "./src";
import { Circle, G, Text as SVGText } from "react-native-svg";

// in Expo - swipe left to see the following styling, or create your own
const chartConfigs = [
  {
    backgroundColor: "#000000",
    backgroundGradientFrom: "#1E2923",
    backgroundGradientTo: "#08130D",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForHorizontalAxisLine: { strokeDasharray: null }
  },
  {
    backgroundColor: "#022173",
    backgroundGradientFrom: "#022173",
    backgroundGradientTo: "#1b3fa0",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForBackgroundLines: {
      strokeDasharray: "" // solid background lines with no dashes
    }
  },
  {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `#99A6B8`,
    propsForBackgroundLines: { strokeDasharray: "2 2" },
    propsForHorizontalAxisLine: { strokeDasharray: null },
    barRadius: 32 / 2
  },
  {
    backgroundColor: "#26872a",
    backgroundGradientFrom: "#43a047",
    backgroundGradientTo: "#66bb6a",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  },
  {
    backgroundColor: "#000000",
    backgroundGradientFrom: "#000000",
    backgroundGradientTo: "#000000",
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
  },
  {
    backgroundColor: "#0091EA",
    backgroundGradientFrom: "#0091EA",
    backgroundGradientTo: "#0091EA",
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
  },
  {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  },
  {
    backgroundColor: "#b90602",
    backgroundGradientFrom: "#e53935",
    backgroundGradientTo: "#ef5350",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  },
  {
    backgroundColor: "#ff3e03",
    backgroundGradientFrom: "#ff3e03",
    backgroundGradientTo: "#ff3e03",
    color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`
  }
].map(config => ({ ...config, data: [{ color: config.color }] }));
export default class App extends React.Component {
  renderTabBar() {
    return <StatusBar hidden />;
  }
  render() {
    const { width } = Dimensions.get("window");
    const height = 256;
    const overlay = (width, height) => (
      <G>
        <Circle
          r={Math.min(width, height) / 2}
          cx={width / 2}
          cy={height / 2}
          fill={"white"}
        />
        <SVGText
          x={width / 2}
          y={height / 2 + 18 / 4}
          textAnchor="middle"
          fontSize="18"
          fill={"#000000"}
        >
          Donut Text
        </SVGText>
      </G>
    );
    return (
      <ScrollableTabView renderTabBar={this.renderTabBar}>
        {chartConfigs.map(chartConfig => {
          const labelStyle = {
            color: chartConfig.color(),
            marginVertical: 10,
            textAlign: "center",
            fontSize: 16
          };
          const graphStyle = {
            marginVertical: 8,
            ...chartConfig.style
          };
          return (
            <ScrollView
              key={Math.random()}
              style={{
                backgroundColor: chartConfig.backgroundColor
              }}
            >
              <Text style={labelStyle}>Bezier Line Chart</Text>
              <LineChart
                bezier
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                yAxisSuffix="k"
                chartConfig={chartConfig}
                style={graphStyle}
                verticalLabelRotation={20}
                onDataPointClick={({ value, getColor }) =>
                  showMessage({
                    message: `${value}`,
                    description: "You selected this value",
                    backgroundColor: getColor(0.9)
                  })
                }
                formatXLabel={label => label.toUpperCase()}
              />
              <FlashMessage duration={1000} />
              <Text style={labelStyle}>Progress Chart</Text>
              {/* <ProgressChart
                data={progressChartData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                style={graphStyle}
                hideLegend={false}
              /> */}
              <Text style={labelStyle}>Gantt Chart</Text>
              <GanttChart
                width={width}
                height={height}
                data={ganttChartData}
                chartConfig={chartConfig}
                style={graphStyle}
                withVerticalInnerLines={true}
                dateFormatter={date =>
                  date
                    .toISOString()
                    .split("T")[1]
                    .split(":")
                    .slice(0, 2)
                    .join(":")
                }
                withCustomBarColorFromData={true}
                flatColor={true}
                barRoundedCap={true}
              />
              <GanttChart
                width={width}
                height={height}
                data={ganttChartData}
                chartConfig={chartConfig}
                style={graphStyle}
                withVerticalInnerLines={true}
                dateFormatter={date =>
                  date
                    .toISOString()
                    .split("T")[1]
                    .split(":")
                    .slice(0, 2)
                    .join(":")
                }
                withCustomBarColorFromData={true}
                flatColor={true}
                barRoundedCap={true}
                setScale={3}
              />
              <Text style={labelStyle}>Bar Graph</Text>
              <BarChart
                width={width}
                height={height}
                data={data}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={graphStyle}
                isShowBubbleText={true}
                bubbleTextConfig={{
                  getBubbleText: data => {
                    console.log(parseInt(data) + 10, "data real: ", data);
                    return "dataaaaaaaaaaaaaaa" + data;
                  }
                }}
              />
              <Text style={labelStyle}>Stacked Bar Graph</Text>
              <StackedBarChart
                style={graphStyle}
                data={stackedBarGraphData}
                width={width}
                height={220}
                chartConfig={chartConfig}
              />
              <Text style={labelStyle}>Stacked Bar Graph Percentile</Text>
              <StackedBarChart
                style={graphStyle}
                data={stackedBarGraphData}
                width={width}
                height={220}
                chartConfig={chartConfig}
                percentile
              />
              <Text style={labelStyle}>Pie Chart</Text>
              <PieChart
                data={pieChartData}
                height={height}
                width={width}
                chartConfig={chartConfig}
                accessor="population"
                style={graphStyle}
                backgroundColor="transparent"
                paddingLeft="15"
              />
              <Text style={labelStyle}>Donut Chart </Text>
              <PieChart
                data={pieChartData}
                height={height}
                width={width}
                chartConfig={chartConfig}
                accessor="population"
                style={graphStyle}
                backgroundColor="transparent"
                paddingLeft="15"
                donutComponent={overlay}
                donutOffset={0.7}
              />
              <Text style={labelStyle}>Line Chart</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={graphStyle}
              />
              <Text style={labelStyle}>Contribution Graph</Text>
              <ContributionGraph
                values={contributionData}
                width={width}
                height={height}
                endDate={new Date("2016-05-01")}
                numDays={105}
                chartConfig={chartConfig}
                style={graphStyle}
              />
              <Text style={labelStyle}>Line Chart</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                segments={5}
                chartConfig={chartConfig}
                style={graphStyle}
                hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
              />
              <Text style={labelStyle}>
                Line Chart with shadow background as line color
              </Text>
              <LineChart
                bezier
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                segments={5}
                chartConfig={{
                  ...chartConfig,
                  useShadowColorFromDataset: true
                }}
                style={graphStyle}
                hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
              />

              <Text style={labelStyle}>Scrollable Line Chart</Text>
              <LineChart
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June"
                  ],
                  datasets: [
                    {
                      data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100
                      ]
                    }
                  ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                withInnerLines={false}
                withDots={false}
                withShadow={false}
                withScrollableDot={true}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundGradientFrom: "#1F1F1F",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => "#FF5500",
                  labelColor: (opacity = 1) => "#A0A0A0",
                  linejoinType: "round",

                  scrollableDotFill: "#fff",
                  scrollableDotRadius: 6,
                  scrollableDotStrokeColor: "#FF5500",
                  scrollableDotStrokeWidth: 3,

                  scrollableInfoViewStyle: {
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor: "#121212",
                    borderRadius: 2
                  },
                  scrollableInfoTextStyle: {
                    color: "#C4C4C4",
                    marginHorizontal: 4,
                    flex: 1,
                    textAlign: "center"
                  },
                  scrollableInfoSize: { width: 65, height: 30 },
                  scrollableInfoOffset: 15
                }}
                style={{
                  marginVertical: 8
                }}
              />
            </ScrollView>
          );
        })}
      </ScrollableTabView>
    );
  }
}
