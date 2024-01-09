const express = require('express');
const router = express.Router();
const {Customer,Mechanic} = require('../models/User'); // Import the Mechanic model
//const {bookings} = require('../models/userbookingdetails');

// Define routes
router.get('/mechanics', async (req, res) => {
  try {
    const mechanics = await Mechanic.find();
    res.json(mechanics);
  } catch (error) {
    console.error('Error fetching mechanic data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/mprofile', async(req, res) => {
  try {
    const mechname=req.session.mechname;
    const mechanics = await Mechanic.find({mechname:mechname});
    //}
    //req.session.mechname=userData.mechname;
    res.render('mprofile', { mechanics, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const Booking = require('../models/userbookingdetails');

// Assuming your route for handling the contact form submission is '/contact'
router.post('/booking', async (req, res) => {
  try {
    // Extract data from the form submission
    const { mechanicId,customerId,currentAddress,vehicleNumber,vehicleType } = req.body;
    const cusname = req.session.cusname;
    const cusId=req.session.cusId;
    //const customer = await Customer.findById(cusname);
    
    const mechanic = await Mechanic.findById(req.body.mechanicId);
    // Create a new ContactUs document with the extracted data
    const newbook = new Booking({
        mechanicId,
        mechname:mechanic.mechname,
        phno:mechanic.phno,
        currentAddress,
        vehicleNumber,
        vehicleType,
        cusname,
        customerId:cusId,
        status:'Requested',
    });
    console.log(newbook);

    // Save the new contact entry to the database
    await newbook.save();
    
    // Redirect or send a success response, as needed
    
    res.redirect('/bookinglist');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message. Please try again.');
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
      const filteredBookings = allbookings.filter(bookings => 
        bookings.mechname === user,
        
      );
      
    //}
    //req.session.mechname=userData.mechname;
    res.render('servicerequest', { bookings:filteredBookings,customers,user, message: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/updateMechanicProfile', async (req, res) => {
  const updatePhone = req.body.phno;
  const updateExp = req.body.exp;
  const updateAddress = req.body.address;
  const email = req.body.email;
  try {
  const result = await Mechanic.findOneAndUpdate(
  {email},
  {
    $set: {
      phno: updatePhone,
      exp: updateExp,
      address: updateAddress,
    },
  }, // Use $set to update the specific field
  { new: true },

  (err, updatedMechanic) => {
    if (err) {
      return res.status(500).send('Internal server error');
    }

    if (!updatedMechanic) {
      return res.status(404).send('Mail ID not found');
    }

    // If successful, you can redirect or send a response
    res.redirect('/mprofile');
  }
);
} catch (err) {
res.status(500).send('Error: ' + err);
}
});

router.post("/acceptcus", async(req, res) => {
  const bookingId = req.body.bookingId;
  const cusId = req.body.cusId;
  const mechanicId = req.session.mechId;
  console.log("acceptpost");
  console.log(cusId);
  console.log(mechanicId);
  console.log(bookingId);
  try {
    const result = await Booking.findOneAndUpdate(
      {
        _id: bookingId, // Assuming bookingId is the primary key or unique identifier
        customerId: cusId,
        mechanicId: mechanicId,
      },
    {
      $set: {
        status: 'Accepted',
      },
    },
    { new: true },
     // Use $set to update the specific field
     
    (err, updatedBookinga) => {
      if (err) {
        return res.status(500).send('Internal server error');
      }
  
      if (!updatedBookinga) {
        return res.status(404).send('Mail ID not found');
      }
  
      // If successful, you can redirect or send a response
      console.log(result);
      res.redirect('/servicerequest');
      
    }
  );
  } catch (err) {
  res.status(500).send('Error: ' + err);
  }
  });

  // router.post("/rejectcus", async(req, res) => {
  //   const bookingId = req.body.bookingId;
  //   const cusId = req.body.cusId;
  //   const mechanicId = req.session.mechId;
  //   console.log("rejectpost");
  //   try {
  //     const result = await Booking.findOneAndUpdate(
  //       {
  //         _id: bookingId, // Assuming bookingId is the primary key or unique identifier
  //           customerId: cusId,
  //         mechanicId: mechanicId,
  //       },
  //     {
  //       $set: {
  //         status: 'Rejected',
  //       },
  //     }, // Use $set to update the specific field
    
  //     (err, updatedBookinga) => {
  //       if (err) {
  //         return res.status(500).send('Internal server error');
  //       }
    
  //       if (!updatedBookinga) {
  //         return res.status(404).send('Mail ID not found');
  //       }
    
  //       // If successful, you can redirect or send a response
  //       res.redirect('/servicerequest');
  //     }
  //   );
  //   } catch (err) {
  //   res.status(500).send('Error: ' + err);
  //   }
  //   });

  // router.post("/rejectcus", async (req, res) => {
  //   console.log(req.body); // Log the received data
  //   const bookingId = req.body.bookingId;
  //   const cusId = req.body.cusId;
  //   const mechanicId = req.session.mechId;
  //   console.log("rejectpost", bookingId, cusId);
  
  //   try {
  //     const result = await Booking.findOneAndUpdate(
  //       {
  //         _id: bookingId,
  //         customerId: cusId,
  //         mechanicId: mechanicId,
  //       },
  //       {
  //         $set: {
  //           status: 'Rejected',
  //         },
  //       },
  //       { new: true } // Return the modified document
  //     );
  
  //     if (!result) {
  //       return res.status(404).send('Booking not found');
  //     }
  
  //     // If successful, you can redirect or send a response
  //     res.redirect('/servicerequest');
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send('Internal server error');
  //   }
  // });
  router.put('/managestatus/:bookingId',  async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

  //   console.log(orderId);
  //   console.log(status);
    try {
        const order = await Booking.findOneAndUpdate(
          { _id: bookingId }, // Use _id instead of orderId
          { $set: { status } },
          { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Status updated successfully', order });
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
