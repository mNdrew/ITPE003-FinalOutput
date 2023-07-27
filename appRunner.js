const express = require('express');
const path = require('path');

// const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
// import img

app.use('/img', express.static(path.join(__dirname, 'public/img')));

const uri = 'mongodb://127.0.0.1:27017/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', async (req, res) => {
    res.write("Hello World");
//   try {
//     const client = await MongoClient.connect(uri, options);
//     const db = client.db();
//     const collection = db.collection('GundamWFMKitsPriceRelDate');

//     // Fetch data from MongoDB
//     const data = await collection.find({}).toArray();

//     // Render the EJS template and pass the data
//     res.render('page', { data });

//     // Remember to close the MongoDB connection
//     client.close();
//   } catch (err) {
//     console.error('Error fetching data from MongoDB:', err);
//     res.status(500).send('Internal Server Error');
//   }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});