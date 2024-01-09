const express = require('express');
const router = express.Router();
const {Customer,Mechanic} = require('../models/User');
const Booking = require('../models/userbookingdetails')

router.get('/mechdetails', async(req, res) => {
  try {
    console.log('User Object:', req.user);
    let mechanics;
    let customers;
    let bookings;
    const user=req.session.mechname;
    
      mechanics = await Mechanic.find({});
      customers = await Customer.find({});
      bookings = await Booking.find({});
  
    //req.session.=userData.cusname;

    res.render('mechdetails', { bookings,mechanics,customers, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/custdetails', async(req, res) => {
  try {
    console.log('User Object:', req.user);
    let mechanics;
    let customers;
    let bookings;
    const user=req.session.mechname;
    
      mechanics = await Mechanic.find({});
      customers = await Customer.find({});
      bookings = await Booking.find({});
  
    //req.session.=userData.cusname;

    res.render('custdetails', { bookings,mechanics,customers, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delcus/:customerId', async (req, res) => {
  const cusid = req.params.customerId;
  
  try {
  const result = await Customer.findOneAndDelete({ _id:cusid });
  
  if (!result) {
  return res.status(404).send('Mail ID not found');
  }
  
  res.redirect('/custdetails');
  } catch (err) {
    console.error('Error deleting customer:', err);
  res.send('Error: ' + err);
  }
  });

  router.post('/delmech/:mechanicId', async (req, res) => {
    const mechid = req.params.mechanicId;
    
    try {
    const result = await Mechanic.findOneAndDelete({ _id:mechid });
    
    if (!result) {
    return res.status(404).send('Mail ID not found');
    }
    
    res.redirect('/mechdetails');
    } catch (err) {
    console.error('Error deleting mechanic:', err);
    res.send('Error: ' + err);
    }
});

// Simulated admin credentials (for demonstration purposes)


module.exports = router;
