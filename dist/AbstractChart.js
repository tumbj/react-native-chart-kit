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
import React, { Component } from "react";
import { Defs, Line, LinearGradient, Stop, Text } from "react-native-svg";
var AbstractChart = /** @class */ (function(_super) {
  __extends(AbstractChart, _super);
  function AbstractChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.calcScaler = function(data) {
      if (_this.props.fromZero) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [0])) -
            Math.min.apply(Math, __spreadArrays(data, [0])) || 1
        );
      } else {
        return Math.max.apply(Math, data) - Math.min.apply(Math, data) || 1;
      }
    };
    _this.calcBaseHeight = function(data, height) {
      var min = Math.min.apply(Math, data);
      var max = Math.max.apply(Math, data);
      if (min >= 0 && max >= 0) {
        return height;
      } else if (min < 0 && max <= 0) {
        return 0;
      } else if (min < 0 && max > 0) {
        return (height * max) / _this.calcScaler(data);
      }
    };
    _this.calcHeight = function(val, data, height) {
      var max = Math.max.apply(Math, data);
      var min = Math.min.apply(Math, data);
      if (min < 0 && max > 0) {
        return height * (val / _this.calcScaler(data));
      } else if (min >= 0 && max >= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - min) / _this.calcScaler(data));
      } else if (min < 0 && max <= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - max) / _this.calcScaler(data));
      }
    };
    _this.renderHorizontalLines = function(config) {
      var count = config.count,
        width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight;
      var basePosition = height - height / 4;
      return __spreadArrays(new Array(count + 1)).map(function(_, i) {
        var y = (basePosition / count) * i + paddingTop;
        return (
          <Line
            key={Math.random()}
            x1={paddingRight}
            y1={y}
            x2={width}
            y2={y}
            {..._this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    _this.renderHorizontalLine = function(config) {
      var width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight;
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop}
          x2={width}
          y2={height - height / 4 + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderHorizontalLabels = function(config) {
      var count = config.count,
        data = config.data,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.horizontalLabelRotation,
        horizontalLabelRotation = _a === void 0 ? 0 : _a,
        _b = config.decimalPlaces,
        decimalPlaces = _b === void 0 ? 2 : _b,
        _c = config.formatYLabel,
        formatYLabel =
          _c === void 0
            ? function(yLabel) {
                return yLabel;
              }
            : _c;
      var _d = _this.props,
        _e = _d.yAxisLabel,
        yAxisLabel = _e === void 0 ? "" : _e,
        _f = _d.yAxisSuffix,
        yAxisSuffix = _f === void 0 ? "" : _f,
        _g = _d.yLabelsOffset,
        yLabelsOffset = _g === void 0 ? 12 : _g;
      return new Array(count === 1 ? 1 : count + 1).fill(1).map(function(_, i) {
        var yLabel = String(i * count);
        if (count === 1) {
          yLabel =
            "" +
            yAxisLabel +
            formatYLabel(data[0].toFixed(decimalPlaces)) +
            yAxisSuffix;
        } else {
          var label = _this.props.fromZero
            ? (_this.calcScaler(data) / count) * i +
              Math.min.apply(Math, __spreadArrays(data, [0]))
            : (_this.calcScaler(data) / count) * i + Math.min.apply(Math, data);
          yLabel =
            "" +
            yAxisLabel +
            formatYLabel(label.toFixed(decimalPlaces)) +
            yAxisSuffix;
        }
        var basePosition = height - height / 4;
        var x = paddingRight - yLabelsOffset;
        var y =
          count === 1 && _this.props.fromZero
            ? paddingTop + 4
            : (height * 3) / 4 - (basePosition / count) * i + paddingTop;
        return (
          <Text
            rotation={horizontalLabelRotation}
            origin={x + ", " + y}
            key={Math.random()}
            x={x}
            textAnchor="end"
            y={y}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForHorizontalLabels()}
          >
            {yLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLabels = function(_a) {
      var _b = _a.labels,
        labels = _b === void 0 ? [] : _b,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        _c = _a.horizontalOffset,
        horizontalOffset = _c === void 0 ? 0 : _c,
        _d = _a.stackedBar,
        stackedBar = _d === void 0 ? false : _d,
        _e = _a.verticalLabelRotation,
        verticalLabelRotation = _e === void 0 ? 0 : _e,
        _f = _a.formatXLabel,
        formatXLabel =
          _f === void 0
            ? function(xLabel) {
                return xLabel;
              }
            : _f;
      var _g = _this.props,
        _h = _g.xAxisLabel,
        xAxisLabel = _h === void 0 ? "" : _h,
        _j = _g.xLabelsOffset,
        xLabelsOffset = _j === void 0 ? 0 : _j,
        _k = _g.hidePointsAtIndex,
        hidePointsAtIndex = _k === void 0 ? [] : _k;
      var fontSize = 12;
      var fac = 1;
      if (stackedBar) {
        fac = 0.71;
      }
      return labels.map(function(label, i) {
        if (hidePointsAtIndex.includes(i)) {
          return null;
        }
        var x =
          (((width - paddingRight) / labels.length) * i +
            paddingRight +
            horizontalOffset) *
          fac;
        var y = (height * 3) / 4 + paddingTop + fontSize * 2 + xLabelsOffset;
        return (
          <Text
            origin={x + ", " + y}
            rotation={verticalLabelRotation}
            key={Math.random()}
            x={x}
            y={y}
            textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForVerticalLabels()}
          >
            {"" + formatXLabel(label) + xAxisLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLines = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight;
      var _b = _this.props.yAxisInterval,
        yAxisInterval = _b === void 0 ? 1 : _b;
      return __spreadArrays(
        new Array(Math.ceil(data.length / yAxisInterval))
      ).map(function(_, i) {
        return (
          <Line
            key={Math.random()}
            x1={Math.floor(
              ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                paddingRight
            )}
            y1={0}
            x2={Math.floor(
              ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                paddingRight
            )}
            y2={height - height / 4 + paddingTop}
            {..._this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    _this.renderVerticalLine = function(_a) {
      var height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight;
      return (
        <Line
          key={Math.random()}
          x1={Math.floor(paddingRight)}
          y1={0}
          x2={Math.floor(paddingRight)}
          y2={height - height / 4 + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderDefs = function(config) {
      var width = config.width,
        height = config.height,
        backgroundGradientFrom = config.backgroundGradientFrom,
        backgroundGradientTo = config.backgroundGradientTo,
        useShadowColorFromDataset = config.useShadowColorFromDataset,
        data = config.data;
      var fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
        ? config.backgroundGradientFromOpacity
        : 1.0;
      var toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
        ? config.backgroundGradientToOpacity
        : 1.0;
      var fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
        ? config.fillShadowGradient
        : _this.props.chartConfig.color(1.0);
      var fillShadowGradientOpacity = config.hasOwnProperty(
        "fillShadowGradientOpacity"
      )
        ? config.fillShadowGradientOpacity
        : 0.1;
      return (
        <Defs>
          <LinearGradient
            id="backgroundGradient"
            x1={0}
            y1={height}
            x2={width}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0"
              stopColor={backgroundGradientFrom}
              stopOpacity={fromOpacity}
            />
            <Stop
              offset="1"
              stopColor={backgroundGradientTo}
              stopOpacity={toOpacity}
            />
          </LinearGradient>
          {useShadowColorFromDataset ? (
            data.map(function(dataset, index) {
              return (
                <LinearGradient
                  id={"fillShadowGradient_" + index}
                  key={"" + index}
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={height}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset="0"
                    stopColor={
                      dataset.color ? dataset.color(1.0) : fillShadowGradient
                    }
                    stopOpacity={fillShadowGradientOpacity}
                  />
                  <Stop
                    offset="1"
                    stopColor={
                      dataset.color
                        ? dataset.color(fillShadowGradientOpacity)
                        : fillShadowGradient
                    }
                    stopOpacity="0"
                  />
                </LinearGradient>
              );
            })
          ) : (
            <LinearGradient
              id="fillShadowGradient"
              x1={0}
              y1={0}
              x2={0}
              y2={height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={fillShadowGradient}
                stopOpacity={fillShadowGradientOpacity}
              />
              <Stop offset="1" stopColor={fillShadowGradient} stopOpacity="0" />
            </LinearGradient>
          )}
        </Defs>
      );
    };
    return _this;
  }
  AbstractChart.prototype.getPropsForBackgroundLines = function() {
    var _a = this.props.chartConfig.propsForBackgroundLines,
      propsForBackgroundLines = _a === void 0 ? {} : _a;
    return __assign(
      {
        stroke: this.props.chartConfig.color(0.2),
        strokeDasharray: "5, 10",
        strokeWidth: 1
      },
      propsForBackgroundLines
    );
  };
  AbstractChart.prototype.getPropsForLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForLabels,
      propsForLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fontSize: 12, fill: labelColor(0.8) }, propsForLabels);
  };
  AbstractChart.prototype.getPropsForVerticalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForVerticalLabels,
      propsForVerticalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForVerticalLabels);
  };
  AbstractChart.prototype.getPropsForHorizontalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForHorizontalLabels,
      propsForHorizontalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForHorizontalLabels);
  };
  return AbstractChart;
})(Component);
export default AbstractChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQWtDMUU7SUFHVSxpQ0FBbUU7SUFIN0U7UUFBQSxxRUE2WkM7UUF6WkMsZ0JBQVUsR0FBRyxVQUFDLElBQWM7WUFDMUIsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDdkIsT0FBTyxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksaUJBQVEsSUFBSSxHQUFFLENBQUMsTUFBSSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksaUJBQVEsSUFBSSxHQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6RDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxFQUFRLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksRUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkQ7UUFDSCxDQUFDLENBQUM7UUFFRixvQkFBYyxHQUFHLFVBQUMsSUFBYyxFQUFFLE1BQWM7WUFDOUMsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLEVBQVEsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hCLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7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LEtBQ00sQ0FBQztRQUMzQixrQkFDRSxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUNsQixzQkFBc0IsRUFDekI7SUFDSixDQUFDO0lBRUQsbURBQTJCLEdBQTNCO1FBQ1EsSUFBQSxLQUlGLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUh4QixnQ0FBNkIsRUFBN0Isd0JBQXdCLG1CQUFHLEVBQUUsS0FBQSxFQUM3QixLQUFLLFdBQUEsRUFDTCxrQkFBa0IsRUFBbEIsVUFBVSxtQkFBRyxLQUFLLEtBQ00sQ0FBQztRQUMzQixrQkFDRSxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUNsQix3QkFBd0IsRUFDM0I7SUFDSixDQUFDO0lBdVVILG9CQUFDO0FBQUQsQ0FBQyxBQTdaRCxDQUdVLFNBQVMsR0EwWmxCO0FBRUQsZUFBZSxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IERlZnMsIExpbmUsIExpbmVhckdyYWRpZW50LCBTdG9wLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcclxuXHJcbmltcG9ydCB7IENoYXJ0Q29uZmlnLCBEYXRhc2V0LCBQYXJ0aWFsQnkgfSBmcm9tIFwiLi9IZWxwZXJUeXBlc1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0UHJvcHMge1xyXG4gIGZyb21aZXJvPzogYm9vbGVhbjtcclxuICBjaGFydENvbmZpZz86IEFic3RyYWN0Q2hhcnRDb25maWc7XHJcbiAgeUF4aXNMYWJlbD86IHN0cmluZztcclxuICB5QXhpc1N1ZmZpeD86IHN0cmluZztcclxuICB5TGFiZWxzT2Zmc2V0PzogbnVtYmVyO1xyXG4gIHlBeGlzSW50ZXJ2YWw/OiBudW1iZXI7XHJcbiAgeEF4aXNMYWJlbD86IHN0cmluZztcclxuICB4TGFiZWxzT2Zmc2V0PzogbnVtYmVyO1xyXG4gIGhpZGVQb2ludHNBdEluZGV4PzogbnVtYmVyW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDaGFydENvbmZpZyBleHRlbmRzIENoYXJ0Q29uZmlnIHtcclxuICBjb3VudD86IG51bWJlcjtcclxuICBkYXRhPzogRGF0YXNldFtdO1xyXG4gIHdpZHRoPzogbnVtYmVyO1xyXG4gIGhlaWdodD86IG51bWJlcjtcclxuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xyXG4gIHBhZGRpbmdSaWdodD86IG51bWJlcjtcclxuICBob3Jpem9udGFsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcclxuICBmb3JtYXRZTGFiZWw/OiAoeUxhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcclxuICBsYWJlbHM/OiBzdHJpbmdbXTtcclxuICBob3Jpem9udGFsT2Zmc2V0PzogbnVtYmVyO1xyXG4gIHN0YWNrZWRCYXI/OiBib29sZWFuO1xyXG4gIHZlcnRpY2FsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcclxuICBmb3JtYXRYTGFiZWw/OiAoeExhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWJzdHJhY3RDaGFydFN0YXRlID0ge307XHJcblxyXG5jbGFzcyBBYnN0cmFjdENoYXJ0PFxyXG4gIElQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyxcclxuICBJU3RhdGUgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0U3RhdGVcclxuPiBleHRlbmRzIENvbXBvbmVudDxBYnN0cmFjdENoYXJ0UHJvcHMgJiBJUHJvcHMsIEFic3RyYWN0Q2hhcnRTdGF0ZSAmIElTdGF0ZT4ge1xyXG4gIGNhbGNTY2FsZXIgPSAoZGF0YTogbnVtYmVyW10pID0+IHtcclxuICAgIGlmICh0aGlzLnByb3BzLmZyb21aZXJvKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhLCAwKSAtIE1hdGgubWluKC4uLmRhdGEsIDApIHx8IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4uZGF0YSkgLSBNYXRoLm1pbiguLi5kYXRhKSB8fCAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNhbGNCYXNlSGVpZ2h0ID0gKGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XHJcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kYXRhKTtcclxuICAgIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xyXG4gICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA+IDApIHtcclxuICAgICAgcmV0dXJuIChoZWlnaHQgKiBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNhbGNIZWlnaHQgPSAodmFsOiBudW1iZXIsIGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSk7XHJcbiAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi5kYXRhKTtcclxuXHJcbiAgICBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XHJcbiAgICAgIHJldHVybiBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcclxuICAgIH0gZWxzZSBpZiAobWluID49IDAgJiYgbWF4ID49IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cclxuICAgICAgICA/IGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpXHJcbiAgICAgICAgOiBoZWlnaHQgKiAoKHZhbCAtIG1pbikgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpO1xyXG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmZyb21aZXJvXHJcbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxyXG4gICAgICAgIDogaGVpZ2h0ICogKCh2YWwgLSBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpIHtcclxuICAgIGNvbnN0IHsgcHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMgPSB7fSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0cm9rZTogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjIpLFxyXG4gICAgICBzdHJva2VEYXNoYXJyYXk6IFwiNSwgMTBcIixcclxuICAgICAgc3Ryb2tlV2lkdGg6IDEsXHJcbiAgICAgIC4uLnByb3BzRm9yQmFja2dyb3VuZExpbmVzXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvcHNGb3JMYWJlbHMoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIHByb3BzRm9yTGFiZWxzID0ge30sXHJcbiAgICAgIGNvbG9yLFxyXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXHJcbiAgICAgIC4uLnByb3BzRm9yTGFiZWxzXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvcHNGb3JWZXJ0aWNhbExhYmVscygpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgcHJvcHNGb3JWZXJ0aWNhbExhYmVscyA9IHt9LFxyXG4gICAgICBjb2xvcixcclxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXHJcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcclxuICAgICAgLi4ucHJvcHNGb3JWZXJ0aWNhbExhYmVsc1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgcHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzID0ge30sXHJcbiAgICAgIGNvbG9yLFxyXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxyXG4gICAgICAuLi5wcm9wc0Zvckhvcml6b250YWxMYWJlbHNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZW5kZXJIb3Jpem9udGFsTGluZXMgPSBjb25maWcgPT4ge1xyXG4gICAgY29uc3QgeyBjb3VudCwgd2lkdGgsIGhlaWdodCwgcGFkZGluZ1RvcCwgcGFkZGluZ1JpZ2h0IH0gPSBjb25maWc7XHJcbiAgICBjb25zdCBiYXNlUG9zaXRpb24gPSBoZWlnaHQgLSBoZWlnaHQgLyA0O1xyXG5cclxuICAgIHJldHVybiBbLi4ubmV3IEFycmF5KGNvdW50ICsgMSldLm1hcCgoXywgaSkgPT4ge1xyXG4gICAgICBjb25zdCB5ID0gKGJhc2VQb3NpdGlvbiAvIGNvdW50KSAqIGkgKyBwYWRkaW5nVG9wO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxMaW5lXHJcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICB4MT17cGFkZGluZ1JpZ2h0fVxyXG4gICAgICAgICAgeTE9e3l9XHJcbiAgICAgICAgICB4Mj17d2lkdGh9XHJcbiAgICAgICAgICB5Mj17eX1cclxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XHJcbiAgICAgICAgLz5cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlckhvcml6b250YWxMaW5lID0gY29uZmlnID0+IHtcclxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgcGFkZGluZ1RvcCwgcGFkZGluZ1JpZ2h0IH0gPSBjb25maWc7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8TGluZVxyXG4gICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICB4MT17cGFkZGluZ1JpZ2h0fVxyXG4gICAgICAgIHkxPXtoZWlnaHQgLSBoZWlnaHQgLyA0ICsgcGFkZGluZ1RvcH1cclxuICAgICAgICB4Mj17d2lkdGh9XHJcbiAgICAgICAgeTI9e2hlaWdodCAtIGhlaWdodCAvIDQgKyBwYWRkaW5nVG9wfVxyXG4gICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XHJcbiAgICAgIC8+XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlckhvcml6b250YWxMYWJlbHMgPSAoXHJcbiAgICBjb25maWc6IE9taXQ8QWJzdHJhY3RDaGFydENvbmZpZywgXCJkYXRhXCI+ICYgeyBkYXRhOiBudW1iZXJbXSB9XHJcbiAgKSA9PiB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGNvdW50LFxyXG4gICAgICBkYXRhLFxyXG4gICAgICBoZWlnaHQsXHJcbiAgICAgIHBhZGRpbmdUb3AsXHJcbiAgICAgIHBhZGRpbmdSaWdodCxcclxuICAgICAgaG9yaXpvbnRhbExhYmVsUm90YXRpb24gPSAwLFxyXG4gICAgICBkZWNpbWFsUGxhY2VzID0gMixcclxuICAgICAgZm9ybWF0WUxhYmVsID0gKHlMYWJlbDogc3RyaW5nKSA9PiB5TGFiZWxcclxuICAgIH0gPSBjb25maWc7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICB5QXhpc0xhYmVsID0gXCJcIixcclxuICAgICAgeUF4aXNTdWZmaXggPSBcIlwiLFxyXG4gICAgICB5TGFiZWxzT2Zmc2V0ID0gMTJcclxuICAgIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgcmV0dXJuIG5ldyBBcnJheShjb3VudCA9PT0gMSA/IDEgOiBjb3VudCArIDEpLmZpbGwoMSkubWFwKChfLCBpKSA9PiB7XHJcbiAgICAgIGxldCB5TGFiZWwgPSBTdHJpbmcoaSAqIGNvdW50KTtcclxuXHJcbiAgICAgIGlmIChjb3VudCA9PT0gMSkge1xyXG4gICAgICAgIHlMYWJlbCA9IGAke3lBeGlzTGFiZWx9JHtmb3JtYXRZTGFiZWwoXHJcbiAgICAgICAgICBkYXRhWzBdLnRvRml4ZWQoZGVjaW1hbFBsYWNlcylcclxuICAgICAgICApfSR7eUF4aXNTdWZmaXh9YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMucHJvcHMuZnJvbVplcm9cclxuICAgICAgICAgID8gKHRoaXMuY2FsY1NjYWxlcihkYXRhKSAvIGNvdW50KSAqIGkgKyBNYXRoLm1pbiguLi5kYXRhLCAwKVxyXG4gICAgICAgICAgOiAodGhpcy5jYWxjU2NhbGVyKGRhdGEpIC8gY291bnQpICogaSArIE1hdGgubWluKC4uLmRhdGEpO1xyXG4gICAgICAgIHlMYWJlbCA9IGAke3lBeGlzTGFiZWx9JHtmb3JtYXRZTGFiZWwoXHJcbiAgICAgICAgICBsYWJlbC50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpXHJcbiAgICAgICAgKX0ke3lBeGlzU3VmZml4fWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGJhc2VQb3NpdGlvbiA9IGhlaWdodCAtIGhlaWdodCAvIDQ7XHJcbiAgICAgIGNvbnN0IHggPSBwYWRkaW5nUmlnaHQgLSB5TGFiZWxzT2Zmc2V0O1xyXG4gICAgICBjb25zdCB5ID1cclxuICAgICAgICBjb3VudCA9PT0gMSAmJiB0aGlzLnByb3BzLmZyb21aZXJvXHJcbiAgICAgICAgICA/IHBhZGRpbmdUb3AgKyA0XHJcbiAgICAgICAgICA6IChoZWlnaHQgKiAzKSAvIDQgLSAoYmFzZVBvc2l0aW9uIC8gY291bnQpICogaSArIHBhZGRpbmdUb3A7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRleHRcclxuICAgICAgICAgIHJvdGF0aW9uPXtob3Jpem9udGFsTGFiZWxSb3RhdGlvbn1cclxuICAgICAgICAgIG9yaWdpbj17YCR7eH0sICR7eX1gfVxyXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgeD17eH1cclxuICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIlxyXG4gICAgICAgICAgeT17eX1cclxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XHJcbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0Zvckhvcml6b250YWxMYWJlbHMoKX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7eUxhYmVsfVxyXG4gICAgICAgIDwvVGV4dD5cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlclZlcnRpY2FsTGFiZWxzID0gKHtcclxuICAgIGxhYmVscyA9IFtdLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICBwYWRkaW5nVG9wLFxyXG4gICAgaG9yaXpvbnRhbE9mZnNldCA9IDAsXHJcbiAgICBzdGFja2VkQmFyID0gZmFsc2UsXHJcbiAgICB2ZXJ0aWNhbExhYmVsUm90YXRpb24gPSAwLFxyXG4gICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbFxyXG4gIH06IFBpY2s8XHJcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gICAgfCBcImxhYmVsc1wiXHJcbiAgICB8IFwid2lkdGhcIlxyXG4gICAgfCBcImhlaWdodFwiXHJcbiAgICB8IFwicGFkZGluZ1JpZ2h0XCJcclxuICAgIHwgXCJwYWRkaW5nVG9wXCJcclxuICAgIHwgXCJob3Jpem9udGFsT2Zmc2V0XCJcclxuICAgIHwgXCJzdGFja2VkQmFyXCJcclxuICAgIHwgXCJ2ZXJ0aWNhbExhYmVsUm90YXRpb25cIlxyXG4gICAgfCBcImZvcm1hdFhMYWJlbFwiXHJcbiAgPikgPT4ge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICB4QXhpc0xhYmVsID0gXCJcIixcclxuICAgICAgeExhYmVsc09mZnNldCA9IDAsXHJcbiAgICAgIGhpZGVQb2ludHNBdEluZGV4ID0gW11cclxuICAgIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgIGNvbnN0IGZvbnRTaXplID0gMTI7XHJcblxyXG4gICAgbGV0IGZhYyA9IDE7XHJcbiAgICBpZiAoc3RhY2tlZEJhcikge1xyXG4gICAgICBmYWMgPSAwLjcxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsYWJlbHMubWFwKChsYWJlbCwgaSkgPT4ge1xyXG4gICAgICBpZiAoaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgeCA9XHJcbiAgICAgICAgKCgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gbGFiZWxzLmxlbmd0aCkgKiBpICtcclxuICAgICAgICAgIHBhZGRpbmdSaWdodCArXHJcbiAgICAgICAgICBob3Jpem9udGFsT2Zmc2V0KSAqXHJcbiAgICAgICAgZmFjO1xyXG5cclxuICAgICAgY29uc3QgeSA9IChoZWlnaHQgKiAzKSAvIDQgKyBwYWRkaW5nVG9wICsgZm9udFNpemUgKiAyICsgeExhYmVsc09mZnNldDtcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRleHRcclxuICAgICAgICAgIG9yaWdpbj17YCR7eH0sICR7eX1gfVxyXG4gICAgICAgICAgcm90YXRpb249e3ZlcnRpY2FsTGFiZWxSb3RhdGlvbn1cclxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgIHg9e3h9XHJcbiAgICAgICAgICB5PXt5fVxyXG4gICAgICAgICAgdGV4dEFuY2hvcj17dmVydGljYWxMYWJlbFJvdGF0aW9uID09PSAwID8gXCJtaWRkbGVcIiA6IFwic3RhcnRcIn1cclxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XHJcbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvclZlcnRpY2FsTGFiZWxzKCl9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2Ake2Zvcm1hdFhMYWJlbChsYWJlbCl9JHt4QXhpc0xhYmVsfWB9XHJcbiAgICAgICAgPC9UZXh0PlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyVmVydGljYWxMaW5lcyA9ICh7XHJcbiAgICBkYXRhLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBwYWRkaW5nVG9wLFxyXG4gICAgcGFkZGluZ1JpZ2h0XHJcbiAgfTogT21pdDxcclxuICAgIFBpY2s8XHJcbiAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxyXG4gICAgPixcclxuICAgIFwiZGF0YVwiXHJcbiAgPiAmIHsgZGF0YTogbnVtYmVyW10gfSkgPT4ge1xyXG4gICAgY29uc3QgeyB5QXhpc0ludGVydmFsID0gMSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICByZXR1cm4gWy4uLm5ldyBBcnJheShNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSldLm1hcChcclxuICAgICAgKF8sIGkpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPExpbmVcclxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgICB4MT17TWF0aC5mbG9vcihcclxuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIChkYXRhLmxlbmd0aCAvIHlBeGlzSW50ZXJ2YWwpKSAqIGkgK1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHkxPXswfVxyXG4gICAgICAgICAgICB4Mj17TWF0aC5mbG9vcihcclxuICAgICAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIChkYXRhLmxlbmd0aCAvIHlBeGlzSW50ZXJ2YWwpKSAqIGkgK1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHkyPXtoZWlnaHQgLSBoZWlnaHQgLyA0ICsgcGFkZGluZ1RvcH1cclxuICAgICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICByZW5kZXJWZXJ0aWNhbExpbmUgPSAoe1xyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIHBhZGRpbmdSaWdodFxyXG4gIH06IFBpY2s8QWJzdHJhY3RDaGFydENvbmZpZywgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIj4pID0+IChcclxuICAgIDxMaW5lXHJcbiAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgeDE9e01hdGguZmxvb3IocGFkZGluZ1JpZ2h0KX1cclxuICAgICAgeTE9ezB9XHJcbiAgICAgIHgyPXtNYXRoLmZsb29yKHBhZGRpbmdSaWdodCl9XHJcbiAgICAgIHkyPXtoZWlnaHQgLSBoZWlnaHQgLyA0ICsgcGFkZGluZ1RvcH1cclxuICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cclxuICAgIC8+XHJcbiAgKTtcclxuXHJcbiAgcmVuZGVyRGVmcyA9IChcclxuICAgIGNvbmZpZzogUGljazxcclxuICAgICAgUGFydGlhbEJ5PFxyXG4gICAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCJcclxuICAgICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcclxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50XCJcclxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXHJcbiAgICAgID4sXHJcbiAgICAgIHwgXCJ3aWR0aFwiXHJcbiAgICAgIHwgXCJoZWlnaHRcIlxyXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbVwiXHJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRUb1wiXHJcbiAgICAgIHwgXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJcclxuICAgICAgfCBcImRhdGFcIlxyXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIlxyXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcclxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXHJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcclxuICAgID5cclxuICApID0+IHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgYmFja2dyb3VuZEdyYWRpZW50RnJvbSxcclxuICAgICAgYmFja2dyb3VuZEdyYWRpZW50VG8sXHJcbiAgICAgIHVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXQsXHJcbiAgICAgIGRhdGFcclxuICAgIH0gPSBjb25maWc7XHJcblxyXG4gICAgY29uc3QgZnJvbU9wYWNpdHkgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVwiKVxyXG4gICAgICA/IGNvbmZpZy5iYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVxyXG4gICAgICA6IDEuMDtcclxuICAgIGNvbnN0IHRvT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVwiKVxyXG4gICAgICA/IGNvbmZpZy5iYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHlcclxuICAgICAgOiAxLjA7XHJcblxyXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiZmlsbFNoYWRvd0dyYWRpZW50XCIpXHJcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudFxyXG4gICAgICA6IHRoaXMucHJvcHMuY2hhcnRDb25maWcuY29sb3IoMS4wKTtcclxuXHJcbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFxyXG4gICAgICBcImZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcIlxyXG4gICAgKVxyXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XHJcbiAgICAgIDogMC4xO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxEZWZzPlxyXG4gICAgICAgIDxMaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgaWQ9XCJiYWNrZ3JvdW5kR3JhZGllbnRcIlxyXG4gICAgICAgICAgeDE9ezB9XHJcbiAgICAgICAgICB5MT17aGVpZ2h0fVxyXG4gICAgICAgICAgeDI9e3dpZHRofVxyXG4gICAgICAgICAgeTI9ezB9XHJcbiAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxTdG9wXHJcbiAgICAgICAgICAgIG9mZnNldD1cIjBcIlxyXG4gICAgICAgICAgICBzdG9wQ29sb3I9e2JhY2tncm91bmRHcmFkaWVudEZyb219XHJcbiAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmcm9tT3BhY2l0eX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8U3RvcFxyXG4gICAgICAgICAgICBvZmZzZXQ9XCIxXCJcclxuICAgICAgICAgICAgc3RvcENvbG9yPXtiYWNrZ3JvdW5kR3JhZGllbnRUb31cclxuICAgICAgICAgICAgc3RvcE9wYWNpdHk9e3RvT3BhY2l0eX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9MaW5lYXJHcmFkaWVudD5cclxuICAgICAgICB7dXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldCA/IChcclxuICAgICAgICAgIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4gKFxyXG4gICAgICAgICAgICA8TGluZWFyR3JhZGllbnRcclxuICAgICAgICAgICAgICBpZD17YGZpbGxTaGFkb3dHcmFkaWVudF8ke2luZGV4fWB9XHJcbiAgICAgICAgICAgICAga2V5PXtgJHtpbmRleH1gfVxyXG4gICAgICAgICAgICAgIHgxPXswfVxyXG4gICAgICAgICAgICAgIHkxPXswfVxyXG4gICAgICAgICAgICAgIHgyPXswfVxyXG4gICAgICAgICAgICAgIHkyPXtoZWlnaHR9XHJcbiAgICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxTdG9wXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ9XCIwXCJcclxuICAgICAgICAgICAgICAgIHN0b3BDb2xvcj17XHJcbiAgICAgICAgICAgICAgICAgIGRhdGFzZXQuY29sb3IgPyBkYXRhc2V0LmNvbG9yKDEuMCkgOiBmaWxsU2hhZG93R3JhZGllbnRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPFN0b3BcclxuICAgICAgICAgICAgICAgIG9mZnNldD1cIjFcIlxyXG4gICAgICAgICAgICAgICAgc3RvcENvbG9yPXtcclxuICAgICAgICAgICAgICAgICAgZGF0YXNldC5jb2xvclxyXG4gICAgICAgICAgICAgICAgICAgID8gZGF0YXNldC5jb2xvcihmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgIDogZmlsbFNoYWRvd0dyYWRpZW50XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdG9wT3BhY2l0eT1cIjBcIlxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XHJcbiAgICAgICAgICApKVxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICA8TGluZWFyR3JhZGllbnRcclxuICAgICAgICAgICAgaWQ9XCJmaWxsU2hhZG93R3JhZGllbnRcIlxyXG4gICAgICAgICAgICB4MT17MH1cclxuICAgICAgICAgICAgeTE9ezB9XHJcbiAgICAgICAgICAgIHgyPXswfVxyXG4gICAgICAgICAgICB5Mj17aGVpZ2h0fVxyXG4gICAgICAgICAgICBncmFkaWVudFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8U3RvcFxyXG4gICAgICAgICAgICAgIG9mZnNldD1cIjBcIlxyXG4gICAgICAgICAgICAgIHN0b3BDb2xvcj17ZmlsbFNoYWRvd0dyYWRpZW50fVxyXG4gICAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8U3RvcCBvZmZzZXQ9XCIxXCIgc3RvcENvbG9yPXtmaWxsU2hhZG93R3JhZGllbnR9IHN0b3BPcGFjaXR5PVwiMFwiIC8+XHJcbiAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvRGVmcz5cclxuICAgICk7XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RDaGFydDtcclxuIl19
