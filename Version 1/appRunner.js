const express = require('express');
const path = require('path');

const { MongoClient } = require('mongodb');

const app = express();
const port = 8080;

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