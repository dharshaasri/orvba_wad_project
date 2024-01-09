const mongoose = require('mongoose');

const adminSchema=new mongoose.Schema({
    adminname:String,
    password: String,
  });
  adminSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
      } catch (error) {
        return next(error);
      }
    } else {
      return next();
    }
  });
  

  const Admin = mongoose.model('Admin', adminSchema);
  module.exports=Admin;