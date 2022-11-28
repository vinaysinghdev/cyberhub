const mongoose = require("mongoose");

const custIp = mongoose.Schema(
  {
    ip: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
      // default: Date.now,
    },
    ipData: {
      type: JSON,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("customer_ip", custIp);
