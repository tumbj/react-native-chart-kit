var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import React from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import {
  Circle,
  G,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg
} from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { LegendItem } from "./LegendItem";
var AnimatedCircle = Animated.createAnimatedComponent(Circle);
var LineChart = /** @class */ (function(_super) {
  __extends(LineChart, _super);
  function LineChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.label = React.createRef();
    _this.state = {
      scrollableDotHorizontalOffset: new Animated.Value(0)
    };
    _this.getColor = function(dataset, opacity) {
      return (dataset.color || _this.props.chartConfig.color)(opacity);
    };
    _this.getStrokeWidth = function(dataset) {
      return dataset.strokeWidth || _this.props.chartConfig.strokeWidth || 3;
    };
    _this.getDatas = function(data) {
      return data.reduce(function(acc, item) {
        return item.data ? __spreadArrays(acc, item.data) : acc;
      }, []);
    };
    _this.getPropsForDots = function(x, i) {
      var _a = _this.props,
        getDotProps = _a.getDotProps,
        chartConfig = _a.chartConfig;
      if (typeof getDotProps === "function") {
        return getDotProps(x, i);
      }
      var _b = chartConfig.propsForDots,
        propsForDots = _b === void 0 ? {} : _b;
      return __assign({ r: "4" }, propsForDots);
    };
    _this.renderDots = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        onDataPointClick = _a.onDataPointClick;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var _b = _this.props,
        getDotColor = _b.getDotColor,
        _c = _b.hidePointsAtIndex,
        hidePointsAtIndex = _c === void 0 ? [] : _c,
        _d = _b.renderDotContent,
        renderDotContent =
          _d === void 0
            ? function() {
                return null;
              }
            : _d;
      data.forEach(function(dataset) {
        if (dataset.withDots == false) return;
        dataset.data.forEach(function(x, i) {
          if (hidePointsAtIndex.includes(i)) {
            return;
          }
          var cx =
            paddingRight + (i * (width - paddingRight)) / dataset.data.length;
          var cy =
            ((baseHeight - _this.calcHeight(x, datas, height)) / 4) * 3 +
            paddingTop;
          var onPress = function() {
            if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
              return;
            }
            onDataPointClick({
              index: i,
              value: x,
              dataset: dataset,
              x: cx,
              y: cy,
              getColor: function(opacity) {
                return _this.getColor(dataset, opacity);
              }
            });
          };
          output.push(
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              fill={
                typeof getDotColor === "function"
                  ? getDotColor(x, i)
                  : _this.getColor(dataset, 0.9)
              }
              onPress={onPress}
              {..._this.getPropsForDots(x, i)}
            />,
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              r="14"
              fill="#fff"
              fillOpacity={0}
              onPress={onPress}
            />,
            renderDotContent({ x: cx, y: cy, index: i, indexData: x })
          );
        });
      });
      return output;
    };
    _this.renderScrollableDot = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        scrollableDotHorizontalOffset = _a.scrollableDotHorizontalOffset,
        scrollableDotFill = _a.scrollableDotFill,
        scrollableDotStrokeColor = _a.scrollableDotStrokeColor,
        scrollableDotStrokeWidth = _a.scrollableDotStrokeWidth,
        scrollableDotRadius = _a.scrollableDotRadius,
        scrollableInfoViewStyle = _a.scrollableInfoViewStyle,
        scrollableInfoTextStyle = _a.scrollableInfoTextStyle,
        _b = _a.scrollableInfoTextDecorator,
        scrollableInfoTextDecorator =
          _b === void 0
            ? function(x) {
                return "" + x;
              }
            : _b,
        scrollableInfoSize = _a.scrollableInfoSize,
        scrollableInfoOffset = _a.scrollableInfoOffset;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var vl = [];
      var perData = width / data[0].data.length;
      for (var index = 0; index < data[0].data.length; index++) {
        vl.push(index * perData);
      }
      var lastIndex;
      scrollableDotHorizontalOffset.addListener(function(value) {
        var index = value.value / perData;
        if (!lastIndex) {
          lastIndex = index;
        }
        var abs = Math.floor(index);
        var percent = index - abs;
        abs = data[0].data.length - abs - 1;
        if (index >= data[0].data.length - 1) {
          _this.label.current.setNativeProps({
            text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
          });
        } else {
          if (index > lastIndex) {
            // to right
            var base = data[0].data[abs];
            var prev = data[0].data[abs - 1];
            if (prev > base) {
              var rest = prev - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - prev;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          } else {
            // to left
            var base = data[0].data[abs - 1];
            var next = data[0].data[abs];
            percent = 1 - percent;
            if (next > base) {
              var rest = next - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - next;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          }
        }
        lastIndex = index;
      });
      data.forEach(function(dataset) {
        if (dataset.withScrollableDot == false) return;
        var perData = width / dataset.data.length;
        var values = [];
        var yValues = [];
        var xValues = [];
        var yValuesLabel = [];
        var xValuesLabel = [];
        for (var index = 0; index < dataset.data.length; index++) {
          values.push(index * perData);
          var yval =
            ((baseHeight -
              _this.calcHeight(
                dataset.data[dataset.data.length - index - 1],
                datas,
                height
              )) /
              4) *
              3 +
            paddingTop;
          yValues.push(yval);
          var xval =
            paddingRight +
            ((dataset.data.length - index - 1) * (width - paddingRight)) /
              dataset.data.length;
          xValues.push(xval);
          yValuesLabel.push(
            yval - (scrollableInfoSize.height + scrollableInfoOffset)
          );
          xValuesLabel.push(xval - scrollableInfoSize.width / 2);
        }
        var translateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValues,
          extrapolate: "clamp"
        });
        var translateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValues,
          extrapolate: "clamp"
        });
        var labelTranslateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValuesLabel,
          extrapolate: "clamp"
        });
        var labelTranslateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValuesLabel,
          extrapolate: "clamp"
        });
        output.push([
          <Animated.View
            key={Math.random()}
            style={[
              scrollableInfoViewStyle,
              {
                transform: [
                  { translateX: labelTranslateX },
                  { translateY: labelTranslateY }
                ],
                width: scrollableInfoSize.width,
                height: scrollableInfoSize.height
              }
            ]}
          >
            <TextInput
              onLayout={function() {
                _this.label.current.setNativeProps({
                  text: scrollableInfoTextDecorator(
                    Math.floor(data[0].data[data[0].data.length - 1])
                  )
                });
              }}
              style={scrollableInfoTextStyle}
              ref={_this.label}
            />
          </Animated.View>,
          <AnimatedCircle
            key={Math.random()}
            cx={translateX}
            cy={translateY}
            r={scrollableDotRadius}
            stroke={scrollableDotStrokeColor}
            strokeWidth={scrollableDotStrokeWidth}
            fill={scrollableDotFill}
          />
        ]);
      });
      return output;
    };
    _this.renderShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      if (_this.props.bezier) {
        return _this.renderBezierShadow({
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data,
          useColorFromDataset: useColorFromDataset
        });
      }
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      return data.map(function(dataset, index) {
        return (
          <Polygon
            key={index}
            points={
              dataset.data
                .map(function(d, i) {
                  var x =
                    paddingRight +
                    (i * (width - paddingRight)) / dataset.data.length;
                  var y =
                    ((baseHeight - _this.calcHeight(d, datas, height)) / 4) *
                      3 +
                    paddingTop;
                  return x + "," + y;
                })
                .join(" ") +
              (" " +
                (paddingRight +
                  ((width - paddingRight) / dataset.data.length) *
                    (dataset.data.length - 1)) +
                "," +
                ((height / 4) * 3 + paddingTop) +
                " " +
                paddingRight +
                "," +
                ((height / 4) * 3 + paddingTop))
            }
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLine = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        linejoinType = _a.linejoinType;
      if (_this.props.bezier) {
        return _this.renderBezierLine({
          data: data,
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop
        });
      }
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var lastPoint;
      data.forEach(function(dataset, index) {
        var points = dataset.data.map(function(d, i) {
          if (d === null) return lastPoint;
          var x =
            (i * (width - paddingRight)) / dataset.data.length + paddingRight;
          var y =
            ((baseHeight - _this.calcHeight(d, datas, height)) / 4) * 3 +
            paddingTop;
          lastPoint = x + "," + y;
          return x + "," + y;
        });
        output.push(
          <Polyline
            key={index}
            strokeLinejoin={linejoinType}
            points={points.join(" ")}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
          />
        );
      });
      return output;
    };
    _this.getBezierLinePoints = function(dataset, _a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data;
      if (dataset.data.length === 0) {
        return "M0,0";
      }
      var datas = _this.getDatas(data);
      var x = function(i) {
        return Math.floor(
          paddingRight + (i * (width - paddingRight)) / dataset.data.length
        );
      };
      var baseHeight = _this.calcBaseHeight(datas, height);
      var y = function(i) {
        var yHeight = _this.calcHeight(dataset.data[i], datas, height);
        return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
      };
      return ["M" + x(0) + "," + y(0)]
        .concat(
          dataset.data.slice(0, -1).map(function(_, i) {
            var x_mid = (x(i) + x(i + 1)) / 2;
            var y_mid = (y(i) + y(i + 1)) / 2;
            var cp_x1 = (x_mid + x(i)) / 2;
            var cp_x2 = (x_mid + x(i + 1)) / 2;
            return (
              "Q " +
              cp_x1 +
              ", " +
              y(i) +
              ", " +
              x_mid +
              ", " +
              y_mid +
              (" Q " +
                cp_x2 +
                ", " +
                y(i + 1) +
                ", " +
                x(i + 1) +
                ", " +
                y(i + 1))
            );
          })
        )
        .join(" ");
    };
    _this.renderBezierLine = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop;
      return data.map(function(dataset, index) {
        var result = _this.getBezierLinePoints(dataset, {
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data
        });
        return (
          <Path
            key={index}
            d={result}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
          />
        );
      });
    };
    _this.renderBezierShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      return data.map(function(dataset, index) {
        var d =
          _this.getBezierLinePoints(dataset, {
            width: width,
            height: height,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            data: data
          }) +
          (" L" +
            (paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)) +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " L" +
            paddingRight +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " Z");
        return (
          <Path
            key={index}
            d={d}
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLegend = function(width, legendOffset) {
      var _a = _this.props.data,
        legend = _a.legend,
        datasets = _a.datasets;
      var baseLegendItemX = width / (legend.length + 1);
      return legend.map(function(legendItem, i) {
        return (
          <G key={Math.random()}>
            <LegendItem
              index={i}
              iconColor={_this.getColor(datasets[i], 0.9)}
              baseLegendItemX={baseLegendItemX}
              legendText={legendItem}
              labelProps={__assign({}, _this.getPropsForLabels())}
              legendOffset={legendOffset}
            />
          </G>
        );
      });
    };
    return _this;
  }
  LineChart.prototype.render = function() {
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      data = _a.data,
      _b = _a.withScrollableDot,
      withScrollableDot = _b === void 0 ? false : _b,
      _c = _a.withShadow,
      withShadow = _c === void 0 ? true : _c,
      _d = _a.withDots,
      withDots = _d === void 0 ? true : _d,
      _e = _a.withInnerLines,
      withInnerLines = _e === void 0 ? true : _e,
      _f = _a.withOuterLines,
      withOuterLines = _f === void 0 ? true : _f,
      _g = _a.withHorizontalLines,
      withHorizontalLines = _g === void 0 ? true : _g,
      _h = _a.withVerticalLines,
      withVerticalLines = _h === void 0 ? true : _h,
      _j = _a.withHorizontalLabels,
      withHorizontalLabels = _j === void 0 ? true : _j,
      _k = _a.withVerticalLabels,
      withVerticalLabels = _k === void 0 ? true : _k,
      _l = _a.style,
      style = _l === void 0 ? {} : _l,
      decorator = _a.decorator,
      onDataPointClick = _a.onDataPointClick,
      _m = _a.verticalLabelRotation,
      verticalLabelRotation = _m === void 0 ? 0 : _m,
      _o = _a.horizontalLabelRotation,
      horizontalLabelRotation = _o === void 0 ? 0 : _o,
      _p = _a.formatYLabel,
      formatYLabel =
        _p === void 0
          ? function(yLabel) {
              return yLabel;
            }
          : _p,
      _q = _a.formatXLabel,
      formatXLabel =
        _q === void 0
          ? function(xLabel) {
              return xLabel;
            }
          : _q,
      segments = _a.segments,
      _r = _a.transparent,
      transparent = _r === void 0 ? false : _r,
      chartConfig = _a.chartConfig;
    var scrollableDotHorizontalOffset = this.state
      .scrollableDotHorizontalOffset;
    var _s = data.labels,
      labels = _s === void 0 ? [] : _s;
    var _t = style.borderRadius,
      borderRadius = _t === void 0 ? 0 : _t,
      _u = style.paddingTop,
      paddingTop = _u === void 0 ? 16 : _u,
      _v = style.paddingRight,
      paddingRight = _v === void 0 ? 64 : _v,
      _w = style.margin,
      margin = _w === void 0 ? 0 : _w,
      _x = style.marginRight,
      marginRight = _x === void 0 ? 0 : _x,
      _y = style.paddingBottom,
      paddingBottom = _y === void 0 ? 0 : _y;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation
    };
    var datas = this.getDatas(data.datasets);
    var count =
      Math.min.apply(Math, datas) === Math.max.apply(Math, datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }
    var legendOffset = this.props.data.legend ? height * 0.15 : 0;
    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs(
              __assign(__assign(__assign({}, config), chartConfig), {
                data: data.datasets
              })
            )}
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines(
                      __assign(__assign({}, config), {
                        count: count,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderHorizontalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: count,
                    data: datas,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatYLabel: formatYLabel,
                    decimalPlaces: chartConfig.decimalPlaces
                  })
                )}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines(
                      __assign(__assign({}, config), {
                        data: data.datasets[0].data,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderVerticalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: labels,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatXLabel: formatXLabel
                  })
                )}
            </G>
            <G>
              {this.renderLine(
                __assign(__assign(__assign({}, config), chartConfig), {
                  paddingRight: paddingRight,
                  paddingTop: paddingTop,
                  data: data.datasets
                })
              )}
            </G>
            <G>
              {withShadow &&
                this.renderShadow(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    useColorFromDataset: chartConfig.useShadowColorFromDataset
                  })
                )}
            </G>
            <G>
              {withDots &&
                this.renderDots(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick
                  })
                )}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot(
                  __assign(__assign(__assign({}, config), chartConfig), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick,
                    scrollableDotHorizontalOffset: scrollableDotHorizontalOffset
                  })
                )}
            </G>
            <G>
              {decorator &&
                decorator(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: width * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollableDotHorizontalOffset }
                }
              }
            ])}
            horizontal
            bounces={false}
          />
        )}
      </View>
    );
  };
  return LineChart;
})(AbstractChart);
export default LineChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFvQixNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNKLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFvTTlEO0lBQXdCLDZCQUE2QztJQUFyRTtRQUFBLHFFQTh2QkM7UUE3dkJDLFdBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFhLENBQUM7UUFFckMsV0FBSyxHQUFHO1lBQ04sNkJBQTZCLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNyRCxDQUFDO1FBRUYsY0FBUSxHQUFHLFVBQUMsT0FBZ0IsRUFBRSxPQUFlO1lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxPQUFnQjtZQUNoQyxPQUFPLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FB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NUMsOEJBQThCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDdEMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDeEIsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUN2QjtnQkFDRSxXQUFXLEVBQUU7b0JBQ1gsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLDZCQUE2QixFQUFFO2lCQUNwRDthQUNGO1NBQ0YsQ0FBQyxDQUFDLENBQ0gsVUFBVSxDQUNWLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNmLENBQ0gsQ0FDSDtNQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUE5dkJELENBQXdCLGFBQWEsR0E4dkJwQztBQUVELGVBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQge1xyXG4gIEFuaW1hdGVkLFxyXG4gIFNjcm9sbFZpZXcsXHJcbiAgU3R5bGVTaGVldCxcclxuICBUZXh0SW5wdXQsXHJcbiAgVmlldyxcclxuICBWaWV3U3R5bGVcclxufSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XHJcbmltcG9ydCB7XHJcbiAgQ2lyY2xlLFxyXG4gIEcsXHJcbiAgUGF0aCxcclxuICBQb2x5Z29uLFxyXG4gIFBvbHlsaW5lLFxyXG4gIFJlY3QsXHJcbiAgU3ZnXHJcbn0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcclxuXHJcbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7XHJcbiAgQWJzdHJhY3RDaGFydENvbmZpZyxcclxuICBBYnN0cmFjdENoYXJ0UHJvcHNcclxufSBmcm9tIFwiLi4vQWJzdHJhY3RDaGFydFwiO1xyXG5pbXBvcnQgeyBDaGFydERhdGEsIERhdGFzZXQgfSBmcm9tIFwiLi4vSGVscGVyVHlwZXNcIjtcclxuaW1wb3J0IHsgTGVnZW5kSXRlbSB9IGZyb20gXCIuL0xlZ2VuZEl0ZW1cIjtcclxuXHJcbmxldCBBbmltYXRlZENpcmNsZSA9IEFuaW1hdGVkLmNyZWF0ZUFuaW1hdGVkQ29tcG9uZW50KENpcmNsZSk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExpbmVDaGFydERhdGEgZXh0ZW5kcyBDaGFydERhdGEge1xyXG4gIGxlZ2VuZD86IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExpbmVDaGFydFByb3BzIGV4dGVuZHMgQWJzdHJhY3RDaGFydFByb3BzIHtcclxuICAvKipcclxuICAgKiBEYXRhIGZvciB0aGUgY2hhcnQuXHJcbiAgICpcclxuICAgKiBFeGFtcGxlIGZyb20gW2RvY3NdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0I2xpbmUtY2hhcnQpOlxyXG4gICAqXHJcbiAgICogYGBgamF2YXNjcmlwdFxyXG4gICAqIGNvbnN0IGRhdGEgPSB7XHJcbiAgICogICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZSddLFxyXG4gICAqICAgZGF0YXNldHM6IFt7XHJcbiAgICogICAgIGRhdGE6IFsgMjAsIDQ1LCAyOCwgODAsIDk5LCA0MyBdLFxyXG4gICAqICAgICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgxMzQsIDY1LCAyNDQsICR7b3BhY2l0eX0pYCwgLy8gb3B0aW9uYWxcclxuICAgKiAgICAgc3Ryb2tlV2lkdGg6IDIgLy8gb3B0aW9uYWxcclxuICAgKiAgIH1dLFxyXG4gICAqICAgbGVnZW5kOiBbXCJSYWlueSBEYXlzXCIsIFwiU3VubnkgRGF5c1wiLCBcIlNub3d5IERheXNcIl0gLy8gb3B0aW9uYWxcclxuICAgKiB9XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgZGF0YTogTGluZUNoYXJ0RGF0YTtcclxuICAvKipcclxuICAgKiBXaWR0aCBvZiB0aGUgY2hhcnQsIHVzZSAnRGltZW5zaW9ucycgbGlicmFyeSB0byBnZXQgdGhlIHdpZHRoIG9mIHlvdXIgc2NyZWVuIGZvciByZXNwb25zaXZlLlxyXG4gICAqL1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogSGVpZ2h0IG9mIHRoZSBjaGFydC5cclxuICAgKi9cclxuICBoZWlnaHQ6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBTaG93IGRvdHMgb24gdGhlIGxpbmUgLSBkZWZhdWx0OiBUcnVlLlxyXG4gICAqL1xyXG4gIHdpdGhEb3RzPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBTaG93IHNoYWRvdyBmb3IgbGluZSAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aFNoYWRvdz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyBpbm5lciBkYXNoZWQgbGluZXMgLSBkZWZhdWx0OiBUcnVlLlxyXG4gICAqL1xyXG5cclxuICB3aXRoU2Nyb2xsYWJsZURvdD86IGJvb2xlYW47XHJcbiAgd2l0aElubmVyTGluZXM/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFNob3cgb3V0ZXIgZGFzaGVkIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cclxuICAgKi9cclxuICB3aXRoT3V0ZXJMaW5lcz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyB2ZXJ0aWNhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aFZlcnRpY2FsTGluZXM/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFNob3cgaG9yaXpvbnRhbCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aEhvcml6b250YWxMaW5lcz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0OiBUcnVlLlxyXG4gICAqL1xyXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aEhvcml6b250YWxMYWJlbHM/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFJlbmRlciBjaGFydHMgZnJvbSAwIG5vdCBmcm9tIHRoZSBtaW5pbXVtIHZhbHVlLiAtIGRlZmF1bHQ6IEZhbHNlLlxyXG4gICAqL1xyXG4gIGZyb21aZXJvPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBQcmVwZW5kIHRleHQgdG8gaG9yaXpvbnRhbCBsYWJlbHMgLS0gZGVmYXVsdDogJycuXHJcbiAgICovXHJcbiAgeUF4aXNMYWJlbD86IHN0cmluZztcclxuICAvKipcclxuICAgKiBBcHBlbmQgdGV4dCB0byBob3Jpem9udGFsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cclxuICAgKi9cclxuICB5QXhpc1N1ZmZpeD86IHN0cmluZztcclxuICAvKipcclxuICAgKiBQcmVwZW5kIHRleHQgdG8gdmVydGljYWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxyXG4gICAqL1xyXG4gIHhBeGlzTGFiZWw/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZSBjaGFydCwgc2VlIGV4YW1wbGU6XHJcbiAgICpcclxuICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICogY29uc3QgY2hhcnRDb25maWcgPSB7XHJcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tOiBcIiMxRTI5MjNcIixcclxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5OiAwLFxyXG4gICAqICAgYmFja2dyb3VuZEdyYWRpZW50VG86IFwiIzA4MTMwRFwiLFxyXG4gICAqICAgYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5OiAwLjUsXHJcbiAgICogICBjb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcclxuICAgKiAgIGxhYmVsQ29sb3I6IChvcGFjaXR5ID0gMSkgPT4gYHJnYmEoMjYsIDI1NSwgMTQ2LCAke29wYWNpdHl9KWAsXHJcbiAgICogICBzdHJva2VXaWR0aDogMiwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgM1xyXG4gICAqICAgYmFyUGVyY2VudGFnZTogMC41XHJcbiAgICogfTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBjaGFydENvbmZpZz86IEFic3RyYWN0Q2hhcnRDb25maWc7XHJcblxyXG4gIC8qKlxyXG4gICAqIERpdmlkZSBheGlzIHF1YW50aXR5IGJ5IHRoZSBpbnB1dCBudW1iZXIgLS0gZGVmYXVsdDogMS5cclxuICAgKi9cclxuICB5QXhpc0ludGVydmFsPzogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmVzIGlmIGNoYXJ0IGlzIHRyYW5zcGFyZW50XHJcbiAgICovXHJcbiAgdHJhbnNwYXJlbnQ/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBbd2hvbGUgYnVuY2hdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0L2Jsb2IvbWFzdGVyL3NyYy9saW5lLWNoYXJ0LmpzI0wyNjYpXHJcbiAgICogb2Ygc3R1ZmYgYW5kIGNhbiByZW5kZXIgZXh0cmEgZWxlbWVudHMsXHJcbiAgICogc3VjaCBhcyBkYXRhIHBvaW50IGluZm8gb3IgYWRkaXRpb25hbCBtYXJrdXAuXHJcbiAgICovXHJcbiAgZGVjb3JhdG9yPzogRnVuY3Rpb247XHJcbiAgLyoqXHJcbiAgICogQ2FsbGJhY2sgdGhhdCBpcyBjYWxsZWQgd2hlbiBhIGRhdGEgcG9pbnQgaXMgY2xpY2tlZC5cclxuICAgKi9cclxuICBvbkRhdGFQb2ludENsaWNrPzogKGRhdGE6IHtcclxuICAgIGluZGV4OiBudW1iZXI7XHJcbiAgICB2YWx1ZTogbnVtYmVyO1xyXG4gICAgZGF0YXNldDogRGF0YXNldDtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIGdldENvbG9yOiAob3BhY2l0eTogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbiAgfSkgPT4gdm9pZDtcclxuICAvKipcclxuICAgKiBTdHlsZSBvZiB0aGUgY29udGFpbmVyIHZpZXcgb2YgdGhlIGNoYXJ0LlxyXG4gICAqL1xyXG4gIHN0eWxlPzogUGFydGlhbDxWaWV3U3R5bGU+O1xyXG4gIC8qKlxyXG4gICAqIEFkZCB0aGlzIHByb3AgdG8gbWFrZSB0aGUgbGluZSBjaGFydCBzbW9vdGggYW5kIGN1cnZ5LlxyXG4gICAqXHJcbiAgICogW0V4YW1wbGVdKGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRpZXNwaXJpdC9yZWFjdC1uYXRpdmUtY2hhcnQta2l0I2Jlemllci1saW5lLWNoYXJ0KVxyXG4gICAqL1xyXG4gIGJlemllcj86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogRGVmaW5lcyB0aGUgZG90IGNvbG9yIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBjYWxjdWxhdGUgY29sb3JzIG9mIGRvdHMgaW4gYSBsaW5lIGNoYXJ0LlxyXG4gICAqIFRha2VzIGAoZGF0YVBvaW50LCBkYXRhUG9pbnRJbmRleClgIGFzIGFyZ3VtZW50cy5cclxuICAgKi9cclxuICBnZXREb3RDb2xvcj86IChkYXRhUG9pbnQ6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFJlbmRlcnMgYWRkaXRpb25hbCBjb250ZW50IGZvciBkb3RzIGluIGEgbGluZSBjaGFydC5cclxuICAgKiBUYWtlcyBgKHt4LCB5LCBpbmRleH0pYCBhcyBhcmd1bWVudHMuXHJcbiAgICovXHJcbiAgcmVuZGVyRG90Q29udGVudD86IChwYXJhbXM6IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIGluZGV4OiBudW1iZXI7XHJcbiAgICBpbmRleERhdGE6IG51bWJlcjtcclxuICB9KSA9PiBSZWFjdC5SZWFjdE5vZGU7XHJcbiAgLyoqXHJcbiAgICogUm90YXRpb24gYW5nbGUgb2YgdGhlIGhvcml6b250YWwgbGFiZWxzIC0gZGVmYXVsdCAwIChkZWdyZWVzKS5cclxuICAgKi9cclxuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBSb3RhdGlvbiBhbmdsZSBvZiB0aGUgdmVydGljYWwgbGFiZWxzIC0gZGVmYXVsdCAwIChkZWdyZWVzKS5cclxuICAgKi9cclxuICB2ZXJ0aWNhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogT2Zmc2V0IGZvciBZIGF4aXMgbGFiZWxzLlxyXG4gICAqL1xyXG4gIHlMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogT2Zmc2V0IGZvciBYIGF4aXMgbGFiZWxzLlxyXG4gICAqL1xyXG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogQXJyYXkgb2YgaW5kaWNlcyBvZiB0aGUgZGF0YSBwb2ludHMgeW91IGRvbid0IHdhbnQgdG8gZGlzcGxheS5cclxuICAgKi9cclxuICBoaWRlUG9pbnRzQXRJbmRleD86IG51bWJlcltdO1xyXG4gIC8qKlxyXG4gICAqIFRoaXMgZnVuY3Rpb24gY2hhbmdlIHRoZSBmb3JtYXQgb2YgdGhlIGRpc3BsYXkgdmFsdWUgb2YgdGhlIFkgbGFiZWwuXHJcbiAgICogVGFrZXMgdGhlIHkgdmFsdWUgYXMgYXJndW1lbnQgYW5kIHNob3VsZCByZXR1cm4gdGhlIGRlc2lyYWJsZSBzdHJpbmcuXHJcbiAgICovXHJcbiAgZm9ybWF0WUxhYmVsPzogKHlWYWx1ZTogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBjaGFuZ2UgdGhlIGZvcm1hdCBvZiB0aGUgZGlzcGxheSB2YWx1ZSBvZiB0aGUgWCBsYWJlbC5cclxuICAgKiBUYWtlcyB0aGUgWCB2YWx1ZSBhcyBhcmd1bWVudCBhbmQgc2hvdWxkIHJldHVybiB0aGUgZGVzaXJhYmxlIHN0cmluZy5cclxuICAgKi9cclxuICBmb3JtYXRYTGFiZWw/OiAoeFZhbHVlOiBzdHJpbmcpID0+IHN0cmluZztcclxuICAvKipcclxuICAgKiBQcm92aWRlIHByb3BzIGZvciBhIGRhdGEgcG9pbnQgZG90LlxyXG4gICAqL1xyXG4gIGdldERvdFByb3BzPzogKGRhdGFQb2ludDogYW55LCBpbmRleDogbnVtYmVyKSA9PiBvYmplY3Q7XHJcbiAgLyoqXHJcbiAgICogVGhlIG51bWJlciBvZiBob3Jpem9udGFsIGxpbmVzXHJcbiAgICovXHJcbiAgc2VnbWVudHM/OiBudW1iZXI7XHJcbn1cclxuXHJcbnR5cGUgTGluZUNoYXJ0U3RhdGUgPSB7XHJcbiAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IEFuaW1hdGVkLlZhbHVlO1xyXG59O1xyXG5cclxuY2xhc3MgTGluZUNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxMaW5lQ2hhcnRQcm9wcywgTGluZUNoYXJ0U3RhdGU+IHtcclxuICBsYWJlbCA9IFJlYWN0LmNyZWF0ZVJlZjxUZXh0SW5wdXQ+KCk7XHJcblxyXG4gIHN0YXRlID0ge1xyXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IG5ldyBBbmltYXRlZC5WYWx1ZSgwKVxyXG4gIH07XHJcblxyXG4gIGdldENvbG9yID0gKGRhdGFzZXQ6IERhdGFzZXQsIG9wYWNpdHk6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIChkYXRhc2V0LmNvbG9yIHx8IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IpKG9wYWNpdHkpO1xyXG4gIH07XHJcblxyXG4gIGdldFN0cm9rZVdpZHRoID0gKGRhdGFzZXQ6IERhdGFzZXQpID0+IHtcclxuICAgIHJldHVybiBkYXRhc2V0LnN0cm9rZVdpZHRoIHx8IHRoaXMucHJvcHMuY2hhcnRDb25maWcuc3Ryb2tlV2lkdGggfHwgMztcclxuICB9O1xyXG5cclxuICBnZXREYXRhcyA9IChkYXRhOiBEYXRhc2V0W10pOiBudW1iZXJbXSA9PiB7XHJcbiAgICByZXR1cm4gZGF0YS5yZWR1Y2UoXHJcbiAgICAgIChhY2MsIGl0ZW0pID0+IChpdGVtLmRhdGEgPyBbLi4uYWNjLCAuLi5pdGVtLmRhdGFdIDogYWNjKSxcclxuICAgICAgW11cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgZ2V0UHJvcHNGb3JEb3RzID0gKHg6IGFueSwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCB7IGdldERvdFByb3BzLCBjaGFydENvbmZpZyB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBpZiAodHlwZW9mIGdldERvdFByb3BzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgcmV0dXJuIGdldERvdFByb3BzKHgsIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgcHJvcHNGb3JEb3RzID0ge30gfSA9IGNoYXJ0Q29uZmlnO1xyXG5cclxuICAgIHJldHVybiB7IHI6IFwiNFwiLCAuLi5wcm9wc0ZvckRvdHMgfTtcclxuICB9O1xyXG5cclxuICByZW5kZXJEb3RzID0gKHtcclxuICAgIGRhdGEsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBvbkRhdGFQb2ludENsaWNrXHJcbiAgfTogUGljazxcclxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcclxuICA+ICYge1xyXG4gICAgb25EYXRhUG9pbnRDbGljazogTGluZUNoYXJ0UHJvcHNbXCJvbkRhdGFQb2ludENsaWNrXCJdO1xyXG4gIH0pID0+IHtcclxuICAgIGNvbnN0IG91dHB1dDogUmVhY3ROb2RlW10gPSBbXTtcclxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcclxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xyXG5cclxuICAgIGNvbnN0IHtcclxuICAgICAgZ2V0RG90Q29sb3IsXHJcbiAgICAgIGhpZGVQb2ludHNBdEluZGV4ID0gW10sXHJcbiAgICAgIHJlbmRlckRvdENvbnRlbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaChkYXRhc2V0ID0+IHtcclxuICAgICAgaWYgKGRhdGFzZXQud2l0aERvdHMgPT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgIGRhdGFzZXQuZGF0YS5mb3JFYWNoKCh4LCBpKSA9PiB7XHJcbiAgICAgICAgaWYgKGhpZGVQb2ludHNBdEluZGV4LmluY2x1ZGVzKGkpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjeCA9XHJcbiAgICAgICAgICBwYWRkaW5nUmlnaHQgKyAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aDtcclxuXHJcbiAgICAgICAgY29uc3QgY3kgPVxyXG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXHJcbiAgICAgICAgICBwYWRkaW5nVG9wO1xyXG5cclxuICAgICAgICBjb25zdCBvblByZXNzID0gKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCFvbkRhdGFQb2ludENsaWNrIHx8IGhpZGVQb2ludHNBdEluZGV4LmluY2x1ZGVzKGkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvbkRhdGFQb2ludENsaWNrKHtcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIHZhbHVlOiB4LFxyXG4gICAgICAgICAgICBkYXRhc2V0LFxyXG4gICAgICAgICAgICB4OiBjeCxcclxuICAgICAgICAgICAgeTogY3ksXHJcbiAgICAgICAgICAgIGdldENvbG9yOiBvcGFjaXR5ID0+IHRoaXMuZ2V0Q29sb3IoZGF0YXNldCwgb3BhY2l0eSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG91dHB1dC5wdXNoKFxyXG4gICAgICAgICAgPENpcmNsZVxyXG4gICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICAgIGN4PXtjeH1cclxuICAgICAgICAgICAgY3k9e2N5fVxyXG4gICAgICAgICAgICBmaWxsPXtcclxuICAgICAgICAgICAgICB0eXBlb2YgZ2V0RG90Q29sb3IgPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgPyBnZXREb3RDb2xvcih4LCBpKVxyXG4gICAgICAgICAgICAgICAgOiB0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuOSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvblByZXNzPXtvblByZXNzfVxyXG4gICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckRvdHMoeCwgaSl9XHJcbiAgICAgICAgICAvPixcclxuICAgICAgICAgIDxDaXJjbGVcclxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgICBjeD17Y3h9XHJcbiAgICAgICAgICAgIGN5PXtjeX1cclxuICAgICAgICAgICAgcj1cIjE0XCJcclxuICAgICAgICAgICAgZmlsbD1cIiNmZmZcIlxyXG4gICAgICAgICAgICBmaWxsT3BhY2l0eT17MH1cclxuICAgICAgICAgICAgb25QcmVzcz17b25QcmVzc31cclxuICAgICAgICAgIC8+LFxyXG4gICAgICAgICAgcmVuZGVyRG90Q29udGVudCh7IHg6IGN4LCB5OiBjeSwgaW5kZXg6IGksIGluZGV4RGF0YTogeCB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxuICB9O1xyXG5cclxuICByZW5kZXJTY3JvbGxhYmxlRG90ID0gKHtcclxuICAgIGRhdGEsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldCxcclxuICAgIHNjcm9sbGFibGVEb3RGaWxsLFxyXG4gICAgc2Nyb2xsYWJsZURvdFN0cm9rZUNvbG9yLFxyXG4gICAgc2Nyb2xsYWJsZURvdFN0cm9rZVdpZHRoLFxyXG4gICAgc2Nyb2xsYWJsZURvdFJhZGl1cyxcclxuICAgIHNjcm9sbGFibGVJbmZvVmlld1N0eWxlLFxyXG4gICAgc2Nyb2xsYWJsZUluZm9UZXh0U3R5bGUsXHJcbiAgICBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IgPSB4ID0+IGAke3h9YCxcclxuICAgIHNjcm9sbGFibGVJbmZvU2l6ZSxcclxuICAgIHNjcm9sbGFibGVJbmZvT2Zmc2V0XHJcbiAgfTogQWJzdHJhY3RDaGFydENvbmZpZyAmIHtcclxuICAgIG9uRGF0YVBvaW50Q2xpY2s6IExpbmVDaGFydFByb3BzW1wib25EYXRhUG9pbnRDbGlja1wiXTtcclxuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0OiBBbmltYXRlZC5WYWx1ZTtcclxuICB9KSA9PiB7XHJcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcclxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcclxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xyXG5cclxuICAgIGxldCB2bDogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdCBwZXJEYXRhID0gd2lkdGggLyBkYXRhWzBdLmRhdGEubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGFbMF0uZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgdmwucHVzaChpbmRleCAqIHBlckRhdGEpO1xyXG4gICAgfVxyXG4gICAgbGV0IGxhc3RJbmRleDogbnVtYmVyO1xyXG5cclxuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmFkZExpc3RlbmVyKHZhbHVlID0+IHtcclxuICAgICAgY29uc3QgaW5kZXggPSB2YWx1ZS52YWx1ZSAvIHBlckRhdGE7XHJcbiAgICAgIGlmICghbGFzdEluZGV4KSB7XHJcbiAgICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBhYnMgPSBNYXRoLmZsb29yKGluZGV4KTtcclxuICAgICAgbGV0IHBlcmNlbnQgPSBpbmRleCAtIGFicztcclxuICAgICAgYWJzID0gZGF0YVswXS5kYXRhLmxlbmd0aCAtIGFicyAtIDE7XHJcblxyXG4gICAgICBpZiAoaW5kZXggPj0gZGF0YVswXS5kYXRhLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xyXG4gICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKE1hdGguZmxvb3IoZGF0YVswXS5kYXRhWzBdKSlcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcclxuICAgICAgICAgIC8vIHRvIHJpZ2h0XHJcblxyXG4gICAgICAgICAgY29uc3QgYmFzZSA9IGRhdGFbMF0uZGF0YVthYnNdO1xyXG4gICAgICAgICAgY29uc3QgcHJldiA9IGRhdGFbMF0uZGF0YVthYnMgLSAxXTtcclxuICAgICAgICAgIGlmIChwcmV2ID4gYmFzZSkge1xyXG4gICAgICAgICAgICBsZXQgcmVzdCA9IHByZXYgLSBiYXNlO1xyXG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xyXG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSArIHBlcmNlbnQgKiByZXN0KVxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmVzdCA9IGJhc2UgLSBwcmV2O1xyXG4gICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xyXG4gICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoYmFzZSAtIHBlcmNlbnQgKiByZXN0KVxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIHRvIGxlZnRcclxuXHJcbiAgICAgICAgICBjb25zdCBiYXNlID0gZGF0YVswXS5kYXRhW2FicyAtIDFdO1xyXG4gICAgICAgICAgY29uc3QgbmV4dCA9IGRhdGFbMF0uZGF0YVthYnNdO1xyXG4gICAgICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xyXG4gICAgICAgICAgaWYgKG5leHQgPiBiYXNlKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN0ID0gbmV4dCAtIGJhc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XHJcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlICsgcGVyY2VudCAqIHJlc3QpXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByZXN0ID0gYmFzZSAtIG5leHQ7XHJcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XHJcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlIC0gcGVyY2VudCAqIHJlc3QpXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkYXRhLmZvckVhY2goZGF0YXNldCA9PiB7XHJcbiAgICAgIGlmIChkYXRhc2V0LndpdGhTY3JvbGxhYmxlRG90ID09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBwZXJEYXRhID0gd2lkdGggLyBkYXRhc2V0LmRhdGEubGVuZ3RoO1xyXG4gICAgICBsZXQgdmFsdWVzID0gW107XHJcbiAgICAgIGxldCB5VmFsdWVzID0gW107XHJcbiAgICAgIGxldCB4VmFsdWVzID0gW107XHJcblxyXG4gICAgICBsZXQgeVZhbHVlc0xhYmVsID0gW107XHJcbiAgICAgIGxldCB4VmFsdWVzTGFiZWwgPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBkYXRhc2V0LmRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgdmFsdWVzLnB1c2goaW5kZXggKiBwZXJEYXRhKTtcclxuICAgICAgICBjb25zdCB5dmFsID1cclxuICAgICAgICAgICgoYmFzZUhlaWdodCAtXHJcbiAgICAgICAgICAgIHRoaXMuY2FsY0hlaWdodChcclxuICAgICAgICAgICAgICBkYXRhc2V0LmRhdGFbZGF0YXNldC5kYXRhLmxlbmd0aCAtIGluZGV4IC0gMV0sXHJcbiAgICAgICAgICAgICAgZGF0YXMsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0XHJcbiAgICAgICAgICAgICkpIC9cclxuICAgICAgICAgICAgNCkgKlxyXG4gICAgICAgICAgICAzICtcclxuICAgICAgICAgIHBhZGRpbmdUb3A7XHJcbiAgICAgICAgeVZhbHVlcy5wdXNoKHl2YWwpO1xyXG4gICAgICAgIGNvbnN0IHh2YWwgPVxyXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcclxuICAgICAgICAgICgoZGF0YXNldC5kYXRhLmxlbmd0aCAtIGluZGV4IC0gMSkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvXHJcbiAgICAgICAgICAgIGRhdGFzZXQuZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgeFZhbHVlcy5wdXNoKHh2YWwpO1xyXG5cclxuICAgICAgICB5VmFsdWVzTGFiZWwucHVzaChcclxuICAgICAgICAgIHl2YWwgLSAoc2Nyb2xsYWJsZUluZm9TaXplLmhlaWdodCArIHNjcm9sbGFibGVJbmZvT2Zmc2V0KVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgeFZhbHVlc0xhYmVsLnB1c2goeHZhbCAtIHNjcm9sbGFibGVJbmZvU2l6ZS53aWR0aCAvIDIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB0cmFuc2xhdGVYID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xyXG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcclxuICAgICAgICBvdXRwdXRSYW5nZTogeFZhbHVlcyxcclxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNsYXRlWSA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcclxuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXHJcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHlWYWx1ZXMsXHJcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGxhYmVsVHJhbnNsYXRlWCA9IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LmludGVycG9sYXRlKHtcclxuICAgICAgICBpbnB1dFJhbmdlOiB2YWx1ZXMsXHJcbiAgICAgICAgb3V0cHV0UmFuZ2U6IHhWYWx1ZXNMYWJlbCxcclxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgbGFiZWxUcmFuc2xhdGVZID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xyXG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcclxuICAgICAgICBvdXRwdXRSYW5nZTogeVZhbHVlc0xhYmVsLFxyXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBvdXRwdXQucHVzaChbXHJcbiAgICAgICAgPEFuaW1hdGVkLlZpZXdcclxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgIHN0eWxlPXtbXHJcbiAgICAgICAgICAgIHNjcm9sbGFibGVJbmZvVmlld1N0eWxlLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRyYW5zbGF0ZVg6IGxhYmVsVHJhbnNsYXRlWCB9LFxyXG4gICAgICAgICAgICAgICAgeyB0cmFuc2xhdGVZOiBsYWJlbFRyYW5zbGF0ZVkgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IHNjcm9sbGFibGVJbmZvU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgICBoZWlnaHQ6IHNjcm9sbGFibGVJbmZvU2l6ZS5oZWlnaHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICAgIG9uTGF5b3V0PXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvcihcclxuICAgICAgICAgICAgICAgICAgTWF0aC5mbG9vcihkYXRhWzBdLmRhdGFbZGF0YVswXS5kYXRhLmxlbmd0aCAtIDFdKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBzdHlsZT17c2Nyb2xsYWJsZUluZm9UZXh0U3R5bGV9XHJcbiAgICAgICAgICAgIHJlZj17dGhpcy5sYWJlbH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9BbmltYXRlZC5WaWV3PixcclxuICAgICAgICA8QW5pbWF0ZWRDaXJjbGVcclxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgIGN4PXt0cmFuc2xhdGVYfVxyXG4gICAgICAgICAgY3k9e3RyYW5zbGF0ZVl9XHJcbiAgICAgICAgICByPXtzY3JvbGxhYmxlRG90UmFkaXVzfVxyXG4gICAgICAgICAgc3Ryb2tlPXtzY3JvbGxhYmxlRG90U3Ryb2tlQ29sb3J9XHJcbiAgICAgICAgICBzdHJva2VXaWR0aD17c2Nyb2xsYWJsZURvdFN0cm9rZVdpZHRofVxyXG4gICAgICAgICAgZmlsbD17c2Nyb2xsYWJsZURvdEZpbGx9XHJcbiAgICAgICAgLz5cclxuICAgICAgXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG4gIH07XHJcblxyXG4gIHJlbmRlclNoYWRvdyA9ICh7XHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBkYXRhLFxyXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldFxyXG4gIH06IFBpY2s8XHJcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXHJcbiAgPiAmIHtcclxuICAgIHVzZUNvbG9yRnJvbURhdGFzZXQ6IEFic3RyYWN0Q2hhcnRDb25maWdbXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJdO1xyXG4gIH0pID0+IHtcclxuICAgIGlmICh0aGlzLnByb3BzLmJlemllcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJCZXppZXJTaGFkb3coe1xyXG4gICAgICAgIHdpZHRoLFxyXG4gICAgICAgIGhlaWdodCxcclxuICAgICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxQb2x5Z29uXHJcbiAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgcG9pbnRzPXtcclxuICAgICAgICAgICAgZGF0YXNldC5kYXRhXHJcbiAgICAgICAgICAgICAgLm1hcCgoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9XHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodCArXHJcbiAgICAgICAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPVxyXG4gICAgICAgICAgICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoZCwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAuam9pbihcIiBcIikgK1xyXG4gICAgICAgICAgICBgICR7cGFkZGluZ1JpZ2h0ICtcclxuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICpcclxuICAgICAgICAgICAgICAgIChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMSl9LCR7KGhlaWdodCAvIDQpICogMyArXHJcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcH0gJHtwYWRkaW5nUmlnaHR9LCR7KGhlaWdodCAvIDQpICogMyArIHBhZGRpbmdUb3B9YFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZmlsbD17YHVybCgjZmlsbFNoYWRvd0dyYWRpZW50JHtcclxuICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldCA/IGBfJHtpbmRleH1gIDogXCJcIlxyXG4gICAgICAgICAgfSlgfVxyXG4gICAgICAgICAgc3Ryb2tlV2lkdGg9ezB9XHJcbiAgICAgICAgLz5cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlckxpbmUgPSAoe1xyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBwYWRkaW5nVG9wLFxyXG4gICAgZGF0YSxcclxuICAgIGxpbmVqb2luVHlwZVxyXG4gIH06IFBpY2s8XHJcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gICAgXCJkYXRhXCIgfCBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJsaW5lam9pblR5cGVcIlxyXG4gID4pID0+IHtcclxuICAgIGlmICh0aGlzLnByb3BzLmJlemllcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJCZXppZXJMaW5lKHtcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHdpZHRoLFxyXG4gICAgICAgIGhlaWdodCxcclxuICAgICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgICAgcGFkZGluZ1RvcFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvdXRwdXQgPSBbXTtcclxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcclxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xyXG5cclxuICAgIGxldCBsYXN0UG9pbnQ6IHN0cmluZztcclxuXHJcbiAgICBkYXRhLmZvckVhY2goKGRhdGFzZXQsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHBvaW50cyA9IGRhdGFzZXQuZGF0YS5tYXAoKGQsIGkpID0+IHtcclxuICAgICAgICBpZiAoZCA9PT0gbnVsbCkgcmV0dXJuIGxhc3RQb2ludDtcclxuICAgICAgICBjb25zdCB4ID1cclxuICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhc2V0LmRhdGEubGVuZ3RoICsgcGFkZGluZ1JpZ2h0O1xyXG4gICAgICAgIGNvbnN0IHkgPVxyXG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC0gdGhpcy5jYWxjSGVpZ2h0KGQsIGRhdGFzLCBoZWlnaHQpKSAvIDQpICogMyArXHJcbiAgICAgICAgICBwYWRkaW5nVG9wO1xyXG4gICAgICAgIGxhc3RQb2ludCA9IGAke3h9LCR7eX1gO1xyXG4gICAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBvdXRwdXQucHVzaChcclxuICAgICAgICA8UG9seWxpbmVcclxuICAgICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgICBzdHJva2VMaW5lam9pbj17bGluZWpvaW5UeXBlfVxyXG4gICAgICAgICAgcG9pbnRzPXtwb2ludHMuam9pbihcIiBcIil9XHJcbiAgICAgICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cclxuICAgICAgICAgIHN0cm9rZVdpZHRoPXt0aGlzLmdldFN0cm9rZVdpZHRoKGRhdGFzZXQpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG4gIH07XHJcblxyXG4gIGdldEJlemllckxpbmVQb2ludHMgPSAoXHJcbiAgICBkYXRhc2V0OiBEYXRhc2V0LFxyXG4gICAge1xyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgIHBhZGRpbmdUb3AsXHJcbiAgICAgIGRhdGFcclxuICAgIH06IFBpY2s8XHJcbiAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImRhdGFcIlxyXG4gICAgPlxyXG4gICkgPT4ge1xyXG4gICAgaWYgKGRhdGFzZXQuZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIFwiTTAsMFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcclxuXHJcbiAgICBjb25zdCB4ID0gKGk6IG51bWJlcikgPT5cclxuICAgICAgTWF0aC5mbG9vcihcclxuICAgICAgICBwYWRkaW5nUmlnaHQgKyAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YXNldC5kYXRhLmxlbmd0aFxyXG4gICAgICApO1xyXG5cclxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGFzLCBoZWlnaHQpO1xyXG5cclxuICAgIGNvbnN0IHkgPSAoaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IHlIZWlnaHQgPSB0aGlzLmNhbGNIZWlnaHQoZGF0YXNldC5kYXRhW2ldLCBkYXRhcywgaGVpZ2h0KTtcclxuXHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKCgoYmFzZUhlaWdodCAtIHlIZWlnaHQpIC8gNCkgKiAzICsgcGFkZGluZ1RvcCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBbYE0ke3goMCl9LCR7eSgwKX1gXVxyXG4gICAgICAuY29uY2F0KFxyXG4gICAgICAgIGRhdGFzZXQuZGF0YS5zbGljZSgwLCAtMSkubWFwKChfLCBpKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB4X21pZCA9ICh4KGkpICsgeChpICsgMSkpIC8gMjtcclxuICAgICAgICAgIGNvbnN0IHlfbWlkID0gKHkoaSkgKyB5KGkgKyAxKSkgLyAyO1xyXG4gICAgICAgICAgY29uc3QgY3BfeDEgPSAoeF9taWQgKyB4KGkpKSAvIDI7XHJcbiAgICAgICAgICBjb25zdCBjcF94MiA9ICh4X21pZCArIHgoaSArIDEpKSAvIDI7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBgUSAke2NwX3gxfSwgJHt5KGkpfSwgJHt4X21pZH0sICR7eV9taWR9YCArXHJcbiAgICAgICAgICAgIGAgUSAke2NwX3gyfSwgJHt5KGkgKyAxKX0sICR7eChpICsgMSl9LCAke3koaSArIDEpfWBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSlcclxuICAgICAgKVxyXG4gICAgICAuam9pbihcIiBcIik7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyQmV6aWVyTGluZSA9ICh7XHJcbiAgICBkYXRhLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBwYWRkaW5nVG9wXHJcbiAgfTogUGljazxcclxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcclxuICA+KSA9PiB7XHJcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZ2V0QmV6aWVyTGluZVBvaW50cyhkYXRhc2V0LCB7XHJcbiAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgIHBhZGRpbmdSaWdodCxcclxuICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgIGRhdGFcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxQYXRoXHJcbiAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgZD17cmVzdWx0fVxyXG4gICAgICAgICAgZmlsbD1cIm5vbmVcIlxyXG4gICAgICAgICAgc3Ryb2tlPXt0aGlzLmdldENvbG9yKGRhdGFzZXQsIDAuMil9XHJcbiAgICAgICAgICBzdHJva2VXaWR0aD17dGhpcy5nZXRTdHJva2VXaWR0aChkYXRhc2V0KX1cclxuICAgICAgICAvPlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyQmV6aWVyU2hhZG93ID0gKHtcclxuICAgIHdpZHRoLFxyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIGRhdGEsXHJcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XHJcbiAgfTogUGljazxcclxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcclxuICA+ICYge1xyXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XHJcbiAgfSkgPT5cclxuICAgIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBkID1cclxuICAgICAgICB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xyXG4gICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgICAgZGF0YVxyXG4gICAgICAgIH0pICtcclxuICAgICAgICBgIEwke3BhZGRpbmdSaWdodCArXHJcbiAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICpcclxuICAgICAgICAgICAgKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKX0sJHsoaGVpZ2h0IC8gNCkgKiAzICtcclxuICAgICAgICAgIHBhZGRpbmdUb3B9IEwke3BhZGRpbmdSaWdodH0sJHsoaGVpZ2h0IC8gNCkgKiAzICsgcGFkZGluZ1RvcH0gWmA7XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxQYXRoXHJcbiAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgZD17ZH1cclxuICAgICAgICAgIGZpbGw9e2B1cmwoI2ZpbGxTaGFkb3dHcmFkaWVudCR7XHJcbiAgICAgICAgICAgIHVzZUNvbG9yRnJvbURhdGFzZXQgPyBgXyR7aW5kZXh9YCA6IFwiXCJcclxuICAgICAgICAgIH0pYH1cclxuICAgICAgICAgIHN0cm9rZVdpZHRoPXswfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgcmVuZGVyTGVnZW5kID0gKHdpZHRoLCBsZWdlbmRPZmZzZXQpID0+IHtcclxuICAgIGNvbnN0IHsgbGVnZW5kLCBkYXRhc2V0cyB9ID0gdGhpcy5wcm9wcy5kYXRhO1xyXG4gICAgY29uc3QgYmFzZUxlZ2VuZEl0ZW1YID0gd2lkdGggLyAobGVnZW5kLmxlbmd0aCArIDEpO1xyXG5cclxuICAgIHJldHVybiBsZWdlbmQubWFwKChsZWdlbmRJdGVtLCBpKSA9PiAoXHJcbiAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XHJcbiAgICAgICAgPExlZ2VuZEl0ZW1cclxuICAgICAgICAgIGluZGV4PXtpfVxyXG4gICAgICAgICAgaWNvbkNvbG9yPXt0aGlzLmdldENvbG9yKGRhdGFzZXRzW2ldLCAwLjkpfVxyXG4gICAgICAgICAgYmFzZUxlZ2VuZEl0ZW1YPXtiYXNlTGVnZW5kSXRlbVh9XHJcbiAgICAgICAgICBsZWdlbmRUZXh0PXtsZWdlbmRJdGVtfVxyXG4gICAgICAgICAgbGFiZWxQcm9wcz17eyAuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCkgfX1cclxuICAgICAgICAgIGxlZ2VuZE9mZnNldD17bGVnZW5kT2Zmc2V0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvRz5cclxuICAgICkpO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgZGF0YSxcclxuICAgICAgd2l0aFNjcm9sbGFibGVEb3QgPSBmYWxzZSxcclxuICAgICAgd2l0aFNoYWRvdyA9IHRydWUsXHJcbiAgICAgIHdpdGhEb3RzID0gdHJ1ZSxcclxuICAgICAgd2l0aElubmVyTGluZXMgPSB0cnVlLFxyXG4gICAgICB3aXRoT3V0ZXJMaW5lcyA9IHRydWUsXHJcbiAgICAgIHdpdGhIb3Jpem9udGFsTGluZXMgPSB0cnVlLFxyXG4gICAgICB3aXRoVmVydGljYWxMaW5lcyA9IHRydWUsXHJcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcclxuICAgICAgd2l0aFZlcnRpY2FsTGFiZWxzID0gdHJ1ZSxcclxuICAgICAgc3R5bGUgPSB7fSxcclxuICAgICAgZGVjb3JhdG9yLFxyXG4gICAgICBvbkRhdGFQb2ludENsaWNrLFxyXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24gPSAwLFxyXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbiA9IDAsXHJcbiAgICAgIGZvcm1hdFlMYWJlbCA9IHlMYWJlbCA9PiB5TGFiZWwsXHJcbiAgICAgIGZvcm1hdFhMYWJlbCA9IHhMYWJlbCA9PiB4TGFiZWwsXHJcbiAgICAgIHNlZ21lbnRzLFxyXG4gICAgICB0cmFuc3BhcmVudCA9IGZhbHNlLFxyXG4gICAgICBjaGFydENvbmZpZ1xyXG4gICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgY29uc3QgeyBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgIGNvbnN0IHsgbGFiZWxzID0gW10gfSA9IGRhdGE7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGJvcmRlclJhZGl1cyA9IDAsXHJcbiAgICAgIHBhZGRpbmdUb3AgPSAxNixcclxuICAgICAgcGFkZGluZ1JpZ2h0ID0gNjQsXHJcbiAgICAgIG1hcmdpbiA9IDAsXHJcbiAgICAgIG1hcmdpblJpZ2h0ID0gMCxcclxuICAgICAgcGFkZGluZ0JvdHRvbSA9IDBcclxuICAgIH0gPSBzdHlsZTtcclxuXHJcbiAgICBjb25zdCBjb25maWcgPSB7XHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbixcclxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb25cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEuZGF0YXNldHMpO1xyXG5cclxuICAgIGxldCBjb3VudCA9IE1hdGgubWluKC4uLmRhdGFzKSA9PT0gTWF0aC5tYXgoLi4uZGF0YXMpID8gMSA6IDQ7XHJcbiAgICBpZiAoc2VnbWVudHMpIHtcclxuICAgICAgY291bnQgPSBzZWdtZW50cztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZWdlbmRPZmZzZXQgPSB0aGlzLnByb3BzLmRhdGEubGVnZW5kID8gaGVpZ2h0ICogMC4xNSA6IDA7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPFZpZXcgc3R5bGU9e3N0eWxlfT5cclxuICAgICAgICA8U3ZnXHJcbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodCArIChwYWRkaW5nQm90dG9tIGFzIG51bWJlcikgKyBsZWdlbmRPZmZzZXR9XHJcbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcil9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFJlY3RcclxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHQgKyBsZWdlbmRPZmZzZXR9XHJcbiAgICAgICAgICAgIHJ4PXtib3JkZXJSYWRpdXN9XHJcbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XHJcbiAgICAgICAgICAgIGZpbGw9XCJ1cmwoI2JhY2tncm91bmRHcmFkaWVudClcIlxyXG4gICAgICAgICAgICBmaWxsT3BhY2l0eT17dHJhbnNwYXJlbnQgPyAwIDogMX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICB7dGhpcy5wcm9wcy5kYXRhLmxlZ2VuZCAmJlxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckxlZ2VuZChjb25maWcud2lkdGgsIGxlZ2VuZE9mZnNldCl9XHJcbiAgICAgICAgICA8RyB4PVwiMFwiIHk9e2xlZ2VuZE9mZnNldH0+XHJcbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xyXG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAgICB7d2l0aEhvcml6b250YWxMaW5lcyAmJlxyXG4gICAgICAgICAgICAgICAgKHdpdGhJbm5lckxpbmVzXHJcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IGNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIDogd2l0aE91dGVyTGluZXNcclxuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckhvcml6b250YWxMaW5lKHtcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExhYmVscyAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJIb3Jpem9udGFsTGFiZWxzKHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFzLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBmb3JtYXRZTGFiZWwsXHJcbiAgICAgICAgICAgICAgICAgIGRlY2ltYWxQbGFjZXM6IGNoYXJ0Q29uZmlnLmRlY2ltYWxQbGFjZXNcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMaW5lcyAmJlxyXG4gICAgICAgICAgICAgICAgKHdpdGhJbm5lckxpbmVzXHJcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExpbmVzKHtcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgOiB3aXRoT3V0ZXJMaW5lc1xyXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyVmVydGljYWxMaW5lKHtcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgOiBudWxsKX1cclxuICAgICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAgICB7d2l0aFZlcnRpY2FsTGFiZWxzICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclZlcnRpY2FsTGFiZWxzKHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbHMsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIGZvcm1hdFhMYWJlbFxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyTGluZSh7XHJcbiAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1xyXG4gICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHt3aXRoU2hhZG93ICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNoYWRvdyh7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldDogY2hhcnRDb25maWcudXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldFxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3dpdGhEb3RzICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckRvdHMoe1xyXG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHMsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIG9uRGF0YVBvaW50Q2xpY2tcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTY3JvbGxhYmxlRG90KHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAuLi5jaGFydENvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGljayxcclxuICAgICAgICAgICAgICAgICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXRcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHtkZWNvcmF0b3IgJiZcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvcih7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgPC9HPlxyXG4gICAgICAgIDwvU3ZnPlxyXG4gICAgICAgIHt3aXRoU2Nyb2xsYWJsZURvdCAmJiAoXHJcbiAgICAgICAgICA8U2Nyb2xsVmlld1xyXG4gICAgICAgICAgICBzdHlsZT17U3R5bGVTaGVldC5hYnNvbHV0ZUZpbGx9XHJcbiAgICAgICAgICAgIGNvbnRlbnRDb250YWluZXJTdHlsZT17eyB3aWR0aDogd2lkdGggKiAyIH19XHJcbiAgICAgICAgICAgIHNob3dzSG9yaXpvbnRhbFNjcm9sbEluZGljYXRvcj17ZmFsc2V9XHJcbiAgICAgICAgICAgIHNjcm9sbEV2ZW50VGhyb3R0bGU9ezE2fVxyXG4gICAgICAgICAgICBvblNjcm9sbD17QW5pbWF0ZWQuZXZlbnQoW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hdGl2ZUV2ZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRPZmZzZXQ6IHsgeDogc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSl9XHJcbiAgICAgICAgICAgIGhvcml6b250YWxcclxuICAgICAgICAgICAgYm91bmNlcz17ZmFsc2V9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvVmlldz5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lQ2hhcnQ7XHJcbiJdfQ==
