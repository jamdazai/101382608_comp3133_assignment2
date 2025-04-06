const { gql } = require('apollo-server-express');

const employeeType = gql`
    scalar Upload  # Support file upload

    type Employee {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employeePhoto: String
        created: String!
        updated: String!
    }

    input EmployeeInput {
        firstName: String
        lastName: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: String
        department: String
        employeePhoto: String
    }

    input SearchEmployeeInput {
        department: String
        designation: String
    }

    type Query {
        searchEmployeeBy(input: SearchEmployeeInput!): [Employee]
        getEmployeeById(eid: ID!): Employee
        getAllEmployees: [Employee]
    }

    type Mutation {
        createEmployee(employeeInput: EmployeeInput): Employee
        updateEmployee(eid: ID!, employeeInput: EmployeeInput): Employee
        deleteEmployee(eid: ID!): String
        uploadEmployeePhoto(file: Upload!): String
    }
`;

module.exports = employeeType;
