import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
        type Todo{
            id: ID!
            title: String!
            completed: Boolean!
            user : User
            temValue : String
        }
        type User{
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
        }
        type Query{
           getTodos: [Todo]
           getUsers: [User]
           getUserById(id : ID! ) : User
        }
        `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
                ).data,
          temValue : (todo) => {
            return "This is a temporary value";
          }
        },
        
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUserById: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });
  const app = express();
  await server.start();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/graphql", expressMiddleware(server));

  app.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000`);
  });
}

startApolloServer();
