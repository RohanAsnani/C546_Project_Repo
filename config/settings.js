//TODO: YOU WILL NEED TO CHANGE THE DB NAME TO MATCH THE REQUIRED DB NAME IN THE ASSIGNMENT SPECS!!!
//You may have to change localhost to 127.0.0.1 if localhost is not working for you
import dotenv from 'dotenv';
dotenv.config();

export const mongoConfig = {
  serverUrl: process.env.DB_URL,
  database: process.env.DB_NAME
};
