const mongoose = require("mongoose");

const homeService = mongoose.Schema({
  index: {
    type: String,
  },
  title: {
    type: String,
  },
  img: {
    type: String,
  },
  desc: {
    type: String,
  },
},{versionKey:false});


module.exports = mongoose.model('HomeService',homeService)