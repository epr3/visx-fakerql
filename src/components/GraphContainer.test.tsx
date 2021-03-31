import { render, screen } from "@testing-library/react";

import { Post } from "../types";
import { GraphContainer } from "./GraphContainer";

const data: Post[] = [
  { id: "ckmwcisxd0cc2aq10aqf0nxj0", createdAt: 1563204022732 },
];

it("renders without error", () => {
  render(<GraphContainer data={data} width={500} height={500} />);

  const svgElement = screen.getByTestId("graph-container");
  const barElements = screen.getAllByTestId("bar");
  const textElements = screen.getAllByTestId("text");

  expect(svgElement).toBeInTheDocument();
  expect(barElements.length).toBe(data.length);
  expect(textElements.length).toBe(data.length);
});

it("renders null if the width is less than 10", () => {
  render(<GraphContainer data={data} width={9} height={500} />);

  const svgElement = screen.queryByTestId("graph-container");

  expect(svgElement).not.toBeInTheDocument();
});
