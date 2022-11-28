const mongoose = require("mongoose");

const adminDetails = mongoose.Schema({
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  token:{
    type: String,
  }
},{versionKey:false});


module.exports = mongoose.model('adminData',adminDetails)