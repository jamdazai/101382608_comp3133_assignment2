/**
 * @author: Jam Furaque
 */

// IN THIS FILE, WE'RE GOING TO COMBINE THE POWER OF OUR RESOLVER!
// WE'RE GOING TO MAKE IT POWERFUL LOL, KIDDING.

const userResolver = require('./resolverUser');
const employeeResolver = require('./resolverEmployee');

module.exports = {

    Query: {
        ...userResolver.Query,
        ...employeeResolver.Query
    },

    Mutation: {
        ...userResolver.Mutation,
        ...employeeResolver.Mutation
    }
    
};