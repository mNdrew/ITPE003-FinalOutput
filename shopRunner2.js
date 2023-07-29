const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
const { get } = require('http');
// const session = require('express-session');
const app = express();
const port = 3030;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'ITPE003-FinalOutput';
const collectionName = 'users';
let db;

const uri = 'mongodb://127.0.0.1:27017/ITPE003-FinalOutput';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


let myUserObjectType = null;
let myUsername = null;
let myUserID = null;


app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

async function connectToDatabase() {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  db = client.db(dbName);

  // Create a messages collection if it doesn't exist
  await db.createCollection('messages');
}

app.use(express.json());
app.use(cors());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  // render homepage.ejs
  res.render(path.join(__dirname, '/views/homepage.ejs'));
});

app.get('/home', (req, res) => {
  // render homepage.ejs
  res.render(path.join(__dirname, '/views/homepage.ejs'));
});







app.post('/contact-form-submit', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received request body:', req.body);

  try {
    if (!db) {
      console.log('Database connection is not established yet.');
      return res.status(500).json({ error: 'Database connection is not ready.' });
    }

    await db.collection('messages').insertOne({
      name,
      email,
      message,
      timestamp: new Date(), // Optional: You can add a timestamp to record when the message was submitted.
    });

    console.log('Message Inserted Successfully!', req.body);
    res.status(201).json({ message: 'Message inserted successfully!' });
  } catch (err) {
    console.error('Error inserting message:', err);
    return res.status(500).json({ error: 'An error occurred while inserting the message.' });
  }
});


app.get('/contact', async (req, res) => {
  try {
    // Ensure the database connection is established before fetching messages
    if (!db) {
      console.log('Database connection is not established yet.');
      return res.status(500).json({ error: 'Database connection is not ready.' });
    }



app.get('/about', async (req, res) => {
  
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('users');


      // Fetch data from MongoDB
      const itemData = await collection.find({objectType: 'shopItem' }).limit(6).toArray();

      // Render the EJS template and pass the data
      res.render('about', { itemData});

      // Remember to close the MongoDB connection
      client.close();
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/registernNewAccount', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.post('/newAccountRegister', async (req, res) => {
  const {username, userpass} = req.body;
  console.log('Received request body:', req.body);

  try {
    if (!db) {
      console.log('Database connection is not established yet.');
      return res.status(500).json({ error: 'Database connection is not ready.' });
    }

    await db.collection(collectionName).insertOne({
      // INSERT USER OBJECT TYPE
      objectType: 'user',
      username,
      userpass,
      cartItems: [],
    });

    console.log('Record Inserted Successfully!' + req.body);
    res.status(201).json({ message: 'Record inserted successfully!' });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      console.log('Duplicate entry for empid:', username);
      return res.status(400).json({ error: 'The provided username already exists.' });
    }

    console.error('Duplicate entry for empid:', username);
    return res.status(500).json({ error: 'An error occurred while inserting the record.' });
  }
});

app.get('/login-user', (req, res) => {
  res.  sendFile(path.join(__dirname, '/views/login-user.html'));
});

app.get('/login-admin', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login-admin.html'));
});

//LOGOUT
app.get('/logout', (req, res) => {
  myUserObjectType = null;
  myUsername = null;
  myUserID = null;
  res.redirect('/home');
});

//LOGIN USER
app.get('/searchVerifyUser', async (req, res) => {
  console.log('Received request query:', req.query);
  const usernameQuery = req.query.username; // Assuming the query parameter is 'username'
  const userpassQuery = req.query.userpass; // Assuming the query parameter is 'userpass'

  try {
    // Ensure the database connection is established before searching
    if (!db) {
      console.log('Database connection is not established yet.');
      return res.status(500).json({ error: 'Database connection is not ready.' });
    }

    // Search for the user record with the provided username
    const user = await db.collection(collectionName).findOne({ objectType: 'user', username: usernameQuery });

    if (user) {
      // Check if the provided password matches the stored password
      if (userpassQuery === user.userpass) {
        console.log('Correct password.');
        
        myUserObjectType = user.objectType;
        myUserID = user._id;

        console.log(myUserID,myUserObjectType);

        
        res.status(200).json(user);
      } else {
        console.log('Incorrect password.');
        res.status(401).json({ error: 'Incorrect password.' });
      }
    } else {
      console.log('No user found with the provided username.');
      res.status(404).json({ error: 'No user found with the provided username.' });
    }
  } catch (err) {
    console.error('Error searching for username:', err);
    res.status(500).json({ error: 'An error occurred while searching for the username.' });
  }
});

app.get('/searchVerifyAdmin', async (req, res) => {
  console.log('Received request query:', req.query);
  const usernameQuery = req.query.username; // Assuming the query parameter is 'username'
  const userpassQuery = req.query.userpass; // Assuming the query parameter is 'userpass'

  try {
    // Ensure the database connection is established before searching
    if (!db) {
      console.log('Database connection is not established yet.');
      return res.status(500).json({ error: 'Database connection is not ready.' });
    }

    // Search for the admin record with the provided username
    const user = await db.collection(collectionName).findOne({ objectType: 'admin', username: usernameQuery });

    if (user) {
      // Check if the provided password matches the stored password
      if (userpassQuery === user.userpass) {
        console.log('Correct password.');
        
        // Store the username in session storage
        myUserObjectType = user.objectType;
        console.log(myUserObjectType);
        
        res.status(200).json(user);
      } else {
        console.log('Incorrect password.');
        res.status(401).json({ error: 'Incorrect password.' });
      }
    } else {
      console.log('No user found with the provided username.');
      res.status(404).json({ error: 'No user found with the provided username.' });
    }
  } catch (err) {
    console.error('Error searching for username:', err);
    res.status(500).json({ error: 'An error occurred while searching for the username.' });
  }
});

app.get('/shop-dashboard', async (req, res) => {
  if(myUserObjectType == 'admin') {
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('users');
      
      // Fetch data from MongoDB
      const data = await collection.find({objectType: 'shopItem'}).toArray();

      // Render the EJS template and pass the data
      res.render('shop-dashboard', { data });

      // Remember to close the MongoDB connection
      client.close();
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    } 
  } else {
    res.redirect('/login-admin');
  }
});

app.get('/contact', async (req, res) => {
  if(myUserObjectType != 'admin') {
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('users');
      
      // Fetch data from MongoDB
      const data = await collection.find({objectType: 'shopItem'}).toArray();

      // Render the EJS template and pass the data
      res.render('contactus', { data });

      // Remember to close the MongoDB connection
      client.close();
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    } 
  } else {
    res.redirect('/myAccount');
  }
});

app.get('/myAccount', async (req, res) => {
  //verify if myObject type is user
  if (myUserObjectType == 'user' || myUserObjectType == 'admin') {
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('users');
      
      // Fetch data from MongoDB
      const userInfo = await collection.find({_id: myUserID}).toArray();
  
      // Render the EJS template and pass the data
      res.render('myAccount', { userInfo });
  
      // Remember to close the MongoDB connection
      client.close();
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    } 
  } else {
    res.redirect('/login-user');
  }
});


app.get('/shop', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('users');

    // Fetch data from MongoDB
    const data = await collection.find({objectType: 'shopItem'}).limit(3).toArray();

    // Render the EJS template and pass the data
    res.render('shop', { data });

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/mycart', async (req, res) => {

});

app.post('/usr-addToCart', async (req, res) => {
  if(myUserObjectType == 'user') {
    const { itmID, itmQty } = req.body;
    console.log('Received request body:', req.body);
    
    // GET itmID and itmQty from the request body
    const itmID2 = req.body.itmID;
    const itmQty2 = req.body.itmQty;
    console.log(itmID2);
    console.log(itmQty2);

    try {
      if (!db) {
        console.log('Database connection is not established yet.');
        return res.status(500).json({ error: 'Database connection is not ready.' });
      }

      let pushquery ="" 
      // combine the query that will be pushed to the array
      pushquery = pushquery.concat("id: '", itmID, "', quantity: ", itmQty);
      console.log(pushquery);

      //update the carItems array variable for the user
      const result = await db.collection(collectionName).updateOne(
        { _id: myUserID },
        // insert itmID and itmQty into the cartItems array variable
        { $push: { cartItems: req.body }}
      );

      

      // print the cartItems 
      console.log(myUserID);

      console.log('Added to Successfully!', req.body);
      res.status(201).json({ message: 'Added to successfully!' });
      
      updateStocksLeft(itmID, itmQty);

    } catch (err) {
      console.error('An error occurred while inserting the record.', err);
      return res.status(500).json({ error: 'An error occurred while inserting the record.' });
    }
  } else {
    res.redirect('/login-user');

  }
});


async function updateStocksLeft(id, quantity) {
  try {
    if (!db) {
      console.log('Database connection is not established yet.');
      return { success: false, message: 'Database connection is not ready.' };
    } else {
      console.log 
    }

    // Make sure 'quantity' is a positive integer
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, message: 'Please provide a valid positive quantity.' };
    }

    // Find the product by 'id'
    const product = await db.collection(collectionName).findOne({ id });

    if (!collectionName) {
      return { success: false, message: 'Product not found.' };
    }

    // Calculate the new 'stocksLeft' value
    const updatedStocksLeft = Math.max(product.stocksLeft - quantity, 0);

    // Update the 'stocksLeft' in the database
    await db.collection(collectionName).updateOne(
      { _id },
      { $set: { stocksLeft: updatedStocksLeft } }
    );

    return { success: true, message: 'Stocks updated successfully.' };
  } catch (err) {
    console.error('An error occurred while updating stocksLeft:', err);
    return { success: false, message: 'An error occurred while updating stocksLeft.' };
  }
}












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
