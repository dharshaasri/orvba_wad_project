//const { hash } = require('bcrypt');
const mongoose = require('mongoose');

const cusSchema = new mongoose.Schema({
  cusname: String,
  password: String,
  email: String,
  phno: Number,
  dob: Date,
  address: String,
  vehicle_number: String,
  vehicle_model: String,
});

const adminSchema = new mongoose.Schema({
 
  password: String,
  email: String,
  
});

const mechSchema = new mongoose.Schema({
  mechname: String,
  password: String,
  email: String,
  phno: Number,
  dob: Date,
  address: String,
  exp:Number,
  aadhar:String,
  // myFile:{
  //   data: Buffer,
  //   contentType: String, 
  // },
});



// const bookingSchema = new mongoose.Schema({
//   customer: 
//   mechanic: 
//   currentAddress: String,
//   vehicleNumber: String,
//   vehicleType: String,
//   confirmationDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

//const Booking = mongoose.model('Booking', bookingSchema);
const Mechanic = mongoose.model('Mechanic', mechSchema);
const Customer = mongoose.model('Customer', cusSchema);
const Admin = mongoose.model('Admin',adminSchema);

module.exports = {Mechanic,Customer,Admin} ;



