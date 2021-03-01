//Dependencies
//Setup for the connection to the DB
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./GraphQL/typeDefs");
const resolvers = require("./GraphQL/resolvers");
const { MONGODB } = require("./config");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected"); //Conection Succesful
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
