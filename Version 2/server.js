// IMPORT EXPRESS, PATH, MONGODB, EJS, CORS, HTTP, AND COOKIE-PARSER...
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const nodemon = require('nodemon');
const { get } = require('http');
const { MongoClient, ObjectId } = require('mongodb');

// CREATE EXPRESS APP
const app = express();
const port = 1425;

// MONGODB CONNECTION DETAILS
const url = 'mongodb://127.0.0.1:27017/';
// Database Name
const DBName = 'liveDev';

const uri = url + DBName;
// Container Names 
const userDB = 'users';
const shopItemsDB = 'shopItems';
const cartDB = 'userCarts';

let db;
app.use(cors());

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
async function connectToDatabase() {
  const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
  db = client.db(DBName);
}

// a variable to save a session
var session;

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname+'\\views');

// INITIALIZE DIRECTORIES
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, '/public/img')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));



// SESSION SAVE
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


// a variable to save a session
var session;

// ROUTES FOR OUR API

app.get('/', async (req, res) => {
    res.redirect('page-home');
});

app.get('/page-home', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        db = client.db(DBName);
        const collection = db.collection(shopItemsDB);

        // REGEX QUERY CAN BE CHANGED DEPENDING ON THE SEARCH
        const shopItems = await collection.find({"title" : {$regex : "Lfrith"}}).toArray();

        // console.log(shopItems); // DEBUG

        res.render('page-home-dynamic', {shopItems: shopItems});
    } catch (error) {
        console.log(error);
    }
});

app.get('/page-about', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    db = client.db(DBName);
    const collection = db.collection(shopItemsDB);

    const featuredShopItems = await collection.find({"title" : {$regex : "Lfrith"}}).toArray();

    res.render('page-about-dynamic', {shopItems: featuredShopItems});

  } catch (error) {
    console.log(error);
  }
});

app.get('/page-shop-development', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    db = client.db(DBName);
    const collection = db.collection(shopItemsDB);

    const shopItems = await collection.find({}).toArray();

    res.render('page-about-dynamic', {shopItems: shopItems});

  } catch (error) {
    console.log(error);
  }
});







// LOGINS 
app.get('/login', async (req, res) => {
    res.render('account-login-user');
});

app.get('/login-admin', async (req, res) => {
  res.render('account-login-admin');
});






























// ROUTE TO 404 WHEN ROUTE IS NOT FOUND
app.use(function(req, res, next) {
  res.status(404).sendFile('\\views\\404.html', {root: __dirname});
});

// 404 ROUTE FOR Error: Failed to lookup view 
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(404).sendFile('\\views\\404.html', {root: __dirname});
});

// Start the server and connect to the database
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
