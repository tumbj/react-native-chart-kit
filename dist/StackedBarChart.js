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
import { G, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var StackedBarChart = /** @class */ (function(_super) {
  __extends(StackedBarChart, _super);
  function StackedBarChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.getBarPercentage = function() {
      var _a = _this.props.chartConfig.barPercentage,
        barPercentage = _a === void 0 ? 1 : _a;
      return barPercentage;
    };
    _this.getBarRadius = function(ret, x) {
      return _this.props.chartConfig.barRadius && ret.length === x.length - 1
        ? _this.props.chartConfig.barRadius
        : 0;
    };
    _this.renderBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        border = _a.border,
        colors = _a.colors,
        _b = _a.stackedBar,
        stackedBar = _b === void 0 ? false : _b;
      return data.map(function(x, i) {
        var barWidth = 32 * _this.getBarPercentage();
        var ret = [];
        var h = 0;
        var st = paddingTop;
        var fac = 1;
        if (stackedBar) {
          fac = 0.7;
        }
        var sum = _this.props.percentile
          ? x.reduce(function(a, b) {
              return a + b;
            }, 0)
          : border;
        var barsAreaHeight = (height / 4) * 3;
        for (var z = 0; z < x.length; z++) {
          h = barsAreaHeight * (x[z] / sum);
          var y = barsAreaHeight - h + st;
          var xC =
            (paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2) *
            fac;
          ret.push(
            <Rect
              key={Math.random()}
              x={xC}
              y={y}
              rx={_this.getBarRadius(ret, x)}
              ry={_this.getBarRadius(ret, x)}
              width={barWidth}
              height={h}
              fill={colors[z]}
            />
          );
          if (!_this.props.hideLegend) {
            ret.push(
              <Text
                key={Math.random()}
                x={xC + 7 + barWidth / 2}
                textAnchor="end"
                y={h > 15 ? y + 15 : y + 7}
                {..._this.getPropsForLabels()}
              >
                {x[z]}
              </Text>
            );
          }
          st -= h;
        }
        return ret;
      });
    };
    _this.renderLegend = function(_a) {
      var legend = _a.legend,
        colors = _a.colors,
        width = _a.width,
        height = _a.height;
      return legend.map(function(x, i) {
        return (
          <G key={Math.random()}>
            <Rect
              width="16px"
              height="16px"
              fill={colors[i]}
              rx={8}
              ry={8}
              x={width * 0.71}
              y={height * 0.7 - i * 50}
            />
            <Text
              x={width * 0.78}
              y={height * 0.76 - i * 50}
              {..._this.getPropsForLabels()}
            >
              {x}
            </Text>
          </G>
        );
      });
    };
    return _this;
  }
  StackedBarChart.prototype.render = function() {
    var paddingTop = 15;
    var paddingRight = 50;
    var barWidth = 32 * this.getBarPercentage();
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      _b = _a.style,
      style = _b === void 0 ? {} : _b,
      data = _a.data,
      _c = _a.withHorizontalLabels,
      withHorizontalLabels = _c === void 0 ? true : _c,
      _d = _a.withVerticalLabels,
      withVerticalLabels = _d === void 0 ? true : _d,
      _e = _a.segments,
      segments = _e === void 0 ? 4 : _e,
      decimalPlaces = _a.decimalPlaces,
      _f = _a.percentile,
      percentile = _f === void 0 ? false : _f;
    var _g = style.borderRadius,
      borderRadius = _g === void 0 ? 0 : _g;
    var config = {
      width: width,
      height: height
    };
    var border = 0;
    var max = 0;
    for (var i = 0; i < data.data.length; i++) {
      var actual = data.data[i].reduce(function(pv, cv) {
        return pv + cv;
      }, 0);
      if (actual > max) {
        max = actual;
      }
    }
    if (percentile) {
      border = 100;
    } else {
      border = max;
    }
    var stackedBar = data.legend && data.legend.length == 0 ? false : true;
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs(
            __assign(__assign({}, config), this.props.chartConfig)
          )}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines(
              __assign(__assign({}, config), {
                count: segments,
                paddingTop: paddingTop
              })
            )}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: segments,
                    data: [0, border],
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    decimalPlaces: decimalPlaces
                  })
                )
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: data.labels,
                    paddingRight: paddingRight + 28,
                    stackedBar: stackedBar,
                    paddingTop: paddingTop,
                    horizontalOffset: barWidth
                  })
                )
              : null}
          </G>
          <G>
            {this.renderBars(
              __assign(__assign({}, config), {
                data: data.data,
                border: border,
                colors: this.props.data.barColors,
                paddingTop: paddingTop,
                paddingRight: paddingRight + 20,
                stackedBar: stackedBar
              })
            )}
          </G>
          {data.legend &&
            data.legend.length != 0 &&
            this.renderLegend(
              __assign(__assign({}, config), {
                legend: data.legend,
                colors: this.props.data.barColors
              })
            )}
        </Svg>
      </View>
    );
  };
  return StackedBarChart;
})(AbstractChart);
export default StackedBarChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2tlZEJhckNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N0YWNrZWRCYXJDaGFydC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxJQUFJLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXRELE9BQU8sYUFHTixNQUFNLGlCQUFpQixDQUFDO0FBK0N6QjtJQUE4QixtQ0FHN0I7SUFIRDtRQUFBLHFFQWtPQztRQTlOQyxzQkFBZ0IsR0FBRztZQUNULElBQUEsS0FBc0IsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLGNBQTNCLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxLQUFBLENBQTRCO1lBQ3JELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUVGLGtCQUFZLEdBQUcsVUFBQyxHQUFtQixFQUFFLENBQWlCO1lBQ3BELE9BQU8sS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNwRSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQztRQUVGLGdCQUFVLEdBQUcsVUFBQyxFQWdCYjtnQkFmQyxJQUFJLFVBQUEsRUFDSixLQUFLLFdBQUEsRUFDTCxNQUFNLFlBQUEsRUFDTixVQUFVLGdCQUFBLEVBQ1YsWUFBWSxrQkFBQSxFQUNaLE1BQU0sWUFBQSxFQUNOLE1BQU0sWUFBQSxFQUNOLGtCQUFrQixFQUFsQixVQUFVLG1CQUFHLEtBQUssS0FBQTtZQVNs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RUFDbkIsWUFBWSxFQUFFLFlBQVksR0FBRyxFQUFFLEVBQy9CLFVBQVUsWUFBQTtnQkFDVixVQUFVLFlBQUEsRUFDVixnQkFBZ0IsRUFBRSxRQUFRLElBQzFCO1lBQ0osQ0FBQyxDQUFDLElBQUksQ0FDVjtVQUFBLEVBQUUsQ0FBQyxDQUNIO1VBQUEsQ0FBQyxDQUFDLENBQ0E7WUFBQSxDQUFDLElBQUksQ0FBQyxVQUFVLHVCQUNYLE1BQU0sS0FDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFDZixNQUFNLFFBQUEsRUFDTixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUNqQyxVQUFVLFlBQUEsRUFDVixZQUFZLEVBQUUsWUFBWSxHQUFHLEVBQUUsRUFDL0IsVUFBVSxZQUFBLElBQ1YsQ0FDSjtVQUFBLEVBQUUsQ0FBQyxDQUNIO1VBQUEsQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLFlBQVksdUJBQ1osTUFBTSxLQUNULE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUNuQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUNqQyxDQUNOO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBbE9ELENBQThCLGFBQWEsR0FrTzFDO0FBRUQsZUFBZSxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcclxuaW1wb3J0IHsgRywgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcclxuXHJcbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7XHJcbiAgQWJzdHJhY3RDaGFydENvbmZpZyxcclxuICBBYnN0cmFjdENoYXJ0UHJvcHNcclxufSBmcm9tIFwiLi9BYnN0cmFjdENoYXJ0XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrZWRCYXJDaGFydERhdGEge1xyXG4gIGxhYmVsczogc3RyaW5nW107XHJcbiAgbGVnZW5kOiBzdHJpbmdbXTtcclxuICBkYXRhOiBudW1iZXJbXVtdO1xyXG4gIGJhckNvbG9yczogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tlZEJhckNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xyXG4gIC8qKlxyXG4gICAqIEUuZy5cclxuICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICogY29uc3QgZGF0YSA9IHtcclxuICAgKiAgIGxhYmVsczogW1wiVGVzdDFcIiwgXCJUZXN0MlwiXSxcclxuICAgKiAgIGxlZ2VuZDogW1wiTDFcIiwgXCJMMlwiLCBcIkwzXCJdLFxyXG4gICAqICAgZGF0YTogW1s2MCwgNjAsIDYwXSwgWzMwLCAzMCwgNjBdXSxcclxuICAgKiAgIGJhckNvbG9yczogW1wiI2RmZTRlYVwiLCBcIiNjZWQ2ZTBcIiwgXCIjYTRiMGJlXCJdXHJcbiAgICogfTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBkYXRhOiBTdGFja2VkQmFyQ2hhcnREYXRhO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgY2hhcnRDb25maWc6IEFic3RyYWN0Q2hhcnRDb25maWc7XHJcbiAgaGlkZUxlZ2VuZDogYm9vbGVhbjtcclxuICBzdHlsZT86IFBhcnRpYWw8Vmlld1N0eWxlPjtcclxuICBiYXJQZXJjZW50YWdlPzogbnVtYmVyO1xyXG4gIGRlY2ltYWxQbGFjZXM/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogU2hvdyB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0OiBUcnVlLlxyXG4gICAqL1xyXG4gIHdpdGhWZXJ0aWNhbExhYmVscz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aEhvcml6b250YWxMYWJlbHM/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFRoZSBudW1iZXIgb2YgaG9yaXpvbnRhbCBsaW5lc1xyXG4gICAqL1xyXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xyXG5cclxuICBwZXJjZW50aWxlPzogYm9vbGVhbjtcclxufVxyXG5cclxudHlwZSBTdGFja2VkQmFyQ2hhcnRTdGF0ZSA9IHt9O1xyXG5cclxuY2xhc3MgU3RhY2tlZEJhckNoYXJ0IGV4dGVuZHMgQWJzdHJhY3RDaGFydDxcclxuICBTdGFja2VkQmFyQ2hhcnRQcm9wcyxcclxuICBTdGFja2VkQmFyQ2hhcnRTdGF0ZVxyXG4+IHtcclxuICBnZXRCYXJQZXJjZW50YWdlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgeyBiYXJQZXJjZW50YWdlID0gMSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcclxuICAgIHJldHVybiBiYXJQZXJjZW50YWdlO1xyXG4gIH07XHJcblxyXG4gIGdldEJhclJhZGl1cyA9IChyZXQ6IHN0cmluZyB8IGFueVtdLCB4OiBzdHJpbmcgfCBhbnlbXSkgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hhcnRDb25maWcuYmFyUmFkaXVzICYmIHJldC5sZW5ndGggPT09IHgubGVuZ3RoIC0gMVxyXG4gICAgICA/IHRoaXMucHJvcHMuY2hhcnRDb25maWcuYmFyUmFkaXVzXHJcbiAgICAgIDogMDtcclxuICB9O1xyXG5cclxuICByZW5kZXJCYXJzID0gKHtcclxuICAgIGRhdGEsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBib3JkZXIsXHJcbiAgICBjb2xvcnMsXHJcbiAgICBzdGFja2VkQmFyID0gZmFsc2VcclxuICB9OiBQaWNrPFxyXG4gICAgT21pdDxBYnN0cmFjdENoYXJ0Q29uZmlnLCBcImRhdGFcIj4sXHJcbiAgICBcIndpZHRoXCIgfCBcImhlaWdodFwiIHwgXCJwYWRkaW5nUmlnaHRcIiB8IFwicGFkZGluZ1RvcFwiIHwgXCJzdGFja2VkQmFyXCJcclxuICA+ICYge1xyXG4gICAgYm9yZGVyOiBudW1iZXI7XHJcbiAgICBjb2xvcnM6IHN0cmluZ1tdO1xyXG4gICAgZGF0YTogbnVtYmVyW11bXTtcclxuICB9KSA9PlxyXG4gICAgZGF0YS5tYXAoKHgsIGkpID0+IHtcclxuICAgICAgY29uc3QgYmFyV2lkdGggPSAzMiAqIHRoaXMuZ2V0QmFyUGVyY2VudGFnZSgpO1xyXG4gICAgICBjb25zdCByZXQgPSBbXTtcclxuICAgICAgbGV0IGggPSAwO1xyXG4gICAgICBsZXQgc3QgPSBwYWRkaW5nVG9wO1xyXG5cclxuICAgICAgbGV0IGZhYyA9IDE7XHJcbiAgICAgIGlmIChzdGFja2VkQmFyKSB7XHJcbiAgICAgICAgZmFjID0gMC43O1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHN1bSA9IHRoaXMucHJvcHMucGVyY2VudGlsZSA/IHgucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgOiBib3JkZXI7XHJcbiAgICAgIGNvbnN0IGJhcnNBcmVhSGVpZ2h0ID0gKGhlaWdodCAvIDQpICogMztcclxuICAgICAgZm9yIChsZXQgeiA9IDA7IHogPCB4Lmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgaCA9IGJhcnNBcmVhSGVpZ2h0ICogKHhbel0gLyBzdW0pO1xyXG4gICAgICAgIGNvbnN0IHkgPSBiYXJzQXJlYUhlaWdodCAtIGggKyBzdDtcclxuICAgICAgICBjb25zdCB4QyA9XHJcbiAgICAgICAgICAocGFkZGluZ1JpZ2h0ICtcclxuICAgICAgICAgICAgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGEubGVuZ3RoICtcclxuICAgICAgICAgICAgYmFyV2lkdGggLyAyKSAqXHJcbiAgICAgICAgICBmYWM7XHJcblxyXG4gICAgICAgIHJldC5wdXNoKFxyXG4gICAgICAgICAgPFJlY3RcclxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgICB4PXt4Q31cclxuICAgICAgICAgICAgeT17eX1cclxuICAgICAgICAgICAgcng9e3RoaXMuZ2V0QmFyUmFkaXVzKHJldCwgeCl9XHJcbiAgICAgICAgICAgIHJ5PXt0aGlzLmdldEJhclJhZGl1cyhyZXQsIHgpfVxyXG4gICAgICAgICAgICB3aWR0aD17YmFyV2lkdGh9XHJcbiAgICAgICAgICAgIGhlaWdodD17aH1cclxuICAgICAgICAgICAgZmlsbD17Y29sb3JzW3pdfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMucHJvcHMuaGlkZUxlZ2VuZCkge1xyXG4gICAgICAgICAgcmV0LnB1c2goXHJcbiAgICAgICAgICAgIDxUZXh0XHJcbiAgICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgICAgIHg9e3hDICsgNyArIGJhcldpZHRoIC8gMn1cclxuICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCJcclxuICAgICAgICAgICAgICB5PXtoID4gMTUgPyB5ICsgMTUgOiB5ICsgN31cclxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge3hbel19XHJcbiAgICAgICAgICAgIDwvVGV4dD5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdCAtPSBoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmV0O1xyXG4gICAgfSk7XHJcblxyXG4gIHJlbmRlckxlZ2VuZCA9ICh7XHJcbiAgICBsZWdlbmQsXHJcbiAgICBjb2xvcnMsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodFxyXG4gIH06IFBpY2s8QWJzdHJhY3RDaGFydENvbmZpZywgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIj4gJiB7XHJcbiAgICBsZWdlbmQ6IHN0cmluZ1tdO1xyXG4gICAgY29sb3JzOiBzdHJpbmdbXTtcclxuICB9KSA9PlxyXG4gICAgbGVnZW5kLm1hcCgoeCwgaSkgPT4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XHJcbiAgICAgICAgICA8UmVjdFxyXG4gICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxyXG4gICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcclxuICAgICAgICAgICAgZmlsbD17Y29sb3JzW2ldfVxyXG4gICAgICAgICAgICByeD17OH1cclxuICAgICAgICAgICAgcnk9ezh9XHJcbiAgICAgICAgICAgIHg9e3dpZHRoICogMC43MX1cclxuICAgICAgICAgICAgeT17aGVpZ2h0ICogMC43IC0gaSAqIDUwfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxUZXh0XHJcbiAgICAgICAgICAgIHg9e3dpZHRoICogMC43OH1cclxuICAgICAgICAgICAgeT17aGVpZ2h0ICogMC43NiAtIGkgKiA1MH1cclxuICAgICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge3h9XHJcbiAgICAgICAgICA8L1RleHQ+XHJcbiAgICAgICAgPC9HPlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHBhZGRpbmdUb3AgPSAxNTtcclxuICAgIGNvbnN0IHBhZGRpbmdSaWdodCA9IDUwO1xyXG4gICAgY29uc3QgYmFyV2lkdGggPSAzMiAqIHRoaXMuZ2V0QmFyUGVyY2VudGFnZSgpO1xyXG5cclxuICAgIGNvbnN0IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgc3R5bGUgPSB7fSxcclxuICAgICAgZGF0YSxcclxuICAgICAgd2l0aEhvcml6b250YWxMYWJlbHMgPSB0cnVlLFxyXG4gICAgICB3aXRoVmVydGljYWxMYWJlbHMgPSB0cnVlLFxyXG4gICAgICBzZWdtZW50cyA9IDQsXHJcbiAgICAgIGRlY2ltYWxQbGFjZXMsXHJcbiAgICAgIHBlcmNlbnRpbGUgPSBmYWxzZVxyXG4gICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcclxuICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodFxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgYm9yZGVyID0gMDtcclxuXHJcbiAgICBsZXQgbWF4ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGFjdHVhbCA9IGRhdGEuZGF0YVtpXS5yZWR1Y2UoKHB2LCBjdikgPT4gcHYgKyBjdiwgMCk7XHJcbiAgICAgIGlmIChhY3R1YWwgPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBhY3R1YWw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocGVyY2VudGlsZSkge1xyXG4gICAgICBib3JkZXIgPSAxMDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBib3JkZXIgPSBtYXg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHN0YWNrZWRCYXIgPSBkYXRhLmxlZ2VuZCAmJiBkYXRhLmxlZ2VuZC5sZW5ndGggPT0gMCA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8VmlldyBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgIDxTdmcgaGVpZ2h0PXtoZWlnaHR9IHdpZHRoPXt3aWR0aH0+XHJcbiAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcclxuICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXHJcbiAgICAgICAgICB9KX1cclxuICAgICAgICAgIDxSZWN0XHJcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXHJcbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxyXG4gICAgICAgICAgICByeT17Ym9yZGVyUmFkaXVzfVxyXG4gICAgICAgICAgICBmaWxsPVwidXJsKCNiYWNrZ3JvdW5kR3JhZGllbnQpXCJcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAge3RoaXMucmVuZGVySG9yaXpvbnRhbExpbmVzKHtcclxuICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgY291bnQ6IHNlZ21lbnRzLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3BcclxuICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAge3dpdGhIb3Jpem9udGFsTGFiZWxzXHJcbiAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckhvcml6b250YWxMYWJlbHMoe1xyXG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgIGNvdW50OiBzZWdtZW50cyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogWzAsIGJvcmRlcl0sXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3AsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodCxcclxuICAgICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlc1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAge3dpdGhWZXJ0aWNhbExhYmVsc1xyXG4gICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExhYmVscyh7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgbGFiZWxzOiBkYXRhLmxhYmVscyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgKyAyOCxcclxuICAgICAgICAgICAgICAgICAgc3RhY2tlZEJhcixcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbE9mZnNldDogYmFyV2lkdGhcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgOiBudWxsfVxyXG4gICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckJhcnMoe1xyXG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEsXHJcbiAgICAgICAgICAgICAgYm9yZGVyLFxyXG4gICAgICAgICAgICAgIGNvbG9yczogdGhpcy5wcm9wcy5kYXRhLmJhckNvbG9ycyxcclxuICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0ICsgMjAsXHJcbiAgICAgICAgICAgICAgc3RhY2tlZEJhclxyXG4gICAgICAgICAgICB9KX1cclxuICAgICAgICAgIDwvRz5cclxuICAgICAgICAgIHtkYXRhLmxlZ2VuZCAmJlxyXG4gICAgICAgICAgICBkYXRhLmxlZ2VuZC5sZW5ndGggIT0gMCAmJlxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckxlZ2VuZCh7XHJcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDogZGF0YS5sZWdlbmQsXHJcbiAgICAgICAgICAgICAgY29sb3JzOiB0aGlzLnByb3BzLmRhdGEuYmFyQ29sb3JzXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvU3ZnPlxyXG4gICAgICA8L1ZpZXc+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3RhY2tlZEJhckNoYXJ0O1xyXG4iXX0=
