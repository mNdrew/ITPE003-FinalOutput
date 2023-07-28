const express = require('express');
const {MongoClient, ObjectId } = require('mongodb');

const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000; 

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'ITPE003-FinalOutput';
const collectionName = 'users';
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
let db;


async function connectToDatabase() {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
}

app.use(express.json());
app.use(cors());

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    //render homepage.ejs
    res.render(path.join(__dirname, '/views/homepage.ejs'));
}); 

app.get('/registernNewAccount', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'));
}); 

app.post('/newAccountRegister', async (req, res) => {
    const { username, userpass } = req.body;
    console.log('Received request body:', req.body);

    try{
        if(!db) {
            console.log('Database connection is not established yet.');
            return res.status(500).json({ error: 'Database connection is not ready.' });
        }

        await db.collection(collectionName).insertOne({
            // add object types here
            objectType: 'user',
            username,
            userpass,
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

app.get('/searchUser', async (req, res) => {
    console.log('Received request query:', req.query);
    const usernameQuery = req.query.username; // Assuming the query parameter is 'username'

    try {
        // Ensure the database connection is established before searching
        if (!db) {
            console.log('Database connection is not established yet.');
            return res.status(500).json({ error: 'Database connection is not ready.' });
        }

        // Search for the student record with the provided username
        const username = await db.collection(collectionName).findOne({ objectType: `user` , username: usernameQuery });

        if (username) {
            console.log('Student found:', username);
            res.status(200).json(username);
        } else {
            console.log('No user found with the provided username.');
            res.status(404).json({ error: 'No user found with the provided username.' });
        }
    } catch (err) {
        console.error('Error searching for username:', err);
        res.status(500).json({ error: 'An error occurred while searching for the username.' });
    }
});


app.get('/shop', async (req, res) => {
    try {
        const shopItems = await db.collection(collectionName).find({ objectType: 'shopItem' }).toArray();
        console.log(shopItems);
        res.render('shop', { shopItems });
    } catch (err) {
        console.error('Error fetching shop items:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Define the route to handle adding an item to the user's cart
app.post('/addToCart', express.json(), async (req, res) => {
    const { itemId, itemTitle, itemPrice, itemStocksLeft, quantity } = req.body;
  
    try {
      // Check if the item already exists in the cart for the user (you may need to include the user identifier in the request)
      const existingCartItem = await db.collection(collectionName).findOne({
        itemId,
        /* Add user identifier filter if needed */
      });
  
      if (existingCartItem) {
        // Item already exists in the cart, update the quantity
        const updatedQuantity = existingCartItem.quantity + quantity;
  
        // Check if the updated quantity exceeds the available stocks
        if (updatedQuantity > itemStocksLeft) {
          return res.status(400).json({ error: 'Quantity exceeds available stocks.' });
        }
  
        // Update the quantity of the existing item in the cart
        await db.collection(collectionName).updateOne(
          { itemId },
          { $set: { quantity: updatedQuantity } }
        );
      } else {
        // Item does not exist in the cart, add a new entry
        if (quantity > itemStocksLeft) {
          return res.status(400).json({ error: 'Quantity exceeds available stocks.' });
        }
  
        await db.collection(collectionName).insertOne({
          itemId,
          itemTitle,
          itemPrice,
          quantity,
          /* Add user identifier if needed */
        });
      }
  
      res.status(200).json({ message: 'Item added to cart successfully.' });
    } catch (err) {
      console.error('Error adding item to cart:', err);
      res.status(500).json({ error: 'An error occurred while adding the item to cart.' });
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