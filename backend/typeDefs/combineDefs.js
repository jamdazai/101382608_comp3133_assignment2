/**
 * @author: Jam Furaque
 */

// HOW IS IT GOING?
// IN THIS FILE, WE WILL COMBINE OUR TYPE DEFINITIONS.
// YOU KNOW WHY? BECAUSE WE WANT TO MAKE IT MORE ORGANIZED, WOW ORGANIZED? :O
// OKAY, LET'S GET STARTED.

const userType = require('./userType');
const employeeType = require('./employeeType');
module.exports = [userType, employeeType];              // WE'RE GOING TO EXPORT THIS TO OUR SERVER.JS FILE, SO WE CAN USE IT THERE.
