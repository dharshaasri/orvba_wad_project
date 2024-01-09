const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path=require('path');
const {Mechanic,Customer} = require('../models/User');
//const Admin = require('../models/admindetails');
const Booking= require('../models/userbookingdetails');

  const isAdminLoggedIn = (req, res, next) => {
    comsole.log('adminroute is')
    if (req.session.isAdminLoggedIn) {
      return next();
    } else {
      return res.redirect('/adminlogin');
    }
  };

  router.get('/Admincustomerdetails', isAdminLoggedIn,(req, res) => {
    res.render('Admincustomerdetails', { message: req.flash('error') });
  });

  module.exports = router;