import {dbConnection} from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

//sohamtalekar7
//M2ipPScIenofgtW4

//TODO: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT
export const users = getCollectionFn('user');
export const boarding = getCollectionFn('boarding');
export const salary = getCollectionFn('salary');
export const documents = getCollectionFn('documents')