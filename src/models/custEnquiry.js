const mongoose = require("mongoose");

const custEnquiry = mongoose.Schema({
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
  },
  date: {
    type: String,
  },
  profile: {
    type: String,
  },
},{versionKey:false});


module.exports = mongoose.model('customer_Enquiry',custEnquiry)