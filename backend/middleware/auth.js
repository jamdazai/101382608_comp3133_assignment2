/**
 * @author: Jam Furaque
 */

// ALRIGHT, WITH THIS FILE,
// WE'RE GOING TO MODIFY OUR MIDDLEWARE FOR AUTHENTICATIONS
// THIS WAY, IT'S A LOT MORE CONVENIENT.

const jwt = require('jsonwebtoken');                                          // Don't forget to use our baby jwt, it's important.

const authMiddleware = (next) => async (parent, args, context) => {           // We're going to use this middleware for our resolvers
  const { req } = context;                                                    // Usually, we use this for authentication purposes.
  if (!req || !req.headers || !req.headers.authorization) {
    const error = new Error('Unauthorized: Missing authorization header');
    error.status = 401; 
    throw error;
  }

  const token = req.headers.authorization.split(' ')[1];                      // We're going to split the token from the header
  if (!token) {                                                               // If there's no token, we're going to throw an error
    const error = new Error('Unauthorized: Token not provided');              // We don't want unauthorized access in our system.
    error.status = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);                // Then, that's it!
    context.user = decoded;                                                   // With this function, we can now validate
    return next(parent, args, context);                                       // the token and use it for our resolvers.
  } catch (error) {
    error.status = 403;
    throw error;
  }
};  

module.exports = authMiddleware;
