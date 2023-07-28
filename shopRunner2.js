const express = require('express');
const path = require('path');

const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));


const uri = 'mongodb://127.0.0.1:27017/ITPE003-FinalOutput';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('homepage', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/shop', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('shop', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cart', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('myCart', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/mycart', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('myCart', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/myaccount', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('user-account', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/about', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('about', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/shop-dashboard', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('shop-dashboard', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/login-user', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('login-user', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await connectToDB();
  const collection = db.collection('users');

  // Check if the user exists in the database
  const user = await collection.findOne({ username, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Provide some response or redirect to a dashboard page
  return res.json({ message: 'Login successful' });
});

// User Sign Up
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const db = await connectToDB();
  const collection = db.collection('users');

  // Check if the user already exists in the database
  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Insert the new user into the database
  const newUser = await collection.insertOne({ username, password });

  // Provide some response or redirect to a dashboard page
  return res.json({ message: 'Sign up successful' });
});

app.get('/login-admin', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('login-admin', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/contact', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('contactus', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/registernNewAccount', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('shopItems');
    
    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Render the EJS template and pass the data
    res.render('register', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});