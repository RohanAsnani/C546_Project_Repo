//Here you will import route files and export them as used in previous labs
import user_Post from './user_Post.js';
import path from 'path';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
    app.use('/', user_Post);
    app.use('/public', staticDir('public'));
    app.use('*', (req, res) => {
      res.redirect('/');
  });
};
  
export default constructorMethod;
  