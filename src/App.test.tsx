import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import App, { GET_POSTS_QUERY } from "./App";

const mocks = [
  {
    request: {
      query: GET_POSTS_QUERY,
      variables: {
        count: 2000,
      },
    },
    result: {
      data: {
        allPosts: [
          { id: "ckmwcisxd0cc2aq10aqf0nxj0", createdAt: 1563204022732 },
        ],
      },
    },
  },
];

it("renders without error", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});

it("renders the graph after loading", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await waitFor(() => screen.getByTestId("graph-container"));

  const graphElement = screen.getByTestId("graph-container");

  expect(graphElement).toBeInTheDocument();
});

it("renders a text element if data does not contain anything", async () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await waitFor(() => screen.getByTestId("error"));

  const textElement = screen.getByTestId("error");

  expect(textElement).toBeInTheDocument();
});
