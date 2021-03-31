import "./App.css";

import { useQuery, gql } from "@apollo/client";

import { PostData, PostVars } from "./types";

import { GraphContainer } from "./components/GraphContainer";

const GET_POSTS = gql`
  query GetPosts($count: Int!) {
    allPosts(count: $count) {
      id
      createdAt
    }
  }
`;

function App() {
  const { loading, data } = useQuery<PostData, PostVars>(GET_POSTS, {
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
        ) : (
          data && (
            <GraphContainer data={data.allPosts} width={800} height={600} />
          )
        )}
      </header>
    </div>
  );
}

export default App;
