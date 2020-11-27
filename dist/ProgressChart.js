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
import Pie from "paths-js/pie";
import React from "react";
import { View } from "react-native";
import { Defs, G, Path, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var ProgressChart = /** @class */ (function(_super) {
  __extends(ProgressChart, _super);
  function ProgressChart() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  ProgressChart.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      style = _a.style,
      data = _a.data,
      hideLegend = _a.hideLegend,
      strokeWidth = _a.strokeWidth,
      radius = _a.radius;
    var _b = style.borderRadius,
      borderRadius = _b === void 0 ? 0 : _b,
      _c = style.margin,
      margin = _c === void 0 ? 0 : _c,
      _d = style.marginRight,
      marginRight = _d === void 0 ? 0 : _d;
    if (Array.isArray(data)) {
      data = {
        data: data
      };
    }
    var pies = data.data.map(function(pieData, i) {
      var r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      return Pie({
        r: r,
        R: r,
        center: [0, 0],
        data: [pieData, 1 - pieData],
        accessor: function(x) {
          return x;
        }
      });
    });
    var pieBackgrounds = data.data.map(function(pieData, i) {
      var r =
        ((height / 2 - 32) /
          (Array.isArray(data) ? data.length : data.data.length)) *
          i +
        radius;
      return Pie({
        r: r,
        R: r,
        center: [0, 0],
        data: [0.999, 0.001],
        accessor: function(x) {
          return x;
        }
      });
    });
    var withLabel = function(i) {
      return data.labels && data.labels[i];
    };
    var withColor = function(i) {
      return data.colors && data.colors[i];
    };
    var legend = !hideLegend && (
      <>
        <G>
          {pies.map(function(_, i) {
            return (
              <Rect
                key={Math.random()}
                width="16px"
                height="16px"
                fill={_this.props.chartConfig.color(0.2 * (i + 1), i)}
                rx={8}
                ry={8}
                x={_this.props.width / 2.5 - 24}
                y={
                  -(_this.props.height / 2.5) +
                  ((_this.props.height * 0.8) /
                    (Array.isArray(data) ? data.length : data.data.length)) *
                    i +
                  12
                }
              />
            );
          })}
        </G>
        <G>
          {pies.map(function(_, i) {
            return (
              <Text
                key={Math.random()}
                x={_this.props.width / 2.5}
                y={
                  -(_this.props.height / 2.5) +
                  ((_this.props.height * 0.8) /
                    (Array.isArray(data) ? data.length : data.data.length)) *
                    i +
                  12 * 2
                }
                {..._this.getPropsForLabels()}
              >
                {withLabel(i)
                  ? data.labels[i] + " " + Math.round(100 * data.data[i]) + "%"
                  : Math.round(100 * data.data[i]) + "%"}
              </Text>
            );
          })}
        </G>
      </>
    );
    return (
      <View
        style={__assign({ width: width, height: height, padding: 0 }, style)}
      >
        <Svg width={width - margin * 2 - marginRight} height={height}>
          {this.renderDefs(
            __assign(
              { width: this.props.height, height: this.props.height },
              this.props.chartConfig
            )
          )}
          <Defs>{data.gradientColors}</Defs>
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
              {pieBackgrounds.map(function(pie, i) {
                return (
                  <Path
                    key={Math.random()}
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={strokeWidth}
                    stroke={_this.props.chartConfig.color(0.2, i)}
                  />
                );
              })}
            </G>
            <G>
              {pies.map(function(pie, i) {
                return (
                  <Path
                    key={Math.random()}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={strokeWidth}
                    stroke={
                      _this.props.withCustomBarColorFromData
                        ? withColor(i)
                        : _this.props.chartConfig.color(
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
  };
  ProgressChart.defaultProps = { style: {}, strokeWidth: 16, radius: 32 };
  return ProgressChart;
})(AbstractChart);
export default ProgressChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3NDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9ncmVzc0NoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDL0IsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxJQUFJLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFbEUsT0FBTyxhQUdOLE1BQU0saUJBQWlCLENBQUM7QUErQnpCO0lBQTRCLGlDQUczQjtJQUhEOztJQXlMQSxDQUFDO0lBbkxDLDhCQUFNLEdBQU47UUFBQSxpQkFrTEM7UUFqTEssSUFBQSxLQVFBLElBQUksQ0FBQyxLQUFLLEVBUFosS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sS0FBSyxXQUFBLEVBQ0wsSUFBSSxVQUFBLEVBQ0osVUFBVSxnQkFBQSxFQUNWLFdBQVcsaUJBQUEsRUFDWCxNQUFNLFlBQ00sQ0FBQztRQUVQLElBQUEsS0FBa0QsS0FBSyxhQUF2QyxFQUFoQixZQUFZLG1CQUFHLENBQUMsS0FBQSxFQUFFLEtBQWdDLEtBQUssT0FBM0IsRUFBVixNQUFNLG1CQUFHLENBQUMsS0FBQSxFQUFFLEtBQW9CLEtBQUssWUFBVixFQUFmLFdBQVcsbUJBQUcsQ0FBQyxLQUFBLENBQVc7UUFFaEUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRztnQkFDTCxJQUFJLE1BQUE7YUFDTCxDQUFDO1NBQ0g7UUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BD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SyxDQUMxQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFDN0IsQ0FBQyxDQUNGLENBQ04sRUFDRCxDQUNILENBQUM7UUFDSixDQUFDLENBQUMsQ0FDSjtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxNQUFNLENBQ1Q7VUFBQSxFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQXBMYSwwQkFBWSxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQXFMMUUsb0JBQUM7Q0FBQSxBQXpMRCxDQUE0QixhQUFhLEdBeUx4QztBQUVELGVBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBpZSBmcm9tIFwicGF0aHMtanMvcGllXCI7XHJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgVmlldywgVmlld1N0eWxlIH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xyXG5pbXBvcnQgeyBEZWZzLCBHLCBQYXRoLCBSZWN0LCBTdmcsIFRleHQgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xyXG5cclxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHtcclxuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gIEFic3RyYWN0Q2hhcnRQcm9wc1xyXG59IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFByb2dyZXNzQ2hhcnREYXRhID1cclxuICB8IEFycmF5PG51bWJlcj5cclxuICB8IHtcclxuICAgICAgbGFiZWxzPzogQXJyYXk8c3RyaW5nPjtcclxuICAgICAgY29sb3JzPzogQXJyYXk8c3RyaW5nPjtcclxuICAgICAgZ3JhZGllbnRDb2xvcnM/OiBBcnJheTxFbGVtZW50PjtcclxuICAgICAgZGF0YTogQXJyYXk8bnVtYmVyPjtcclxuICAgIH07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XHJcbiAgZGF0YTogUHJvZ3Jlc3NDaGFydERhdGE7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxuICBhY2Nlc3Nvcjogc3RyaW5nO1xyXG4gIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XHJcbiAgY2VudGVyPzogQXJyYXk8bnVtYmVyPjtcclxuICBhYnNvbHV0ZT86IGJvb2xlYW47XHJcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcclxuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcclxuICBjaGFydENvbmZpZz86IEFic3RyYWN0Q2hhcnRDb25maWc7XHJcbiAgaGlkZUxlZ2VuZD86IGJvb2xlYW47XHJcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XHJcbiAgcmFkaXVzPzogbnVtYmVyO1xyXG4gIHdpdGhDdXN0b21CYXJDb2xvckZyb21EYXRhPzogYm9vbGVhbjtcclxufVxyXG5cclxudHlwZSBQcm9ncmVzc0NoYXJ0U3RhdGUgPSB7fTtcclxuXHJcbmNsYXNzIFByb2dyZXNzQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFxyXG4gIFByb2dyZXNzQ2hhcnRQcm9wcyxcclxuICBQcm9ncmVzc0NoYXJ0U3RhdGVcclxuPiB7XHJcbiAgcHVibGljIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7IHN0eWxlOiB7fSwgc3Ryb2tlV2lkdGg6IDE2LCByYWRpdXM6IDMyIH07XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCB7XHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIHN0eWxlLFxyXG4gICAgICBkYXRhLFxyXG4gICAgICBoaWRlTGVnZW5kLFxyXG4gICAgICBzdHJva2VXaWR0aCxcclxuICAgICAgcmFkaXVzXHJcbiAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBjb25zdCB7IGJvcmRlclJhZGl1cyA9IDAsIG1hcmdpbiA9IDAsIG1hcmdpblJpZ2h0ID0gMCB9ID0gc3R5bGU7XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgZGF0YSA9IHtcclxuICAgICAgICBkYXRhXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGllcyA9IGRhdGEuZGF0YS5tYXAoKHBpZURhdGEsIGkpID0+IHtcclxuICAgICAgY29uc3QgciA9XHJcbiAgICAgICAgKChoZWlnaHQgLyAyIC0gMzIpIC9cclxuICAgICAgICAgIChBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5sZW5ndGggOiBkYXRhLmRhdGEubGVuZ3RoKSkgKlxyXG4gICAgICAgICAgaSArXHJcbiAgICAgICAgcmFkaXVzO1xyXG5cclxuICAgICAgcmV0dXJuIFBpZSh7XHJcbiAgICAgICAgcixcclxuICAgICAgICBSOiByLFxyXG4gICAgICAgIGNlbnRlcjogWzAsIDBdLFxyXG4gICAgICAgIGRhdGE6IFtwaWVEYXRhLCAxIC0gcGllRGF0YV0sXHJcbiAgICAgICAgYWNjZXNzb3IoeDogc3RyaW5nKSB7XHJcbiAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGllQmFja2dyb3VuZHMgPSBkYXRhLmRhdGEubWFwKChwaWVEYXRhLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHIgPVxyXG4gICAgICAgICgoaGVpZ2h0IC8gMiAtIDMyKSAvXHJcbiAgICAgICAgICAoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubGVuZ3RoIDogZGF0YS5kYXRhLmxlbmd0aCkpICpcclxuICAgICAgICAgIGkgK1xyXG4gICAgICAgIHJhZGl1cztcclxuICAgICAgcmV0dXJuIFBpZSh7XHJcbiAgICAgICAgcixcclxuICAgICAgICBSOiByLFxyXG4gICAgICAgIGNlbnRlcjogWzAsIDBdLFxyXG4gICAgICAgIGRhdGE6IFswLjk5OSwgMC4wMDFdLFxyXG4gICAgICAgIGFjY2Vzc29yKHg6IHN0cmluZykge1xyXG4gICAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHdpdGhMYWJlbCA9IChpOiBudW1iZXIpID0+XHJcbiAgICAgIChkYXRhIGFzIGFueSkubGFiZWxzICYmIChkYXRhIGFzIGFueSkubGFiZWxzW2ldO1xyXG5cclxuICAgIGNvbnN0IHdpdGhDb2xvciA9IChpOiBudW1iZXIpID0+XHJcbiAgICAgIChkYXRhIGFzIGFueSkuY29sb3JzICYmIChkYXRhIGFzIGFueSkuY29sb3JzW2ldO1xyXG5cclxuICAgIGNvbnN0IGxlZ2VuZCA9ICFoaWRlTGVnZW5kICYmIChcclxuICAgICAgPD5cclxuICAgICAgICA8Rz5cclxuICAgICAgICAgIHtwaWVzLm1hcCgoXywgaSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxSZWN0XHJcbiAgICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTZweFwiXHJcbiAgICAgICAgICAgICAgICBmaWxsPXt0aGlzLnByb3BzLmNoYXJ0Q29uZmlnLmNvbG9yKDAuMiAqIChpICsgMSksIGkpfVxyXG4gICAgICAgICAgICAgICAgcng9ezh9XHJcbiAgICAgICAgICAgICAgICByeT17OH1cclxuICAgICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjUgLSAyNH1cclxuICAgICAgICAgICAgICAgIHk9e1xyXG4gICAgICAgICAgICAgICAgICAtKHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41KSArXHJcbiAgICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC9cclxuICAgICAgICAgICAgICAgICAgICAoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubGVuZ3RoIDogZGF0YS5kYXRhLmxlbmd0aCkpICpcclxuICAgICAgICAgICAgICAgICAgICBpICtcclxuICAgICAgICAgICAgICAgICAgMTJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9HPlxyXG4gICAgICAgIDxHPlxyXG4gICAgICAgICAge3BpZXMubWFwKChfLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgPFRleHRcclxuICAgICAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjV9XHJcbiAgICAgICAgICAgICAgICB5PXtcclxuICAgICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xyXG4gICAgICAgICAgICAgICAgICAoKHRoaXMucHJvcHMuaGVpZ2h0ICogMC44KSAvXHJcbiAgICAgICAgICAgICAgICAgICAgKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhLmxlbmd0aCA6IGRhdGEuZGF0YS5sZW5ndGgpKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgaSArXHJcbiAgICAgICAgICAgICAgICAgIDEyICogMlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7d2l0aExhYmVsKGkpXHJcbiAgICAgICAgICAgICAgICAgID8gYCR7KGRhdGEgYXMgYW55KS5sYWJlbHNbaV19ICR7TWF0aC5yb3VuZChcclxuICAgICAgICAgICAgICAgICAgICAgIDEwMCAqIChkYXRhIGFzIGFueSkuZGF0YVtpXVxyXG4gICAgICAgICAgICAgICAgICAgICl9JWBcclxuICAgICAgICAgICAgICAgICAgOiBgJHtNYXRoLnJvdW5kKDEwMCAqIChkYXRhIGFzIGFueSkuZGF0YVtpXSl9JWB9XHJcbiAgICAgICAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9HPlxyXG4gICAgICA8Lz5cclxuICAgICk7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8Vmlld1xyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgIHBhZGRpbmc6IDAsXHJcbiAgICAgICAgICAuLi5zdHlsZVxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8U3ZnXHJcbiAgICAgICAgICB3aWR0aD17d2lkdGggLSAobWFyZ2luIGFzIG51bWJlcikgKiAyIC0gKG1hcmdpblJpZ2h0IGFzIG51bWJlcil9XHJcbiAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuaGVpZ2h0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXHJcbiAgICAgICAgICB9KX1cclxuICAgICAgICAgIDxEZWZzPntkYXRhLmdyYWRpZW50Q29sb3JzfTwvRGVmcz5cclxuICAgICAgICAgIDxSZWN0XHJcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXHJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XHJcbiAgICAgICAgICAgIHJ4PXtib3JkZXJSYWRpdXN9XHJcbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XHJcbiAgICAgICAgICAgIGZpbGw9XCJ1cmwoI2JhY2tncm91bmRHcmFkaWVudClcIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxHXHJcbiAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAoaGlkZUxlZ2VuZCA/IDIgOiAyLjUpfVxyXG4gICAgICAgICAgICB5PXt0aGlzLnByb3BzLmhlaWdodCAvIDJ9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHtwaWVCYWNrZ3JvdW5kcy5tYXAoKHBpZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgPFBhdGhcclxuICAgICAgICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgZD17cGllLmN1cnZlc1swXS5zZWN0b3IucGF0aC5wcmludCgpfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH1cclxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3RoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMC4yLCBpKX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3BpZXMubWFwKChwaWUsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgIDxQYXRoXHJcbiAgICAgICAgICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgZD17cGllLmN1cnZlc1swXS5zZWN0b3IucGF0aC5wcmludCgpfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH1cclxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9e1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy53aXRoQ3VzdG9tQmFyQ29sb3JGcm9tRGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHdpdGhDb2xvcihpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaSAvIHBpZXMubGVuZ3RoKSAqIDAuNSArIDAuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgICB7bGVnZW5kfVxyXG4gICAgICAgICAgPC9HPlxyXG4gICAgICAgIDwvU3ZnPlxyXG4gICAgICA8L1ZpZXc+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZ3Jlc3NDaGFydDtcclxuIl19
