import { gql, useQuery } from "@apollo/client";
import React from "react";

const query = gql`
  query Get {
    getTodos {
      completed
    }
  }
`;

const App = () => {
  const { data, loading } = useQuery(query);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.getTodos.map((todo, i) => (
        <div key={i}>{todo.completed ? "✅" : "❌"}</div>
      ))}
    </div>
  );
};

export default App;
