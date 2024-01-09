// server.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000; 
const SESSION_SECRET = 'mysecretkey';
// Use cookie-parser middleware
app.use(cookieParser());
// Load environment variables
dotenv.config({ path: 'config.env' });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());

// MongoDB connection
const connectDB = require('./server/database/connection');

// Access PORT from environment variables or default to 8080
const ejs = require('ejs');
app.engine('ejs', ejs.renderFile);
// Log requests
app.use(morgan('tiny'));

// MongoDB connection
connectDB();

const authRoutes = require('./routes/authRoutes');
const mechanicroute = require('./routes/mechanicroute');
const customerroute = require('./routes/customerroute');

const adminsroute = require('./routes/adminsroute');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static(path.resolve(__dirname, "views/css")));
app.use('/IMG', express.static(path.resolve(__dirname, "views/IMG")));
app.use('/js', express.static(path.resolve(__dirname, "views/js")));
app.use('/vendor', express.static(path.resolve(__dirname, "views/vendor")));
app.use(express.json());

app.use( mechanicroute);
app.use( customerroute);

app.use( adminsroute);
app.use(authRoutes); // Mount the authentication routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
