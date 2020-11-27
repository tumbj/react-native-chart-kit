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
import React from "react";
import { View } from "react-native";
import {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";
import AbstractChart from "./AbstractChart";
var barWidth = 32;
var BarChart = /** @class */ (function(_super) {
  __extends(BarChart, _super);
  function BarChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.getBarPercentage = function() {
      var _a = _this.props.chartConfig.barPercentage,
        barPercentage = _a === void 0 ? 1 : _a;
      return barPercentage;
    };
    _this.renderBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        barRadius = _a.barRadius,
        withCustomBarColorFromData = _a.withCustomBarColorFromData;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        return (
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2
            }
            y={
              ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
              paddingTop
            }
            rx={barRadius}
            width={barWidth}
            height={(Math.abs(barHeight) / 4) * 3}
            fill={
              withCustomBarColorFromData
                ? "url(#customColor_0_" + i + ")"
                : "url(#fillShadowGradient)"
            }
          />
        );
      });
    };
    _this.renderBarTops = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
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
            fill={_this.props.chartConfig.color(0.6)}
          />
        );
      });
    };
    _this.renderColors = function(_a) {
      var data = _a.data,
        flatColor = _a.flatColor;
      return data.map(function(dataset, index) {
        var _a;
        return (
          <Defs>
            {(_a = dataset.colors) === null || _a === void 0
              ? void 0
              : _a.map(function(color, colorIndex) {
                  var highOpacityColor = color(1.0);
                  var lowOpacityColor = color(0.1);
                  return (
                    <LinearGradient
                      id={"customColor_" + index + "_" + colorIndex}
                      key={index + "_" + colorIndex}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <Stop
                        offset="0"
                        stopColor={highOpacityColor}
                        stopOpacity="1"
                      />
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
        );
      });
    };
    _this.renderValuesOnTopOfBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight;
      var baseHeight = _this.calcBaseHeight(data, height);
      return data.map(function(x, i) {
        var barHeight = _this.calcHeight(x, data, height);
        var barWidth = 32 * _this.getBarPercentage();
        return (
          <Text
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 1
            }
            y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
            fill={_this.props.chartConfig.color(0.6)}
            fontSize="12"
            textAnchor="middle"
          >
            {data[i]}
          </Text>
        );
      });
    };
    return _this;
  }
  BarChart.prototype.render = function() {
    var _a;
    var _b = this.props,
      width = _b.width,
      height = _b.height,
      data = _b.data,
      _c = _b.style,
      style = _c === void 0 ? {} : _c,
      _d = _b.withHorizontalLabels,
      withHorizontalLabels = _d === void 0 ? true : _d,
      _e = _b.withVerticalLabels,
      withVerticalLabels = _e === void 0 ? true : _e,
      _f = _b.verticalLabelRotation,
      verticalLabelRotation = _f === void 0 ? 0 : _f,
      _g = _b.horizontalLabelRotation,
      horizontalLabelRotation = _g === void 0 ? 0 : _g,
      _h = _b.withInnerLines,
      withInnerLines = _h === void 0 ? true : _h,
      _j = _b.showBarTops,
      showBarTops = _j === void 0 ? true : _j,
      _k = _b.withCustomBarColorFromData,
      withCustomBarColorFromData = _k === void 0 ? false : _k,
      _l = _b.showValuesOnTopOfBars,
      showValuesOnTopOfBars = _l === void 0 ? false : _l,
      _m = _b.flatColor,
      flatColor = _m === void 0 ? false : _m,
      _o = _b.segments,
      segments = _o === void 0 ? 4 : _o;
    var _p = style.borderRadius,
      borderRadius = _p === void 0 ? 0 : _p,
      _q = style.paddingTop,
      paddingTop = _q === void 0 ? 16 : _q,
      _r = style.paddingRight,
      paddingRight = _r === void 0 ? 64 : _r;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (_a =
          this.props.chartConfig && this.props.chartConfig.decimalPlaces) !==
          null && _a !== void 0
          ? _a
          : 2,
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
          {this.renderDefs(
            __assign(__assign({}, config), this.props.chartConfig)
          )}
          {this.renderColors(
            __assign(__assign({}, this.props.chartConfig), {
              flatColor: flatColor
            })
          )}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines(
                  __assign(__assign({}, config), {
                    count: segments,
                    paddingTop: paddingTop
                  })
                )
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: segments,
                    data: data.datasets[0].data,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: data.labels,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    horizontalOffset: barWidth * this.getBarPercentage()
                  })
                )
              : null}
          </G>
          <G>
            {this.renderBars(
              __assign(__assign({}, config), {
                data: data.datasets[0].data,
                paddingTop: paddingTop,
                paddingRight: paddingRight,
                withCustomBarColorFromData: withCustomBarColorFromData
              })
            )}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars(
                __assign(__assign({}, config), {
                  data: data.datasets[0].data,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight
                })
              )}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops(
                __assign(__assign({}, config), {
                  data: data.datasets[0].data,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight
                })
              )}
          </G>
        </Svg>
      </View>
    );
  };
  return BarChart;
})(AbstractChart);
export default BarChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFyQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQmFyQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsSUFBSSxFQUFhLE1BQU0sY0FBYyxDQUFDO0FBQy9DLE9BQU8sRUFDTCxJQUFJLEVBQ0osQ0FBQyxFQUNELGNBQWMsRUFDZCxJQUFJLEVBQ0osSUFBSSxFQUNKLEdBQUcsRUFDSCxJQUFJLEVBQ0wsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixPQUFPLGFBR04sTUFBTSxpQkFBaUIsQ0FBQztBQUd6QixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFrQ3BCO0lBQXVCLDRCQUEyQztJQUFsRTtRQUFBLHFFQW9SQztRQW5SQyxzQkFBZ0IsR0FBRztZQUNULElBQUEsS0FBc0IsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLGNBQTNCLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxLQUFBLENBQTRCO1lBQ3JELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUVGLGdCQUFVLEdBQUcsVUFBQyxFQWNiO2dCQWJDLElBQUksVUFBQSxFQUNKLEtBQUssV0FBQSxFQUNMLE1BQU0sWUFBQSxFQUNOLFVBQVUsZ0JBQUEsRUFDVixZQUFZLGtCQUFBLEVBQ1osU0FBUyxlQUFBLEVBQ1QsMEJBQTBCLGdDQUFBO1lBUTFCLElBQU0sVUFBVSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXJELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNuQixJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ25ELElBQU0sUUFBUSxHQUFHLEVBQUUs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LElBQUksRUFDM0IsVUFBVSxFQUFFLFVBQW9CLEVBQ2hDLFlBQVksRUFBRSxZQUFzQixJQUNwQyxDQUNOO1VBQUEsRUFBRSxDQUFDLENBQ0w7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQXBSRCxDQUF1QixhQUFhLEdBb1JuQztBQUVELGVBQWUsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBWaWV3LCBWaWV3U3R5bGUgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XHJcbmltcG9ydCB7XHJcbiAgRGVmcyxcclxuICBHLFxyXG4gIExpbmVhckdyYWRpZW50LFxyXG4gIFJlY3QsXHJcbiAgU3RvcCxcclxuICBTdmcsXHJcbiAgVGV4dFxyXG59IGZyb20gXCJyZWFjdC1uYXRpdmUtc3ZnXCI7XHJcblxyXG5pbXBvcnQgQWJzdHJhY3RDaGFydCwge1xyXG4gIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgQWJzdHJhY3RDaGFydFByb3BzXHJcbn0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xyXG5pbXBvcnQgeyBDaGFydERhdGEgfSBmcm9tIFwiLi9IZWxwZXJUeXBlc1wiO1xyXG5cclxuY29uc3QgYmFyV2lkdGggPSAzMjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmFyQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XHJcbiAgZGF0YTogQ2hhcnREYXRhO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgZnJvbVplcm8/OiBib29sZWFuO1xyXG4gIHdpdGhJbm5lckxpbmVzPzogYm9vbGVhbjtcclxuICB5QXhpc0xhYmVsOiBzdHJpbmc7XHJcbiAgeUF4aXNTdWZmaXg6IHN0cmluZztcclxuICBjaGFydENvbmZpZzogQWJzdHJhY3RDaGFydENvbmZpZztcclxuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcclxuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcclxuICB2ZXJ0aWNhbExhYmVsUm90YXRpb24/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogU2hvdyB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0OiBUcnVlLlxyXG4gICAqL1xyXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aEhvcml6b250YWxMYWJlbHM/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFRoZSBudW1iZXIgb2YgaG9yaXpvbnRhbCBsaW5lc1xyXG4gICAqL1xyXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xyXG4gIHNob3dCYXJUb3BzPzogYm9vbGVhbjtcclxuICBzaG93VmFsdWVzT25Ub3BPZkJhcnM/OiBib29sZWFuO1xyXG4gIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhPzogYm9vbGVhbjtcclxuICBmbGF0Q29sb3I/OiBib29sZWFuO1xyXG59XHJcblxyXG50eXBlIEJhckNoYXJ0U3RhdGUgPSB7fTtcclxuXHJcbmNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxCYXJDaGFydFByb3BzLCBCYXJDaGFydFN0YXRlPiB7XHJcbiAgZ2V0QmFyUGVyY2VudGFnZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHsgYmFyUGVyY2VudGFnZSA9IDEgfSA9IHRoaXMucHJvcHMuY2hhcnRDb25maWc7XHJcbiAgICByZXR1cm4gYmFyUGVyY2VudGFnZTtcclxuICB9O1xyXG5cclxuICByZW5kZXJCYXJzID0gKHtcclxuICAgIGRhdGEsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBiYXJSYWRpdXMsXHJcbiAgICB3aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YVxyXG4gIH06IFBpY2s8XHJcbiAgICBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPixcclxuICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImJhclJhZGl1c1wiXHJcbiAgPiAmIHtcclxuICAgIGRhdGE6IG51bWJlcltdO1xyXG4gICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGE6IGJvb2xlYW47XHJcbiAgfSkgPT4ge1xyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YSwgaGVpZ2h0KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5tYXAoKHgsIGkpID0+IHtcclxuICAgICAgY29uc3QgYmFySGVpZ2h0ID0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGEsIGhlaWdodCk7XHJcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gMzIgKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKTtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8UmVjdFxyXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgeD17XHJcbiAgICAgICAgICAgIHBhZGRpbmdSaWdodCArXHJcbiAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhLmxlbmd0aCArXHJcbiAgICAgICAgICAgIGJhcldpZHRoIC8gMlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeT17XHJcbiAgICAgICAgICAgICgoYmFySGVpZ2h0ID4gMCA/IGJhc2VIZWlnaHQgLSBiYXJIZWlnaHQgOiBiYXNlSGVpZ2h0KSAvIDQpICogMyArXHJcbiAgICAgICAgICAgIHBhZGRpbmdUb3BcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJ4PXtiYXJSYWRpdXN9XHJcbiAgICAgICAgICB3aWR0aD17YmFyV2lkdGh9XHJcbiAgICAgICAgICBoZWlnaHQ9eyhNYXRoLmFicyhiYXJIZWlnaHQpIC8gNCkgKiAzfVxyXG4gICAgICAgICAgZmlsbD17XHJcbiAgICAgICAgICAgIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXHJcbiAgICAgICAgICAgICAgPyBgdXJsKCNjdXN0b21Db2xvcl8wXyR7aX0pYFxyXG4gICAgICAgICAgICAgIDogXCJ1cmwoI2ZpbGxTaGFkb3dHcmFkaWVudClcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZW5kZXJCYXJUb3BzID0gKHtcclxuICAgIGRhdGEsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBwYWRkaW5nUmlnaHRcclxuICB9OiBQaWNrPFxyXG4gICAgT21pdDxBYnN0cmFjdENoYXJ0Q29uZmlnLCBcImRhdGFcIj4sXHJcbiAgICBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiXHJcbiAgPiAmIHtcclxuICAgIGRhdGE6IG51bWJlcltdO1xyXG4gIH0pID0+IHtcclxuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSB0aGlzLmNhbGNCYXNlSGVpZ2h0KGRhdGEsIGhlaWdodCk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGEubWFwKCh4LCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IGJhckhlaWdodCA9IHRoaXMuY2FsY0hlaWdodCh4LCBkYXRhLCBoZWlnaHQpO1xyXG4gICAgICBjb25zdCBiYXJXaWR0aCA9IDMyICogdGhpcy5nZXRCYXJQZXJjZW50YWdlKCk7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFJlY3RcclxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgIHg9e1xyXG4gICAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xyXG4gICAgICAgICAgICAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gZGF0YS5sZW5ndGggK1xyXG4gICAgICAgICAgICBiYXJXaWR0aCAvIDJcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHk9eygoYmFzZUhlaWdodCAtIGJhckhlaWdodCkgLyA0KSAqIDMgKyBwYWRkaW5nVG9wfVxyXG4gICAgICAgICAgd2lkdGg9e2JhcldpZHRofVxyXG4gICAgICAgICAgaGVpZ2h0PXsyfVxyXG4gICAgICAgICAgZmlsbD17dGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjYpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZW5kZXJDb2xvcnMgPSAoe1xyXG4gICAgZGF0YSxcclxuICAgIGZsYXRDb2xvclxyXG4gIH06IFBpY2s8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+ICYge1xyXG4gICAgZmxhdENvbG9yOiBib29sZWFuO1xyXG4gIH0pID0+IHtcclxuICAgIHJldHVybiBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IChcclxuICAgICAgPERlZnM+XHJcbiAgICAgICAge2RhdGFzZXQuY29sb3JzPy5tYXAoKGNvbG9yLCBjb2xvckluZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBoaWdoT3BhY2l0eUNvbG9yID0gY29sb3IoMS4wKTtcclxuICAgICAgICAgIGNvbnN0IGxvd09wYWNpdHlDb2xvciA9IGNvbG9yKDAuMSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPExpbmVhckdyYWRpZW50XHJcbiAgICAgICAgICAgICAgaWQ9e2BjdXN0b21Db2xvcl8ke2luZGV4fV8ke2NvbG9ySW5kZXh9YH1cclxuICAgICAgICAgICAgICBrZXk9e2Ake2luZGV4fV8ke2NvbG9ySW5kZXh9YH1cclxuICAgICAgICAgICAgICB4MT17MH1cclxuICAgICAgICAgICAgICB5MT17MH1cclxuICAgICAgICAgICAgICB4Mj17MH1cclxuICAgICAgICAgICAgICB5Mj17MX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjBcIiBzdG9wQ29sb3I9e2hpZ2hPcGFjaXR5Q29sb3J9IHN0b3BPcGFjaXR5PVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAge2ZsYXRDb2xvciA/IChcclxuICAgICAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjFcIiBzdG9wQ29sb3I9e2hpZ2hPcGFjaXR5Q29sb3J9IHN0b3BPcGFjaXR5PVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxTdG9wIG9mZnNldD1cIjFcIiBzdG9wQ29sb3I9e2xvd09wYWNpdHlDb2xvcn0gc3RvcE9wYWNpdHk9XCIwXCIgLz5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KX1cclxuICAgICAgPC9EZWZzPlxyXG4gICAgKSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyVmFsdWVzT25Ub3BPZkJhcnMgPSAoe1xyXG4gICAgZGF0YSxcclxuICAgIHdpZHRoLFxyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIHBhZGRpbmdSaWdodFxyXG4gIH06IFBpY2s8XHJcbiAgICBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPixcclxuICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcclxuICA+ICYge1xyXG4gICAgZGF0YTogbnVtYmVyW107XHJcbiAgfSkgPT4ge1xyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YSwgaGVpZ2h0KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5tYXAoKHgsIGkpID0+IHtcclxuICAgICAgY29uc3QgYmFySGVpZ2h0ID0gdGhpcy5jYWxjSGVpZ2h0KHgsIGRhdGEsIGhlaWdodCk7XHJcbiAgICAgIGNvbnN0IGJhcldpZHRoID0gMzIgKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKTtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGV4dFxyXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgeD17XHJcbiAgICAgICAgICAgIHBhZGRpbmdSaWdodCArXHJcbiAgICAgICAgICAgIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBkYXRhLmxlbmd0aCArXHJcbiAgICAgICAgICAgIGJhcldpZHRoIC8gMVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgeT17KChiYXNlSGVpZ2h0IC0gYmFySGVpZ2h0KSAvIDQpICogMyArIHBhZGRpbmdUb3AgLSAxfVxyXG4gICAgICAgICAgZmlsbD17dGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjYpfVxyXG4gICAgICAgICAgZm9udFNpemU9XCIxMlwiXHJcbiAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICB7ZGF0YVtpXX1cclxuICAgICAgICA8L1RleHQ+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIHN0eWxlID0ge30sXHJcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcclxuICAgICAgd2l0aFZlcnRpY2FsTGFiZWxzID0gdHJ1ZSxcclxuICAgICAgdmVydGljYWxMYWJlbFJvdGF0aW9uID0gMCxcclxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24gPSAwLFxyXG4gICAgICB3aXRoSW5uZXJMaW5lcyA9IHRydWUsXHJcbiAgICAgIHNob3dCYXJUb3BzID0gdHJ1ZSxcclxuICAgICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGEgPSBmYWxzZSxcclxuICAgICAgc2hvd1ZhbHVlc09uVG9wT2ZCYXJzID0gZmFsc2UsXHJcbiAgICAgIGZsYXRDb2xvciA9IGZhbHNlLFxyXG4gICAgICBzZWdtZW50cyA9IDRcclxuICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCwgcGFkZGluZ1RvcCA9IDE2LCBwYWRkaW5nUmlnaHQgPSA2NCB9ID0gc3R5bGU7XHJcblxyXG4gICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24sXHJcbiAgICAgIGhvcml6b250YWxMYWJlbFJvdGF0aW9uLFxyXG4gICAgICBiYXJSYWRpdXM6XHJcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5iYXJSYWRpdXMpIHx8IDAsXHJcbiAgICAgIGRlY2ltYWxQbGFjZXM6XHJcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5kZWNpbWFsUGxhY2VzKSA/PyAyLFxyXG4gICAgICBmb3JtYXRZTGFiZWw6XHJcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5mb3JtYXRZTGFiZWwpIHx8XHJcbiAgICAgICAgZnVuY3Rpb24obGFiZWwpIHtcclxuICAgICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgICB9LFxyXG4gICAgICBmb3JtYXRYTGFiZWw6XHJcbiAgICAgICAgKHRoaXMucHJvcHMuY2hhcnRDb25maWcgJiYgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5mb3JtYXRYTGFiZWwpIHx8XHJcbiAgICAgICAgZnVuY3Rpb24obGFiZWwpIHtcclxuICAgICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxWaWV3IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgICAgPFN2ZyBoZWlnaHQ9e2hlaWdodH0gd2lkdGg9e3dpZHRofT5cclxuICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xyXG4gICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgICAge3RoaXMucmVuZGVyQ29sb3JzKHtcclxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZyxcclxuICAgICAgICAgICAgZmxhdENvbG9yOiBmbGF0Q29sb3JcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPFJlY3RcclxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XHJcbiAgICAgICAgICAgIHJ4PXtib3JkZXJSYWRpdXN9XHJcbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XHJcbiAgICAgICAgICAgIGZpbGw9XCJ1cmwoI2JhY2tncm91bmRHcmFkaWVudClcIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICB7d2l0aElubmVyTGluZXNcclxuICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmVzKHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBjb3VudDogc2VnbWVudHMsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3BcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgOiBudWxsfVxyXG4gICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExhYmVsc1xyXG4gICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJIb3Jpem9udGFsTGFiZWxzKHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBjb3VudDogc2VnbWVudHMsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlclxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAge3dpdGhWZXJ0aWNhbExhYmVsc1xyXG4gICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExhYmVscyh7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiBkYXRhLmxhYmVscyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbE9mZnNldDogYmFyV2lkdGggKiB0aGlzLmdldEJhclBlcmNlbnRhZ2UoKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAge3RoaXMucmVuZGVyQmFycyh7XHJcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcclxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcclxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgd2l0aEN1c3RvbUJhckNvbG9yRnJvbURhdGE6IHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgIHtzaG93VmFsdWVzT25Ub3BPZkJhcnMgJiZcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlclZhbHVlc09uVG9wT2ZCYXJzKHtcclxuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXHJcbiAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAge3Nob3dCYXJUb3BzICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJCYXJUb3BzKHtcclxuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNbMF0uZGF0YSxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyXHJcbiAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgPC9Tdmc+XHJcbiAgICAgIDwvVmlldz5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYXJDaGFydDtcclxuIl19
