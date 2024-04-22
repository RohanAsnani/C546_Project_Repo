//Here you will import route files and export them as used in previous labs
import user_Test from './user_Test.js';
import boardRoutes from './board.js';
import path from 'path';
import { static as staticDir } from 'express';

const constructorMethod = (app) => {
  // app.use('/', user_Test);
  app.use('/users', user_Test);
  app.use('/hr', boardRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not found' });
  });
};

export default constructorMethod;
