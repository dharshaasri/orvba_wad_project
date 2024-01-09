const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path=require('path');
const {Mechanic,Customer,Admin} = require('../models/User');
const Booking= require('../models/userbookingdetails');

router.get('/adminlogin', (req, res) => {
  res.render('adminlogin', { message: req.flash('error') });
});

router.get('/csignup', (req, res) => {
  res.render('csignup', { message: req.flash('error') });
});

router.post('/csignup', async (req, res) => {
  // Signup logic remains the same
  try {
    const { cusname, password, email, phno, dob, address, vehicle_model, vehicle_number } = req.body;

    // Check if the username already exists
    const existingUser = await Customer.findOne({  email });

    if (existingUser) {
      req.flash('error', 'Username or email already exists. Please choose a different username or email.');
      return res.redirect('/csignup');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newCustomer = new Customer({
      cusname,
      password: hashedPassword,
      email,
      phno,
      dob,
      address,
      vehicle_number,
      vehicle_model,
    });

    // Save the user to the database
    await newCustomer.save();

    // Redirect to login after successful signup
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// router.get('/logout', (req, res) => {
//   res.render('index', { message: req.flash('error') });
// });

router.get('/msignup', (req, res) => {
  res.render('msignup', { message: req.flash('error') });
});

router.post('/msignup', async (req, res) => {
  console.log('Reached /msignup route');
  try {
    const { mechname, password, email,phno, dob, address, exp, aadhar } = req.body;
    //const { buffer, mimetype } = req.file;
    const existingUser = await Mechanic.findOne({ email });

    if (existingUser) {
      req.flash('error', 'Username or email already exists. Please choose a different username or email.');
      return res.redirect('/msignup');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMechanic = new Mechanic({
      mechname,
      password: hashedPassword,
      email,
      phno,
      dob,
      address,
      exp,
      aadhar,
      // myFile:{
      //   data: buffer,
      //   contentType: mimetype,
      // },
    });
    console.log('Before saving newMechanic:', newMechanic);
    await newMechanic.save();
    console.log('After saving newMechanic:', newMechanic);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user is a Customer
    const customer = await Customer.findOne({ email });

    if (customer) {
      const isPasswordValid = await bcrypt.compare(password, customer.password);

      if (!isPasswordValid) {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/login');
      }

      const token = jwt.sign({ userId: customer._id, userType: 'customer' }, 'secret_key', { expiresIn: '1h' });
      res.cookie('token', token);
      return res.redirect('/Customer');
    }

    // Check if the user is a Mechanic
    const mechanic = await Mechanic.findOne({ email });

    if (mechanic) {
      const isPasswordValid = await bcrypt.compare(password, mechanic.password);

      if (!isPasswordValid) {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/login');
      }

      const token = jwt.sign({ userId: mechanic._id, userType: 'mechanic' }, 'secret_key', { expiresIn: '1h' });
      res.cookie('token', token);
      return res.redirect('/mpage');
    }

    // If the user is not found
    

  const admin = await Admin.findOne({ email });


  if (admin) {
   
        //req.flash('error', 'Invalid username or password');
      const token = jwt.sign({ userId: admin._id, userType: 'admin' }, 'secret_key', { expiresIn: '1h' });
      console.log("Token:", token);
      res.cookie('token', token);
      return res.redirect('/adminpage');
    }
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, 'secret_key', async (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }

    try {
      if (decoded.userType === 'customer') {
        const user = await Customer.findById(decoded.userId);

        if (!user) {
          return res.redirect('/login');
        }

        req.user = { userId: decoded.userId, userType: 'customer', username: user.cusname };
      } else if (decoded.userType === 'mechanic') {
        const user = await Mechanic.findById(decoded.userId);

        if (!user) {
          return res.redirect('/login');
        }

        req.user = { userId: decoded.userId, userType: 'mechanic', username: user.mechname };
      }else if (decoded.userType === 'admin') {
        const user = await Admin.findById(decoded.userId);

        if (!user) {
          return res.redirect('/login');
        }

        req.user = { userId: decoded.userId, userType: 'admin' };
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
};

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});



router.get('/Customer', authenticateToken, async (req, res) => {
  try {
    console.log('User Object:', req.user);

    let userData;
    let mechanics;
    let bookings;
    if (req.user.userType === 'customer') {
      userData = await Customer.findById(req.user.userId);
      mechanics = await Mechanic.find({}).select('id mechname email phno exp address');
      bookings = await Booking.find({});
    }
    req.session.cusname=userData.cusname;
    req.session.cusId=req.user.userId;
    res.render('Customer', { bookings,mechanics, userData, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/adminpage', authenticateToken, async (req, res) => {
  try {
    console.log('User Object:', req.user);

    let userData;
    let mechanics;
    let customers;
    let bookings;
    if (req.user.userType === 'admin') {
      userData = await Admin.findById(req.user.userId);
      mechanics = await Mechanic.find({});
      customers = await Customer.find({});
      bookings = await Booking.find({});
    }
    //req.session.=userData.cusname;

    res.render('adminpage', { bookings,mechanics,customers, userData, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/mpage', authenticateToken, async (req, res) => {
  try {
    console.log('User Object:', req.user);
    let userData;
    let customers;
    let allbookings;
    const user=req.session.mechname;

    if (req.user.userType === 'mechanic') {
      userData = await Mechanic.findById(req.user.userId);
      customers = await Customer.find({});
    }
      allbookings = await Booking.find({});
      const filteredRequest = allbookings.filter(booking => 
        booking.mechname === user && booking.status === 'Completed' ,
      );
    req.session.mechname=userData.mechname;
    req.session.mechId=req.user.userId;
    res.render('mpage', { bookings:filteredRequest,customers,userData, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/servicerequest', async(req, res) => {
  try {
    //console.log('User Object:', req.user);
    //let userData;
    let customers;
    let allbookings;
    const user=req.session.mechname;
    //if (req.user.userType === 'mechanic') {
      //userData = await Mechanic.findById(req.user.userId);
      customers = await Customer.find({});
      allbookings = await Booking.find({});
      const filteredBookings = allbookings.filter(booking => 
        booking.mechname === user 
      );
      
    //}
    //req.session.mechname=userData.mechname;
    res.render('servicerequest', { bookings:filteredBookings,customers, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/',  async (req, res) => {
  try {
    // Pass the username to the index page rendering
    res.render('index', {message: req.flash('error')});
  } catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;