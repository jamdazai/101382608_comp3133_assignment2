/**
 * @author: Jam Furaque
 */

const { GraphQLUpload } = require('graphql-upload');         // ADDED FOR FILE UPLOAD
const fs = require('fs');
const path = require('path');
const { check, validationResult } = require('express-validator');
const Employee = require('../models/employee');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

module.exports = {
  Upload: GraphQLUpload,                                                                  // FILE UPLOAD TYPE

  Query: {
    getAllEmployees: authMiddleware(async () => {                                         // GET ALL EMPLOYEES FUNCTION
      try {
        return await Employee.find()
        .select("_id firstName lastName email gender designation salary date_of_joining department employeePhoto");
      } catch (error) {
        throw new Error('Error retrieving employees: ' + error.message);
      }
    }),

    getEmployeeById: authMiddleware(async (_, { eid }) => {                              // GET EMPLOYEE BY ID FUNCTION
      await check('eid', 'Invalid Employee ID')                                          // Again, before getting the employee by ID
      .isMongoId().run({ params: { eid } });                                             // Check if ID is valid.,

      const errors = validationResult({ params: { eid } });
      if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg);
      }

      try {
        const employee = await Employee.findById(eid).select("_id firstName lastName email designation salary date_of_joining department employeePhoto");                                  // SEARCH EMPLOYEE BY ID
        if (!employee) {
          throw new Error('Employee not found.');                                       // BRO, THE EMPLOYEE IS MISSING!
        }
        return employee;                                                                // FOUND HIM!
      } catch (error) {
        throw new Error('Error finding employee: ' + error.message);
      }
    }),

    searchEmployeeBy: authMiddleware(async (_, { input }) => {                                       // SEARCH EMPLOYEE BY FUNCTION           
      try {                                                                                          // Dude, with this function, we can find
        const query = {};                                                                            // eomployee either by department or designation
        if (input.department) {
          await check('department', 'Department cannot be empty').notEmpty().run({ body: input });
          query.department = input.department;
        }
        if (input.designation) {
          await check('designation', 'Designation cannot be empty').notEmpty().run({ body: input });
          query.designation = input.designation;
        }

        const errors = validationResult({ body: input });
        if (!errors.isEmpty()) {
          throw new Error(errors.array()[0].msg);
        }

        if (Object.keys(query).length === 0) {
          throw new Error('Provide department or designation');
        }

        return await Employee.find(query);
      } catch (error) {
        throw new Error('Error searching employees: ' + error.message);
      }
    }),
  },

  Mutation: {
    createEmployee: authMiddleware(async (_, { employeeInput }) => {                      // FUNCTION TO CREATE EMPLOYEE
      const validations = [                                                               // THESE ARE SOME FEW VALIDATIONS
          check('email', 'Invalid email format').isEmail(),                               // WE HAVE ONA OUR BOAT :))
          check('salary', 'Salary must be at least 1000').isFloat({ min: 1000 }),
          check('firstName', 'First name is required').notEmpty(),
          check('lastName', 'Last name is required').notEmpty(),
          check('designation', 'Designation is required').notEmpty(),
          check('department', 'Department is required').notEmpty(),
      ];
  
      for (let validation of validations) {
          const result = await validation.run({ body: employeeInput });
          if (!result.isEmpty()) {
              throw new Error(result.array()[0].msg);
          }
      }

      const existing = await Employee.findOne({ email: employeeInput.email });
      if (existing) {
        throw new Error('Employee with this email already exists.');
      }
  

      const employee = new Employee(employeeInput);
        await employee.save();
        return employee;
      }),
  //     try {
  //         const { email } = employeeInput;
  //         const existingEmployee = await Employee.findOne({ email });
  //         if (existingEmployee) {
  //             throw new Error('Employee with this email already exists.');
  //         }
  
  //         let uploadedFilePath = null;
  //         if (file) {
  //             console.log("📂 Received File:", file);
              
  //             const upload = await file;
  //             if (!upload || !upload.file || !upload.file.filename) {
  //                 throw new Error("Error: Filename is missing.");
  //             }
  
  //             const { createReadStream, filename } = upload.file;
  //             const uploadDir = path.join(__dirname, '../uploads');
  
  //             if (!fs.existsSync(uploadDir)) {
  //                 fs.mkdirSync(uploadDir, { recursive: true });
  //             }
  
  //             const filePath = path.join(uploadDir, filename);
  //             const stream = createReadStream();
  //             await new Promise((resolve, reject) => {
  //                 const out = fs.createWriteStream(filePath);
  //                 stream.pipe(out);
  //                 out.on('finish', resolve);
  //                 out.on('error', reject);
  //             });
  //             uploadedFilePath = `/uploads/${filename}`;
  //         }
  //         console.log("Final employee input going into DB:", employeeInput);
  //         const employee = new Employee({ 
  //           ...employeeInput, 
  //           employeePhoto: uploadedFilePath 
  //         });
  //         await employee.save();
  //         console.log("Employee Created:", employee);                                           // JUST A LOG CUZ IM MESSED UP EARLIER
  //         return employee;
  //     } catch (error) {
  //         throw new Error('Error creating employee: ' + error.message);
  //     }
  // }),
  
  
//   updateEmployee: authMiddleware(async (_, { eid, employeeInput, file }) => {                 // FUNCTION TO UPDATE EMPLOYEE
//     try {
//         console.log("Received Employee ID:", eid);                                            // DONT MIND THESE LOGS
//         console.log("Received File:", file);                                                  // I DONT KNOW WHERE'S THE ERROR EARLIER
//         console.log("Received Employee Input:", employeeInput);                               // SO I WAST JUST TRYING TO HELP THE EARTH
//         if (!mongoose.Types.ObjectId.isValid(eid)) {
//             throw new Error(`Invalid Employee ID: ${eid}.`);
//         }
//         const objectId = new mongoose.Types.ObjectId(eid);
//         const employee = await Employee.findById(objectId);
//         if (!employee) {
//             throw new Error("Employee not found.");
//         }

//         let uploadedFilePath = employee.employeePhoto;                                // IN THIS PART, I WANT TO HANDLE FILE UPLOAD
//         if (file) {                                                                   // KEEPS GETTING ME ERROR ON POSTMAN -_-
//             console.log("Resolving file..");
//             const resolvedFile = await file.promise;
//             console.log("Resolved File Object: ", resolvedFile);

//             const { createReadStream, filename, mimetype } = resolvedFile;

//             if (!filename) {
//                 throw new Error("Filename is undefined.");                            // FREAKIN FILE NAME, IDK WHAT;S WRONG WITH U
//             }

//             console.log("📂 Resolved File Data:", { filename, mimetype });
//             const uploadDir = path.join(__dirname, "../uploads");
//             if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//             const filePath = path.join(uploadDir, filename);
//             const stream = createReadStream();
//             await new Promise((resolve, reject) => {
//                 const out = fs.createWriteStream(filePath);
//                 stream.pipe(out);
//                 out.on("finish", resolve);
//                 out.on("error", reject);
//             });
//             uploadedFilePath = `/uploads/${filename}`;
//         }

//         if (!employeeInput) {
//             throw new Error("sOME input is missing from the request.");
//         }

//         const updatedData = { ...employeeInput };
//         if (file) {
//             updatedData.employeePhoto = uploadedFilePath;
//         }
//         console.log("Updating employee with these data: ", updatedData);
//         const updatedEmployee = await Employee.findByIdAndUpdate(
//             objectId,
//             { $set: updatedData },
//             { new: true, runValidators: true }
//         );
//         console.log("Successfully updated employee: ", updatedEmployee);
//         return updatedEmployee;
//     } catch (error) {
//         console.error("Something went wrong..", error.message);
//         throw new Error("Something went wrong. Error updating employee: " + error.message);
//     }
// }),

    updateEmployee: authMiddleware(async (_, { eid, employeeInput }) => {
      if (!mongoose.Types.ObjectId.isValid(eid)) {
        throw new Error(`Invalid Employee ID: ${eid}.`);
      }

      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error("Employee not found.");
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        eid,
        { $set: employeeInput },
        { new: true, runValidators: true }
      );
      return updatedEmployee;
    }),



    deleteEmployee: authMiddleware(async (_, { eid }) => {                              // FUNCTION TO DELETE EMPLOYEE
      await check('eid', 'Invalid Employee ID')                                         // THIS IS USEFUL MOSTLY
      .isMongoId().run({ params: { eid } });                                            // WHEN COMPANY IS FIRING PPL LOL
      const errors = validationResult({ params: { eid } });
      if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg);
      }

      try {
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) {
          throw new Error('Employee not found.');
        }
        return 'Employee deleted successfully.';                                        // EMPLOYEE ELIMINATED LOL
      } catch (error) {
        throw new Error('Error deleting employee: ' + error.message);
      }
    }),


    uploadEmployeePhoto: authMiddleware(async (_, { file }) => {            // UPLOAD EMPLOYEE PHOTO FUNCTION
      try {                                                                 // PROF, IF YOURE READING THIS
          if (!file) {                                                      // I WANT YOU TO KNOW THIS CAUSE ME A LOT OF TROUBLE HAHAHA
              throw new Error('No file uploaded');
          }
          console.log("Received file:", file);                              // THESE LOGS INDICATES MY FRUSTRATION BC OF ERRORS

          const resolvedFile = await file;                                  
          console.log("Resolved file:", resolvedFile);                      // RESOLVE THE PROMISE INSIDE THE UPLOAD OBJECT
          
          const fileData = await resolvedFile.promise;
          console.log("Extracted fileData:", fileData);
  
          const { filename, mimetype, createReadStream } = fileData;
          console.log("Parsed file:", { filename, mimetype });
  
          if (!filename) {
              throw new Error('Filename undefined.');
          }
  
          const uploadDir = path.join(__dirname, '../uploads');

          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);           // DONT FORGET TO CHECK THE UPLOAD DIRECTORYW
          const filePath = path.join(uploadDir, filename);                  // NOW, CREATE THE FILE PATH
          const stream = createReadStream();                                // AND THEN, CREATE THE STREAM
          await new Promise((resolve, reject) => {
              const out = fs.createWriteStream(filePath);
              stream.pipe(out);
              out.on('finish', resolve);
              out.on('error', reject);
          });
          console.log("File uploaded successfully:", filePath);
          return `/uploads/${filename}`;
        } catch (error) {
          console.error('Upload Error:', error);
          throw new Error('File upload failed: ' + error.message);
        }
    }),
  },
};
