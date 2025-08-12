export const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    health: HealthStatus!
  }

  type Mutation {
    sendMessage(message: String!): ChatResponse!
  }

  type ChatResponse {
    response: String!
    error: String
  }

  type HealthStatus {
    status: String!
    timestamp: String!
    version: String!
  }
`;