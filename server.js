/* server.js - user & resource authentication */
// Modular version, with express routes imported separately.
'use strict';
const log = console.log
const path = require('path')

const express = require('express')
const exphbs = require('express-handlebars');
// starting the express server
const app = express();

// mongoose and mongo connection
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');
const { Post } = require('./models/post')
const { Book, BookList } = require('./models/book')
const { User } = require('./models/user')

/*** handlebars: server-side templating engine ***/
const hbs = require('hbs')
// Set express property 'view engine' to be 'hbs'
app.set('view engine', 'hbs')
// setting up partials directory
hbs.registerPartials(path.join(__dirname, '/views/partials'))

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


/*** Session handling **************************************/
// express-session for managing user sessions
const session = require('express-session')

/// Middleware for creating sessions and session cookies.
// A session is created on every request, but whether or not it is saved depends on the option flags provided.
app.use(session({
    secret: '309BookLand', // later we will define the session secret as an environment variable for production. for now, we'll just hardcode it.
    cookie: { // the session cookie sent, containing the session id.
        expires: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
    },
    // Session saving options
    saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
    resave: false, // don't resave an session that hasn't been modified.
}));

// helper: check mongo connection error
const mongoChecker = (req, res, next) => {
	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} else {
		next()	
	}	
}
//helper: check session cookies
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/index.html?userID='+req.session.user._id); // not sure
    } else {
        next(); // next() moves on to the route.
    }    
};

/** Static directories **/
// static js directory
// app.use("/js", express.static(path.join(__dirname, '/public/js')))
// static image directory
// app.use("/img", express.static(path.join(__dirname, '/static')))


/** Import the various routes **/
// Webpage routes
// app.use(require('./routes/webpage'))
// User and login routes
// app.use(require('./routes/users'))
// Student API routes
// app.use(require('./routes/student'))

/*******************************************************************/

app.use("/", express.static(path.join(__dirname + '/public')));
app.use("/public/html", express.static(path.join(__dirname + '/public/html')));
app.use('/public/css', express.static(path.join(__dirname + '/public/css')));
app.use('/public/js', express.static(path.join(__dirname + '/public/js')));
app.use('/public/img/static', express.static(path.join(__dirname + '/public/img/static')));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html')
})

app.post('/login', mongoChecker, async (req, res) => {
	const username = req.body.username
    const password = req.body.password

    try {
    	// Use the static method on the User model to find a user
	    // by their email and password.
		const user = await User.findByEmailPassword(email, password);
		if (!user) {
            res.redirect('/login');
        } else {
            // Add the user's id and email to the session.
            // We can check later if the session exists to ensure we are logged in.
            req.session.user = user._id;
            req.session.email = user.email
            res.redirect('/dashboard');
        }
    } catch (error) {
    	// redirect to login if can't login for any reason
    	if (isMongoError(error)) { 
			res.status(500).redirect('/login');
		} else {
			log(error)
			res.status(400).redirect('/login');
		}
    }

})

app.get('/login', (req, res) => {
    /* if (req.session.user) {
        res.sendFile(__dirname + '/public/index.html?userID='+req.session.user._id) // not sure
    } else { */
        res.sendFile(__dirname + '/public/html/login.html')
    //}
})

app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/public/html/register.html')
})

// get all books 
app.get('/books', mongoChecker, async (req, res)=>{
	try {
		const books = await Book.find()
		res.send({ books })
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// get all booklists
app.get('/booklists', mongoChecker, async (req, res)=>{
	try {
		const lists = await BookList.find()
		res.send({ lists })
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// display book main page
app.get('/BookMain/:userID?', (req, res) => {
    /* try{
        const user = req.query.userID
        if (!user){
            res.sendFile(__dirname + '/public/html/BookMainPage.html')
        } else {
            res.redirect(__dirname + '/public/html/BookMainPage.html?userID='+user)
        }
    } catch(error){
        log(error)
        res.status(400).redirect('/public/index.html')    
    } */
	
	res.sendFile(__dirname + '/public/html/BookMainPage.html')
    /* try{
        const userID = req.body._id
        if(!userID){
            res.redirect(__dirname + '/public/html/BookMainPage.html')
        } else {
            res.redirect(__dirname + '/public/html/BookMainPage.html?userID='+userID)
        }
    } catch(error){
        log(error)
        res.status(400).redirect('/public/index.html')   
    }  */

})

app.delete('/deleteBook/:bookID', async (req, res)=>{ // not sure the config for book id
    const book = req.params.bookID

    // if user is type admin check

	// Delete a student by their id
	try {
		const deleteBook = await Book.findOneAndRemove({_id: book})
		if (!deleteBook) {
			res.status(404).send("no such a book")
		} else {   
			res.send(deleteBook)
		}
	} catch(error) {
		log(error)
		res.status(500).send("server error on delete book") // server error, could not delete.
	}
})

app.post('/addBook', async (req, res)=>{ // not sure the config for book id

    const newBook = new Book({
		name: req.body.name,
        author: req.body.author,
		year: req.body.year,
		coverURL: req.body.coverURL,
        description: req.body.description,
        postCollection: []
	})
    try {
		const result = await newBook.save()	
		res.send(result)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})


// 404 route at the bottom for anything not found.
app.get('*', (req, res) => {
    res.status(404).send("404 Error: We cannot find the page you are looking for.");
    // you could also send back a fancy 404 webpage here.
  });


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5001
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 

