import "./App.css";

import { useQuery, gql } from "@apollo/client";

import { PostData, PostVars } from "./types";

import { GraphContainer } from "./components/GraphContainer";

export const GET_POSTS_QUERY = gql`
  query GetPosts($count: Int!) {
    allPosts(count: $count) {
      id
      createdAt
    }
  }
`;

function App() {
  const { loading, data } = useQuery<PostData, PostVars>(GET_POSTS_QUERY, {
    variables: {
      count: 2000,
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Posts by month</h1>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <GraphContainer data={data.allPosts} width={800} height={600} />
        ) : (
          <p data-testid="error">The data could not be displayed.</p>
        )}
      </header>
    </div>
  );
}

export default App;
