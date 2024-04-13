//Here you will import route files and export them as used in previous labs
import user_Test from './user_Test.js';
import path from 'path';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
    app.use('/users', user_Test);
    app.use('/public', staticDir('public'));
    app.use('*', (req, res) => {
      res.redirect('/');
  });
};
  
export default constructorMethod;
  