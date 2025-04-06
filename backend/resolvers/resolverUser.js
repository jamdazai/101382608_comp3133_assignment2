/**
 * @author: Jam Furaque
 */

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateUserInput = (userInput) => {                                          // DEAR UNIVERSE, THIS FUNCTION WILL GOING TO 
  const errors = [];                                                                // VALIDATE THE USER INPUTS HOHOHOHO.

  if (!userInput.username || userInput.username.trim() === '') {                    // username is required bro, you can't run away from this
    errors.push('Username is required');                                            // it cannot be null nor empty :)
  }

  if (!userInput.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput.email)) {    // when it comes to email, it should be valid
    errors.push('Invalid email format');                                            // we dont want invalid email in our system, it sucks
  }

  if (!userInput.password || userInput.password.length < 6) {                       // I don't know about the individual who started this but
    errors.push('Password must be at least 6 characters');                          // password's length shouls be atleast 6 characters.
  }

  if (errors.length > 0) {
    throw new Error(errors[0]); 
  }
};

module.exports = {
  Query: {
    login: async (_, { usernameOrEmail, password }) => {                             // LOGIN QUERY
      if (!usernameOrEmail || !password) {                                           // In here, we will check if the username or email
        throw new Error('Username or Email and Password are required');              // and password are provided by the user.
      }

      try {
        const user = await User.findOne({                                            // If the user is found,
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],          // we will check if the password is correct
        });

        if (!user) {                                                                 // if not, we will throw an error          
          throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);               // the exciting part is here, we will compare the password
        if (!isMatch) {                                                              // bro should be accurate with their password eh?
          throw new Error('Invalid credentials. Please try again');                  // if not, we won't allow them to enter the kingdom.
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );
        return { token, user };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { userInput }) => {                                             // SIGNUP MUTATION
      try {
        validateUserInput(userInput);                                                 // Before we summon a user to our realm, 
        const { username, email, password } = userInput;                              // we need to validate the user inputs first.
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });  // also we need to know if they already exist

        if (existingUser) {                                                           // If they're already existing
          throw new Error('Username or Email already exists.');                       // then we'll let them know
        }

        const user = new User({ username, email, password });                         // If not, then let's bring them to our world
        await user.save();                                                            // Save them to our database
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
