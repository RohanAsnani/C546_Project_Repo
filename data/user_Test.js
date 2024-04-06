//import axios, md5
import axios from "axios";
import * as helpers from "../helpers.js"
import { users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"

const getAll = async () => {
    const userCollection = await users()
    let prodList = await userCollection.find({}).toArray()
    if(!prodList){
      return []
    }
    return prodList
  };

export {getAll}