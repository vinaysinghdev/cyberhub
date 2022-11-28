const mongoose = require("mongoose");

const dailyEntry = mongoose.Schema({
  date: {
    type: String,
  },
  remarks: {
    type: String,
  },
  amount: {
    type: String,
  },
},{versionKey:false});


module.exports = mongoose.model('passBook',dailyEntry)