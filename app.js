//Here is where you'll set up your server as shown in lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import {dbConnection, closeConnection} from './config/mongoConnection.js';

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   // If the user posts to the server with a property called _method, rewrite the request's method
//   // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
//   // rewritten in this middleware to a PUT route
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }

//   // let the next middleware run:
//   next();
// };

const db = await dbConnection();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

const server = app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

// Listen for server close event
server.on('close', () => {
  // Close the database connection
  closeConnection()
    .then(() => {
      console.log("Database connection closed.");
    })
    .catch((error) => {
      console.error("Error while closing database connection:", error);
    });
});