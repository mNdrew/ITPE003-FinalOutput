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
const messagesCollectionName = 'messages';
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
}

app.use(express.json());
app.use(cors());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('users');


    // Fetch data from MongoDB
    const itemData = await collection.find({objectType: 'shopItem' }).limit(6).toArray();

    // Render the EJS template and pass the data
    res.render('page-home', { itemData});

    // Remember to close the MongoDB connection
    client.close();
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/home', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri, options);
    const db = client.db();
    const collection = db.collection('users');


    // Fetch data from MongoDB
    const itemData = await collection.find({objectType: 'shopItem' }).limit(3).toArray();

    // Render the EJS template and pass the data
    res.render('homepage', { itemData});

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
      const collection = db.collection('users');


      // Fetch data from MongoDB
      const itemData = await collection.find({objectType: 'shopItem' }).limit(3).toArray();

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
  res.sendFile(path.join(__dirname, '/views/login-user.html'));
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


app.get('/myAccount', async (req, res) => {
  //verify if myObject type is user
  if (myUserObjectType == 'user') {
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('users');
      
      // Fetch data from MongoDB
      const userInfo = await collection.find({_id: myUserID}).toArray();
      console.log(userInfo);
      // const formattedOutput = JSON.stringify(userInfo, null, 2);

      // console.log(formattedOutput)

      // Render the EJS template and pass the data
      res.render('myAccount'/*, { formattedOutput }*/);
  
      // Remember to close the MongoDB connection
      client.close();
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    } 
  } else if(myUserObjectType == 'admin') {
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('admin', );
      
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
  if(myUserObjectType === 'user'){
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db();
      const collection = db.collection('userCarts');

      // Fetch data from MongoDB
      const dataCart = await collection.find({owner: myUserID}).toArray();
      console.log(dataCart);

      // Render the EJS template and pass the data
      res.render('mycart', { dataCart });

      // Remember to close the MongoDB connection
      // client.close();
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    // const dataCart = await collection.find({owner: myUserID}).toArray();
    res.redirect('/login-user');
  }
});

app.post('/usr-addToCart', async (req, res) => {
  if(myUserObjectType === '' || myUserObjectType == null || myUserObjectType == 'admin') {
    return;
  }
  else {
    const {itemId, itemImage, itemTitle, itemPrice, itemQuantity, orderPrice} = req.body;
    console.log('Received request body:', req.body);

    try {
      if (!db) {
        console.log('Database connection is not established yet.');
        return res.status(500).json({ error: 'Database connection is not ready.' });
      }

      console.log('Inserting record:', req.body);
      // let itemId = itemId.valueOf();

      await db.collection('userCarts').insertOne({
        // INSERT USER OBJECT TYPE
        onwer: myUserID,
        cartItemID: itemId,
        cartItemImage: itemImage,
        cartItemTitle: itemTitle,
        cartItemPrice: itemPrice,
        cartItemQuantity: itemQuantity,
        cartItemOrderPrice: orderPrice,
        objectType: 'cartItem'
      });

      console.log('Record Inserted Successfully!' + req.body);
      res.status(201).json({ message: 'Record inserted successfully!' });
    } catch (err) 

    {
      console.error('Error inserting record:', err);
      res.status(500).json({ error: 'Error inserting record:' + err });
    }
  }
});





    app.post('/contact-form-submit', async (req, res) => {
      const { name, email, message } = req.body;
      console.log('Received contact form submission:', req.body);
      
      

      try {
        if (!db) {
          console.log('Database connection is not established yet.');
          return res.status(500).json({ error: 'Database connection is not ready.' });
        }

        console.log('Inserting message into the "messages" collection:', req.body)

        // Save the contact form data to the database
        await db.collection('messages').insertOne({
          name: name,
          email: email,
          message: message,
        });

        console.log('Message inserted into the "messages" collection successfully!');
        res.status(201).json({ message: 'Message sent successfully!' });
      } catch (err) {
        console.error('Error inserting message into the "messages" collection:', err);
        res.status(500).json({ error: 'An error occurred while sending the message.' });
      }
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
