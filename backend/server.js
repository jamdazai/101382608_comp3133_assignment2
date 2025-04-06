/**
 * @author: Jam Furaque
 */
const express = require('express');
const path = require('path');
const { graphqlUploadExpress } = require('graphql-upload');
const { ApolloServer } = require('apollo-server-express');
const databaseConnection = require('./config/db');
const typeDefs = require('./typeDefs/combineDefs');
const resolvers = require('./resolvers/combineResolver');
const multer = require('multer');
const cors = require('cors');                                   // I INSTALLED CORS CUZ MAN, GRAPHQL WONT WORK ON MY BROWSER
require('dotenv').config();                                     // FORGOT THAT I COULD JUST USE POSTMAN LOL

const app = express();
// app.use(cors({
//     origin: 'http://localhost:4200',
//     credentials: true                
//   }));
const corsOptions = {
    origin: ['http://localhost:4200', 'https://your-vercel-domain.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  app.use(cors(corsOptions));
  

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});
const upload = multer({ storage });

app.post('/upload-photo', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
    const imagePath = `/uploads/${req.file.filename}`;
    return res.json({ imagePath });
});


app.use(graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 }));
databaseConnection();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

server.start().then(() => {
    server.applyMiddleware({ app, cors: false });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}).catch((error) => {
    console.log('Server failed to start:', error);
});
