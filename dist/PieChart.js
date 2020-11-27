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
import { G, Path, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var PieChart = /** @class */ (function(_super) {
  __extends(PieChart, _super);
  function PieChart() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PieChart.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      _b = _a.style,
      style = _b === void 0 ? {} : _b,
      backgroundColor = _a.backgroundColor,
      _c = _a.absolute,
      absolute = _c === void 0 ? false : _c,
      _d = _a.hasLegend,
      hasLegend = _d === void 0 ? true : _d,
      _e = _a.avoidFalseZero,
      avoidFalseZero = _e === void 0 ? false : _e;
    var _f = style.borderRadius,
      borderRadius = _f === void 0 ? 0 : _f;
    var chart = Pie({
      center: this.props.center || [0, 0],
      r: 0,
      R: this.props.height / 2.5,
      data: this.props.data,
      accessor: function(x) {
        return x[_this.props.accessor];
      }
    });
    var total = this.props.data.reduce(function(sum, item) {
      return sum + item[_this.props.accessor];
    }, 0);
    var slices = chart.curves.map(function(c, i) {
      var value;
      if (absolute) {
        value = c.item[_this.props.accessor];
      } else {
        if (total === 0) {
          value = 0 + "%";
        } else {
          var percentage = Math.round(
            (100 / total) * c.item[_this.props.accessor]
          );
          value =
            Math.round((100 / total) * c.item[_this.props.accessor]) + "%";
          if (avoidFalseZero && percentage === 0) {
            value = "<1%";
          } else {
            value = percentage + "%";
          }
        }
      }
      return (
        <G key={Math.random()}>
          <Path d={c.sector.path.print()} fill={c.item.color} />
          {hasLegend ? (
            <Rect
              width="16px"
              height="16px"
              fill={c.item.color}
              rx={8}
              ry={8}
              x={_this.props.width / 2.5 - 24}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12
              }
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              x={_this.props.width / 2.5}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12 * 2
              }
            >
              {value + " " + c.item.name}
            </Text>
          ) : null}
        </G>
      );
    });
    return (
      <View
        style={__assign(
          { width: this.props.width, height: this.props.height, padding: 0 },
          style
        )}
      >
        <Svg width={this.props.width} height={this.props.height}>
          <G>
            {this.renderDefs(
              __assign(
                { width: this.props.height, height: this.props.height },
                this.props.chartConfig
              )
            )}
          </G>
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill={backgroundColor}
          />
          <G
            x={
              this.props.width / 2 / 2 +
              Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
            }
            y={this.props.height / 2}
          >
            {slices}
          </G>
        </Svg>
      </View>
    );
  };
  return PieChart;
})(AbstractChart);
export default PieChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUGllQ2hhcnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFFLElBQUksRUFBYSxNQUFNLGNBQWMsQ0FBQztBQUMvQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVELE9BQU8sYUFBcUMsTUFBTSxpQkFBaUIsQ0FBQztBQWtCcEU7SUFBdUIsNEJBQTJDO0lBQWxFOztJQXdIQSxDQUFDO0lBdkhDLHlCQUFNLEdBQU47UUFBQSxpQkFzSEM7UUFySE8sSUFBQSxLQU1GLElBQUksQ0FBQyxLQUFLLEVBTFosYUFBVSxFQUFWLEtBQUssbUJBQUcsRUFBRSxLQUFBLEVBQ1YsZUFBZSxxQkFBQSxFQUNmLGdCQUFnQixFQUFoQixRQUFRLG1CQUFHLEtBQUssS0FBQSxFQUNoQixpQkFBZ0IsRUFBaEIsU0FBUyxtQkFBRyxJQUFJLEtBQUEsRUFDaEIsc0JBQXNCLEVBQXRCLGNBQWMsbUJBQUcsS0FBSyxLQUNWLENBQUM7UUFFUCxJQUFBLEtBQXFCLEtBQUssYUFBVixFQUFoQixZQUFZLG1CQUFHLENBQUMsS0FBQSxDQUFXO1FBRW5DLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNoQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUc7WUFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUNy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QSxFQUFFLENBQUMsQ0FDSDtVQUFBLENBQUMsSUFBSSxDQUNILEtBQUssQ0FBQyxNQUFNLENBQ1osTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FDMUIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2pCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNqQixJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFFeEI7VUFBQSxDQUFDLENBQUMsQ0FDQSxDQUFDLENBQUMsQ0FDQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDNUQsQ0FDRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FFekI7WUFBQSxDQUFDLE1BQU0sQ0FDVDtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUF4SEQsQ0FBdUIsYUFBYSxHQXdIbkM7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQaWUgZnJvbSBcInBhdGhzLWpzL3BpZVwiO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IFZpZXcsIFZpZXdTdHlsZSB9IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcclxuaW1wb3J0IHsgRywgUGF0aCwgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcclxuXHJcbmltcG9ydCBBYnN0cmFjdENoYXJ0LCB7IEFic3RyYWN0Q2hhcnRQcm9wcyB9IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGllQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XHJcbiAgZGF0YTogQXJyYXk8YW55PjtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG4gIGFjY2Vzc29yOiBzdHJpbmc7XHJcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XHJcbiAgcGFkZGluZ0xlZnQ6IHN0cmluZztcclxuICBjZW50ZXI/OiBBcnJheTxudW1iZXI+O1xyXG4gIGFic29sdXRlPzogYm9vbGVhbjtcclxuICBoYXNMZWdlbmQ/OiBib29sZWFuO1xyXG4gIHN0eWxlPzogUGFydGlhbDxWaWV3U3R5bGU+O1xyXG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcclxufVxyXG5cclxudHlwZSBQaWVDaGFydFN0YXRlID0ge307XHJcblxyXG5jbGFzcyBQaWVDaGFydCBleHRlbmRzIEFic3RyYWN0Q2hhcnQ8UGllQ2hhcnRQcm9wcywgUGllQ2hhcnRTdGF0ZT4ge1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgc3R5bGUgPSB7fSxcclxuICAgICAgYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxyXG4gICAgICBoYXNMZWdlbmQgPSB0cnVlLFxyXG4gICAgICBhdm9pZEZhbHNlWmVybyA9IGZhbHNlXHJcbiAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBjb25zdCB7IGJvcmRlclJhZGl1cyA9IDAgfSA9IHN0eWxlO1xyXG5cclxuICAgIGNvbnN0IGNoYXJ0ID0gUGllKHtcclxuICAgICAgY2VudGVyOiB0aGlzLnByb3BzLmNlbnRlciB8fCBbMCwgMF0sXHJcbiAgICAgIHI6IDAsXHJcbiAgICAgIFI6IHRoaXMucHJvcHMuaGVpZ2h0IC8gMi41LFxyXG4gICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXHJcbiAgICAgIGFjY2Vzc29yOiB4ID0+IHtcclxuICAgICAgICByZXR1cm4geFt0aGlzLnByb3BzLmFjY2Vzc29yXTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnByb3BzLmRhdGEucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuIHN1bSArIGl0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XHJcbiAgICB9LCAwKTtcclxuXHJcbiAgICBjb25zdCBzbGljZXMgPSBjaGFydC5jdXJ2ZXMubWFwKChjLCBpKSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICAgICAgaWYgKGFic29sdXRlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRvdGFsID09PSAwKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICgxMDAgLyB0b3RhbCkgKiBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICB2YWx1ZSA9IE1hdGgucm91bmQoKDEwMCAvIHRvdGFsKSAqIGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXSkgKyBcIiVcIjtcclxuICAgICAgICAgIGlmIChhdm9pZEZhbHNlWmVybyAmJiBwZXJjZW50YWdlID09PSAwKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gXCI8MSVcIjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gcGVyY2VudGFnZSArIFwiJVwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8RyBrZXk9e01hdGgucmFuZG9tKCl9PlxyXG4gICAgICAgICAgPFBhdGggZD17Yy5zZWN0b3IucGF0aC5wcmludCgpfSBmaWxsPXtjLml0ZW0uY29sb3J9IC8+XHJcbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxyXG4gICAgICAgICAgICA8UmVjdFxyXG4gICAgICAgICAgICAgIHdpZHRoPVwiMTZweFwiXHJcbiAgICAgICAgICAgICAgaGVpZ2h0PVwiMTZweFwiXHJcbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxyXG4gICAgICAgICAgICAgIHJ4PXs4fVxyXG4gICAgICAgICAgICAgIHJ5PXs4fVxyXG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjUgLSAyNH1cclxuICAgICAgICAgICAgICB5PXtcclxuICAgICAgICAgICAgICAgIC0odGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUpICtcclxuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcclxuICAgICAgICAgICAgICAgIDEyXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IG51bGx9XHJcbiAgICAgICAgICB7aGFzTGVnZW5kID8gKFxyXG4gICAgICAgICAgICA8VGV4dFxyXG4gICAgICAgICAgICAgIGZpbGw9e2MuaXRlbS5sZWdlbmRGb250Q29sb3J9XHJcbiAgICAgICAgICAgICAgZm9udFNpemU9e2MuaXRlbS5sZWdlbmRGb250U2l6ZX1cclxuICAgICAgICAgICAgICB4PXt0aGlzLnByb3BzLndpZHRoIC8gMi41fVxyXG4gICAgICAgICAgICAgIHk9e1xyXG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xyXG4gICAgICAgICAgICAgICAgKCh0aGlzLnByb3BzLmhlaWdodCAqIDAuOCkgLyB0aGlzLnByb3BzLmRhdGEubGVuZ3RoKSAqIGkgK1xyXG4gICAgICAgICAgICAgICAgMTIgKiAyXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge2Ake3ZhbHVlfSAke2MuaXRlbS5uYW1lfWB9XHJcbiAgICAgICAgICAgIDwvVGV4dD5cclxuICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgIDwvRz5cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxWaWV3XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcclxuICAgICAgICAgIHBhZGRpbmc6IDAsXHJcbiAgICAgICAgICAuLi5zdHlsZVxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8U3ZnIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofSBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fT5cclxuICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcclxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcclxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgPFJlY3RcclxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH1cclxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cclxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cclxuICAgICAgICAgICAgZmlsbD17YmFja2dyb3VuZENvbG9yfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxHXHJcbiAgICAgICAgICAgIHg9e1xyXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAyIC8gMiArXHJcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5PXt0aGlzLnByb3BzLmhlaWdodCAvIDJ9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtzbGljZXN9XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgPC9Tdmc+XHJcbiAgICAgIDwvVmlldz5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQaWVDaGFydDtcclxuIl19
