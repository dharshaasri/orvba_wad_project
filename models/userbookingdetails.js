const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    mechanicId: String,
    mechname: String,
    phno: String,
    currentAddress: String,
    vehicleNumber: String,
    vehicleType: String,
    cusname: String,
    customerId: String,
    status:String,
});

const Booking = mongoose.model('Booking', bookSchema);
module.exports = Booking ;