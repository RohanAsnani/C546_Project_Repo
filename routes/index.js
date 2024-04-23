//Here you will import route files and export them as used in previous labs
import user_Test from './user_Test.js';
import boardRoutes from './board.js';
import login from './login.js';
import path from 'path';
import { static as staticDir } from 'express';

const constructorMethod = (app) => {
  app.use('/login',login);
  app.use('/users', user_Test);
  app.use('/hr', boardRoutes);
  app.use('/', user_Test);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not found' });
  });
};

export default constructorMethod;
