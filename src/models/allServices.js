const mongoose = require("mongoose");

const allService = mongoose.Schema({
  index: {
    type: Number,
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
  highlight: {
    type: String,
  },
  homeService:{
    type: String,
  }
},{versionKey:false});


module.exports = mongoose.model('allService',allService)