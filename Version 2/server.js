// IMPORT EXPRESS, PATH, MONGODB, EJS, CORS, HTTP, AND COOKIE-PARSER...
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const nodemon = require('nodemon');
const { get } = require('http');
const { MongoClient, ObjectId, Int32 } = require('mongodb');

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
const userMsgDB = 'usermessages';

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

// MONGGOSE 
const mongoose = require('mongoose');
mongoose.connect(uri, options);


// SCHEMAS 
// user-USER
const userSchema = new mongoose.Schema({
		user: Boolean,
		userName: String,
		userPass: String,
});

// user-ADMIN
const adminSchema = new mongoose.Schema({
	admin: Boolean,
	username: String,
	password: String,
});

// MESSAGE SCHEMA
const messageSchema = new mongoose.Schema({
    userName: String,
    email: String,
    message: String,
    reply: String,
    replyStatus: Boolean,
});

var UserMong = mongoose.model(userDB, userSchema);
var MessageMong = mongoose.model(userMsgDB, messageSchema);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
var session = {
	userID: "",
	username: "",
	userType: null,
	user: false,
	admin: false,
	cart: []
}


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
				const shopItems1 = await collection.find({"title" : {$regex : ""},"availability": 2}).toArray();
				const shopItems2 = await collection.find({"title" : {$regex : "Gundam"},"availability": 1}).toArray();
				// const shopItems3 = await collection.find({"title" : {$regex : "Gundam"},"availability": 1}).toArray();
				// console.log(shopItems); // DEBUG

				res.render('page-home-dynamic', {shopItems: shopItems1, shopItems2: shopItems2 /*, shopItems3: shopItems3*/});
		} catch (error) {
				console.log(error);
		}
});

app.get('/page-about', async (req, res) => {
	try {
		const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
		db = client.db(DBName);
		const collection = db.collection(shopItemsDB);

		const featuredShopItems = await collection.find({"title" : {$regex : "Lfrith"},"availability": 1}).toArray();

		res.render('page-about-dynamic', {shopItems: featuredShopItems});

	} catch (error) {
		console.log(error);
	}
});

app.get('/page-shop', async (req, res) => {
	try {
		const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
		db = client.db(DBName);
		const collection = db.collection(shopItemsDB);

		const shopItemsAvailable = await collection.find({"availability": 1}).toArray();

		res.render('page-shop-dynamic', {shopItems: shopItemsAvailable});

	} catch (error) {
		console.log(error);
	}
});

// LOGINS 
app.get('/login', async (req, res) => {
	res.status(404).sendFile('\\views\\account-login-user.html', {root: __dirname});
	// res.render('account-login-user');
});


app.get('/login-user', async (req, res) => {
	// GET DATA
	var username = req.query.username;
	var password = req.query.password;
	console.log(username + " " + password);
	// CHECK IF USER EXISTS
	var userExists = await UserMong.findOne({userName: username, userPass: password});
});

app.get('/login-admin', async (req, res) => {
	res.render('account-login-admin');
});

app.post('/logout', async (req, res) => {
	console.log("logout");

	// reset session
	session = {
		userID: "",
		username: "",
		userType: null,
		user: false,
		admin: false,
		cart: []
	}
	console.log(session);
	// reload 
	res.redirect('/page-home');
});

// REGISTER NEW ACCOUNT 
app.get('/registerNewUser', async (req, res) => {
	res.status(404).sendFile('\\views\\account-registerUser.html', {root: __dirname});
});

app.post('/createNewUser', async (req, res) => {
	var myData = new UserMong(req.body);
	myData.save()
		.then(item => {
		//   res.send("item saved to database");
			res.redirect('/login');
		})
		.catch(err => {
			// res.status(400).send("unable to save to database");
		});
});

// REGISTER NEW ACCOUNT 
app.get('/page-contactUs', async (req, res) => {
	res.status(404).sendFile('\\views\\page-contactUs.html', {root: __dirname});
});


app.post('/sendNewMessage', async (req, res) => {
	console.log(req.body);
	var myMessage = new MessageMong(req.body);
	myMessage.save()
		.then(item => {
				res.redirect('/page-contactUs');
		})
		.catch(err => {
			res.status(400).send("unable to save to database");
		});
});



































// SHOP ITEMS PAGES 

app.get('/page-userCart', async (req, res) => {
	// CHECK FOR SESSION 
	if (session.user) {
		// IF SESSION EXISTS, RENDER CART
		res.render('myCart');
	}
	else {
		// IF SESSION DOES NOT EXIST, REDIRECT TO LOGIN
		res.redirect('/login');
	}
});

app.get('/page-userProfile', async (req, res) =>
{
	// CHECK FOR SESSION 
	if (session.user) {
		// IF SESSION EXISTS, RENDER PROFILE
		res.render('user-myProfile');
	}
	else {
		// IF SESSION DOES NOT EXIST, REDIRECT TO LOGIN
		res.redirect('/login');
	}
});




// login to admin
app.post('/login-admin', async (req, res) => {
	// GET DATA
	var username = req.body.username;
	var password = req.body.password;
	console.log(username + " " + password);
	// CHECK IF USER EXISTS
	var userExists = await UserMong.findOne({userName: username, userPass: password});
	console.log(userExists);
	if (userExists) {
		// IF USER EXISTS, CHECK IF ADMIN
		if (userExists.userType == "admin") {
			// IF ADMIN, SET SESSION AND REDIRECT TO ADMIN DASHBOARD
			session = {
				userID: userExists._id,
				username: userExists.userName,
				userType: userExists.userType,
				user: false,
				admin: true,
				cart: []
			}
			console.log(session);
			res.redirect('/admin-dashboard');
		} else {
			// IF NOT ADMIN, REDIRECT TO LOGIN
			res.redirect('/login-admin');
		}
	}
});





// ADMIN DASHBOARD
app.get('/admin-dashboard', async (req, res) => {
	// CHECK FOR SESSION
	if (!session.admin) {
		// IF SESSION EXISTS, RENDER render user dashbaord
		try { 
				const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
				db = client.db(DBName);
				const collection = db.collection(userDB);

				const loadUsers = await collection.find({}).toArray();
				res.render('page-admin-user-dashboard', {usersLoad: loadUsers});

		} catch (error) {
				console.log(error);
		}
	} else {
		// IF SESSION DOES NOT EXIST, REDIRECT TO LOGIN
		res.redirect('/login-admin');
	}
});


// ADMIN MESSAGE DASHBOARD
app.get('/admin-contact-dashboard', async (req, res) => {
	// CHECK FOR SESSION
	if (!session.admin) {
		// IF SESSION EXISTS, RENDER render user dashbaord
		try { 
				const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
				db = client.db(DBName);
				const collection = db.collection(userMsgDB);

				const loadMessage = await collection.find({replyStatus: false}).toArray();
				res.render('page-admin-contact-dashboard', {loadMessage: loadMessage});

		} catch (error) {
				console.log(error);
		}
	} else {
		// IF SESSION DOES NOT EXIST, REDIRECT TO LOGIN
		res.redirect('/login-admin');
	}
});

app.post('/replyMessage', async (req, res) => {
	// parse message id from JSON
	const id = req.body.id;
	const reply = req.body.reply;
	const replyStatatus = req.body.replyStatus;
	console.log(id);
	console.log(reply);
	console.log(replyStatatus);
	try {
		const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
		db = client.db(DBName);
		const collection = db.collection('usermessages');

		// const loadMessage = await collection.updateOne({_id: new ObjectId(id)}, {$set: {reply: reply, replyStatus: replyStatatus}});
		const loadMessage = await collection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {reply: reply, replyStatus: replyStatatus}});	

	} catch (error) {
		console.log(error);
	}
});











// DELETE USER ACCOUNT 
app.post('/deleteUserThroughID', async (req, res) => {
		// parse the id from JSON
		const id = req.body.id;

		console.log(id);
		try {
				const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
				db = client.db(DBName);
				const collection = db.collection(userDB);

				const loadMessage = await collection.deleteOne({_id: new ObjectId(id)});
				res.redirect('/admin-dashboard');
		} catch (error) {
				console.log(error);
		} 
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