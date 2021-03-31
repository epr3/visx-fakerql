import React, { FunctionComponent, useMemo } from "react";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { timeParse, timeFormat } from "d3-time-format";

import { Post } from "../types";

const months: { [key: string]: number } = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };

const parseDate = timeParse("%Q");
const format = timeFormat("%b");
const formatDate = (date: string) => format(parseDate(date) as Date);

// accessors
const getDate = (d: Post) => d.createdAt.toString();

type Props = {
  data: Post[];
  width: number;
  height: number;
};

export const GraphContainer: FunctionComponent<Props> = ({
  data,
  width,
  height,
}) => {
  // bounds
  const xMax = width;
  const yMax = height - defaultMargin.top - 100;

  // filter by year
  const postTotals = data
    .filter((item) => {
      return new Date(parseInt(getDate(item))).getFullYear() === 2019;
    })
    .reduce((acc: { [key: string]: number }, val) => {
      const itemMonth = formatDate(getDate(val));
      if (acc[itemMonth]) {
        acc[itemMonth]++;
      } else {
        acc[itemMonth] = 1;
      }
      return acc;
    }, {});

  // scales
  const dateScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        domain: Object.keys(postTotals).sort((a, b) => months[a] - months[b]),
        padding: 0.2,
      }),
    [xMax, postTotals]
  );
  const postsScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, Math.max(...Object.values(postTotals))],
        nice: true,
        range: [yMax, 0],
      }),
    [yMax, postTotals]
  );

  return width < 10 ? null : (
    <svg data-testid="graph-container" width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#eaedff" rx={14} />
      <Grid
        top={defaultMargin.top}
        left={defaultMargin.left}
        xScale={dateScale}
        yScale={postsScale}
        width={xMax}
        height={yMax}
        stroke="black"
        strokeOpacity={0.1}
        xOffset={dateScale.bandwidth() / 2}
      />
      <Group top={defaultMargin.top}>
        {Object.keys(postTotals).map((d) => {
          const date = d;

          const barWidth = dateScale.bandwidth();
          const barHeight = yMax - (postsScale(postTotals[d]) ?? 0);
          const barX = dateScale(date);
          const barY = yMax - barHeight;
          return (
            <React.Fragment key={`bar-${date}`}>
              <Bar
                data-testid="bar"
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
              />
              <text
                data-testid="text"
                x={barX! + barWidth / 2 - 6}
                y={yMax - barHeight}
                fontSize={12}
                dx={"-.2em"}
                dy={"-.33em"}
              >
                {postTotals[d]}
              </text>
            </React.Fragment>
          );
        })}
      </Group>
      <AxisBottom
        top={yMax + defaultMargin.top}
        scale={dateScale}
        stroke="#a44afe"
        tickStroke="#a44afe"
        tickLabelProps={() => ({
          fill: "#a44afe",
          fontSize: 11,
          textAnchor: "middle",
        })}
      />
    </svg>
  );
};
