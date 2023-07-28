//INITIALIZE METHODS
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// CONNECTION URL AND DATABASE NAMES
const url = 'mongodb://localhost:27017';
const usersDB = 'users';
const productsDB = 'shotItems';
const userCartsDB = 'userCarts';

let db;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

