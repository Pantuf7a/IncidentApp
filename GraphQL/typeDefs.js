const { gql } = require("apollo-server");

//Type definitions for all the variables used in the server.
//Note that 'RegisterInput' is not a type, but a definition on what the input for a register must have.
module.exports = gql`
  type Incident {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
  }
  type Comment{
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput { 
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getIncidents: [Incident]
    getIncident(incidentId: ID!): Incident
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createIncident(body: String!): Incident!
    deleteIncident(incidentId: ID!): String!
    createComment(incidentId: ID!, body: String!): Incident!
    deleteComment(incidentId: ID!, commentId: ID!): Incident!
  }
`;
