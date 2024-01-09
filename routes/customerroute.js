const express = require('express');
const router = express.Router();
const {Customer,Mechanic} = require('../models/User');
const Booking = require('../models/userbookingdetails')

router.get('/customers', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      res.status(500).send('Internal Server Error');
    }
});

// router.get('/bookinglist', (req, res) => {
//     res.render('bookinglist', { message: req.flash('error') });
//   });

// router.get('/bookinglist', async (req, res) => {
//     try {
//       const bookings = await Booking.find();
//       res.json(bookings);
//     } catch (error) {
//       console.error('Error fetching customer data:', error);
//       res.status(500).send('Internal Server Error');
//     }
// });

router.get('/bookinglist', async(req, res) => {
    try {
      //console.log('User Object:', req.user);
      //let userData;
      let mechanics;
      let allbookings;
      const user=req.session.cusname;
      //if (req.user.userType === 'mechanic') {
        //userData = await Mechanic.findById(req.user.userId);
        mechanics = await Mechanic.find({});
        allbookings = await Booking.find({});
        const filteredBookings = allbookings.filter(booking => 
          booking.cusname === user 
        );
      //}
      //req.session.mechname=userData.mechname;
      res.render('bookinglist', { bookings:filteredBookings,mechanics, message: req.flash('error') });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/cprofile', async(req, res) => {
    try {
      const cusname=req.session.cusname;
      const customers = await Customer.find({cusname:cusname});
      //}
      //req.session.mechname=userData.mechname;
      res.render('cprofile', { customers, message: req.flash('error') });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/updateCustomerProfile', async (req, res) => {
    const updatePhone = req.body.phno;
    const updateVN = req.body.vehicle_number;
    const updateVM = req.body.vehicle_model;
    const updateAddress = req.body.address;
    const email = req.body.email;
    try {
    const result = await Customer.findOneAndUpdate(
    {email},
    {
      $set: {
        phno: updatePhone,
        vehicle_number: updateVN,
        vehicle_model: updateVM,
        address: updateAddress,
      },
    }, // Use $set to update the specific field
    { new: true },
  
    (err, updatedCustomer) => {
      if (err) {
        return res.status(500).send('Internal server error');
      }
  
      if (!updatedCustomer) {
        return res.status(404).send('Mail ID not found');
      }
  
      // If successful, you can redirect or send a response
      res.redirect('/cprofile');
    }
  );
  } catch (err) {
  res.status(500).send('Error: ' + err);
  }
  });

  // router.post("/rejectcus", (req, res) => {
  //   const bookingId = req.body.bookingId;
  //   console.log("rejectpost");
  //   // Assume you have a Booking model/schema defined using mongoose
  //   // Update the status field to "rejected" in the database
  //   Booking.findByIdAndUpdate(bookingId, { status: "rejected" }, (err, updatedBooking) => {
  //     if (err) {
  //       console.error("Error updating booking:", err);
  //       res.status(500).json({ error: "Internal Server Error" });
  //     } else {
  //       res.json({ message: "Booking rejected successfully", updatedBooking });
  //     }
  //   });
  // });  

module.exports = router;