import GanttChart from "./GanttChart";

export interface GanttData {
  /** The data coresponding to  the y-axis label. */
  name: string;

  /** The periods corresponding to the x-axis label. */
  periods: [Date, Date][];

  /** A function returning array of the colors of the stroke given an input opacity value for each data value. */
  colors?: Array<(opacity: number) => string>;
}

export default GanttChart;
