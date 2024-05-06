//Here is where you'll set up your server as shown in lecture code
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import {dbConnection, closeConnection} from './config/mongoConnection.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import userTest from './data/user_Test.js';
import * as validation from "./helpers.js"

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

const hbs = exphbs.create({ defaultLayout: 'main', helpers: {json: function (context) {return JSON.stringify(context)}}});

hbs.handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// app.engine('handlebars', exphbs.engine({defaultLayout: 'main',
// helpers: {
//   // Defined a json helper to stringify objects needed for charts
//   json: function (context) {
//       return JSON.stringify(context);}}}));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  name: 'AuthenticationState',
  secret:'This is a secret.',
  resave: false,
  saveUninitialized: false
}))

app.use('/hrc/forgotpass',(req,res,next)=>{
  if(req.session.user){
    switch (req.session.user.role){
        case 'Admin':
          return res.redirect('/hrc/admin');
        case 'Employee': 
          return res.redirect('/hrc/employee');
        case 'HR':
          return res.redirect('/hrc/hr');
        default:
          return res.render('error',{message:'Forbidden',title:'Forbidden',class:'error',previous_Route:'hrc/login',linkMessage:'Click Here to Login.'})
    }
  }
  next();
})

app.use('/hrc/onboarding',(req,res,next)=>{
  if(!req.session.user){
    return res.redirect('/hrc/login')
  }
  next();
})

app.use('/hrc/login',(req,res,next)=>{
  if(req.session.user){
    switch(req.session.user.role){
      case 'Admin':
        return res.redirect('/hrc/admin');
      case 'Employee': 
        return res.redirect('/hrc/employee');
      case 'HR':
        return res.redirect('/hrc/hr');
      default:
        return res.render('error',{message:'Forbidden',title:'Forbidden',class:'error',previous_Route:'hrc/login',linkMessage:'Click Here to Login.'})
    }
  }
  next();
});


app.use('/hrc/admin',(req,res,next)=>{
  if(req.session.user){
    if(req.session.user.status === 'Onboarding'){
      return res.redirect('/hrc/notonboarded');
    }
    if(req.session.user.status === 'Onboarding(Employee-Side)'){
      return res.redirect('/hrc/onboarding');
    }
    if(req.session.user.endDate){
      let resignedDate = new Date(req.session.user.endDate);
      if(validation.isPastDate(resignedDate)) {
        userTest.deactivateUser(req.session.user.employeeId);
        return res.redirect('/hrc/deactivated');
      }
    }
    if(req.session.user.role !== 'Admin'){
      return res.status(403).render('error',{message:'Forbidden',title:'Forbidden',class:'error',previous_Route:'hrc/login',linkMessage:'Click Here to Login.'});
    }
    next();
  }else{
    return res.redirect('/hrc/login');
  }
});



app.use('/hrc/employee', (req, res, next) => {
  if (req.session.user) {
    if(req.originalUrl === '/hrc/employee/profile/edit'|| req.originalUrl ==='/hrc/employee/getAllToDoByEmpId'|| req.originalUrl === '/hrc/employee/profile'|| req.originalUrl.startsWith('hrc/employee/fillForm') || req.originalUrl.startsWith('/hrc/employee/fillForm/')|| req.originalUrl === '/hrc/employee/selectBenifitsForm' || req.originalUrl === '/hrc/employee/fillSalaryForm'){
      next();
    }else{
      if(req.session.user.status === 'Onboarding'){
        return res.redirect('/hrc/notonboarded');
      }

      if(req.session.user.status === 'Onboarding(Employee-Side)'){
        return res.redirect('/hrc/onboarding');
      }

      if(req.session.user.endDate){
        let resignedDate = new Date(req.session.user.endDate);
        if(validation.isPastDate(resignedDate)) {
          userTest.deactivateUser(req.session.user.employeeId);
          return res.redirect('/hrc/deactivated');
        }
      }
      if (req.session.user.role !== 'Employee' &&   req.session.user.role !== 'Admin' && req.session.user.role !== 'HR') {
        return res.status(403).render('error', { message: 'Forbidden', title: 'Forbidden', class: 'error', previous_Route: 'hrc/login', linkMessage: 'Click Here to Login.' });
      }
      if (req.session.user.role === 'Employee') {
        if (req.originalUrl.startsWith('/hrc/employee/completeTask')) {
          if (req.method == 'GET') {
            req.method = 'PATCH';
          }
        }
      }
      next();
    }
  }else{
     return res.redirect('/hrc/login');
  }
});

app.use('/hrc/hr', (req, res, next) => {

  if (req.session.user) {
    if(req.session.user.status === 'Onboarding'){
      return res.redirect('/hrc/notonboarded');
    }
    if(req.session.user.status === 'Onboarding(Employee-Side)'){
      return res.redirect('/hrc/onboarding');
    }
    if(req.session.user.endDate){
      let resignedDate = new Date(req.session.user.endDate);
      if(validation.isPastDate(resignedDate)) {
        userTest.deactivateUser(req.session.user.employeeId);
        return res.redirect('/hrc/deactivated');
      }
    }
    if (req.session.user.role !== 'HR') {
      return res.status(403).render('error', { message: 'Forbidden', title: 'Forbidden', class: 'error', previous_Route: 'hrc/login', linkMessage: 'Click Here to Login.' });
    } else {
      if (req.originalUrl.startsWith('/hrc/hr/deleteTask')) {
        if (req.method == 'GET') {
          req.method = 'DELETE';
        }
      } else if (req.originalUrl.startsWith('/hrc/hr/emailReminder')) {
        if (req.method == 'GET') {
          req.method = 'POST';
        }
      }
    }
    next();
  }else{
    return res.redirect('/hrc/login');
    }
});


app.use('/',(req,res,next)=>{
    console.log( new Date().toString());
    console.log(req.method);
    console.log(req.originalUrl);
    
    if(req.originalUrl === '/'){
    if(req.session.user){
      switch(req.session.user.role){
        case 'Admin':
          return res.redirect('/admin');
        case 'HR':
          return res.redirect('/hr');
        case 'Employee':
          return res.redirect('/employee');
        
      }
    }else{
      return res.redirect('/hrc/login');
      }
  }
  next();
});

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