//INITIALIZE METHODS
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// CONNECTION URL AND DATABASE NAMES
const url = 'mongodb://localhost:27017';
const dbName = 'ITPE003-FinalOutput';
const collectionName = 'shopItems';

// DATABASE COLLECTIONS
const usersDB = 'users';
const productsDB = 'shotItems';
const userCartsDB = 'userCarts';

const uri = 'mongodb://localhost:27017/ITPE003-FinalOutput';
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

let db;

async function connectToDatabase() {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  db = client.db(dbName);
}
// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ESTABLISH DIRECTORY PATHS
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// UTILIZE EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



// PAGE LOADERS
//HOMEPAGE
// app.get('/', async(req, res) => { 
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('users'); // CHANGE ACCORDING TO DATABASE COLLECTION REFERENCE NEED
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('homepage', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/shop', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');

//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('shop', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/cart', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('myCart', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/mycart', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('myCart', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/myaccount', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('user-account', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/about', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('about', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/shop-dashboard', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('shop-dashboard', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/login-user', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('login-user', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/login-admin', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('login-admin', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/contact', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('shopItems');
    
//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('contactus', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.get('/registernNewAccount', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/register.html'));
});

app.post('/DBcreateAccountForm', async (req, res) => {
  console.log(req.body);
  const { username, userpass} = req.body;
    console.log('Received request body:', req.body);

  //check for empid if it already exists in the database
  try{
      // connect to the collection usersDB
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('usersDB');

      //insert the new user into the database using insertone()
      const result = await collection.insertOne(req.body);
      console.log(`Successfully inserted item with _id: ${result.insertedId}`);
      res.status(200).json({ message: 'Successfully inserted item!' });
      client.close();


  } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
          console.log('Duplicate entry for empid:', empid);
          return res.status(400).json({ error: 'The provided empid already exists.' });
      }

      console.error('Duplicate entry for empid:', empid);
      return res.status(500).json({ error: 'An error occurred while inserting the record.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Start the server and connect to the database
// connectToDatabase()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//   });