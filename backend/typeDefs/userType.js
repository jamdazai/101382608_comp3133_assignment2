/**
 * @author: Jam Furaque
 */

const { gql } = require('apollo-server-express');

const userType = gql`
    type User {                 
        _id: ID!
        username: String!
        email: String!
        password: String!
        created: String!
        updated: String!
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type Auth {
        token: String!
        user: User!
    }

    type Query {
        login(usernameOrEmail: String!, password: String!): Auth
    }
    
    type Mutation {
        signup(userInput: UserInput): User
    }
`;

module.exports = userType;