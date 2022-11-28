// npm modules

const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");
const moment = require("moment");
const IP = require("ip");
const reqIp = require("request-ip");
const axios = require("axios");

dotenv.config({ path: "./.env" });
route.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
route.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// custom modules
const homeServices = require("../models/homeServices");
const custEnquiry = require("../models/custEnquiry");
const allServices = require("../models/allServices");
const custIp = require("../models/ipCount");
const passBook = require("../models/passbook");

route.get("/", async (req, res) => {
  try {
    let serviceCount = await allServices.count();
    let homeServiceData = await allServices.find({ homeService: "on" });
    res.render("home", {
      homeServiceData: homeServiceData,
      serviceCount: serviceCount,
    });
  } catch (err) {
    console.log(err);
  }
});

route.post("/enqform", async (req, res) => {
  try {
    let name = req.body.name;
    let mobile = req.body.mobile;
    let subject = req.body.subject;
    let message = req.body.message;
    let status = "Pending";
    let date = moment().format("ll");

    let values = ["avatar1.jpg", "avatar2.jpg", "avatar3.jpg", "avatar4.jpg"],
      valueToUse = values[Math.floor(Math.random() * values.length)];
    let profile = valueToUse;

    await custEnquiry.insertMany({
      name,
      mobile,
      subject,
      message,
      status,
      date,
      profile,
    });
    res.send("submited");
  } catch (err) {
    console.log(err);
  }
});

route.get("/service", async (req, res) => {
  try {
    let highlightService = await allServices
      .find({ highlight: "on" })
      .sort({ index: 1 });
    let allServiceData = await allServices
      .find({ highlight: "off" })
      .sort({ index: 1 });

    res.render("service", {
      highlightService: highlightService,
      allServiceData: allServiceData,
    });
  } catch (err) {
    console.log(err);
  }
});

route.get("/about", async (req, res) => {
  try {
    res.render("about");
  } catch (err) {
    console.log(err);
  }
});

route.get("/contact", async (req, res) => {
  try {
    res.render("contact");
  } catch (err) {
    console.log(err);
  }
});

route.get("/test", (req, res) => {
  try {
    res.render("test");
  } catch (err) {
    console.log(err);
  }
});

route.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});

route.get("/forgot", (req, res) => {
  try {
    res.render("forgot");
  } catch (err) {
    console.log(err);
  }
});

route.get("/reset", (req, res) => {
  try {
    res.render("reset");
  } catch (err) {
    console.log(err);
  }
});

route.get("/profile", (req, res) => {
  try {
    res.render("profile");
  } catch (err) {
    console.log(err);
  }
});

route.get("/admin", async (req, res) => {
  try {
    let totalEnq = await custEnquiry.count();
    let totalService = await allServices.count();
    let totalTrafic = await custIp.count();

    let date = moment().format("DD/MM/YYYY");
    let todayProf = await passBook.find({ date });
    let todayAmt = [];

    for (i = 0; i < todayProf.length; i++) {
      todayAmt.push(parseInt(todayProf[i].amount));
    }
    let profit = 0;
    for (i = 0; i < todayAmt.length; i++) {
      profit += todayAmt[i];
    }

    let month = moment().month();
    let cMonth = month + 1;

    let transacData = await passBook.find().sort({ _id: -1 });
    let cTotal = [];
    for (i = 0; i < transacData.length; i++) {
      let dbDate = transacData[i].date;
      let dbAmt = parseInt(transacData[i].amount);
      let checkMonth = parseInt(dbDate.slice(3, 5));

      if (cMonth == checkMonth) {
        cTotal.push(dbAmt);
      }
    }

    let cuMonTotal = 0;
    for (i = 0; i < cTotal.length; i++) {
      cuMonTotal += cTotal[i];
    }

    let weekDays = [];
    for (i = 1; i < 8; i++) {
      weekDays.push(moment().subtract(i, "day").format("dddd"));
    }

    let weekDates = [];
    for (i = 1; i < 8; i++) {
      weekDates.push(moment().subtract(i, "day").format("DD/MM/YYYY"));
    }

    let weekProfit = [];
    for (i = 0; i < weekDates.length; i++) {
      // console.log(weekDates[i]);

      let dayProfit = await passBook.find({ date: weekDates[i] });

      let dayProfitArray = [];
      for (j = 0; j < dayProfit.length; j++) {
        dayProfitArray.push(parseInt(dayProfit[j].amount));
      }
      let weekDaysProfit = 0;
      for (k = 0; k < dayProfitArray.length; k++) {
        weekDaysProfit += parseInt(dayProfitArray[k]);
      }
      weekProfit.push(weekDaysProfit);
    }

    res.render("dashboard", {
      totalEnq: totalEnq,
      totalService: totalService,
      totalTrafic: totalTrafic,
      cuMonTotal: cuMonTotal,
      profit: profit,
      weekDays: weekDays.reverse(),
      // weekDates:weekDates.reverse(),
      weekProfit: weekProfit.reverse(),
    });
  } catch (err) {
    console.log(err);
  }
});

route.get("/manageservices", async (req, res) => {
  try {
    let perPage = 5;
    let total = await allServices.count();
    let pages = Math.ceil(total / perPage);
    let pageNumber = req.query.page == null ? 1 : req.query.page;
    let startFrom = (pageNumber - 1) * perPage;
    let serviceData = await allServices
      .find()
      .sort({ index: 1 })
      .skip(startFrom)
      .limit(perPage);
    res.render("manageservices", {
      serviceData: serviceData,
      pages: pages,
      total: total,
    });
  } catch (err) {
    console.log(err);
  }
});

route.get("/cusEnquiry", async (req, res) => {
  try {
    let perPage = 6;
    let total = await custEnquiry.count();
    let pages = Math.ceil(total / perPage);
    let pageNumber = req.query.page == null ? 1 : req.query.page;
    let startFrom = (pageNumber - 1) * perPage;
    let enqData = await custEnquiry
      .find()
      .sort({ _id: -1 })
      .skip(startFrom)
      .limit(perPage);

    res.render("cusEnquiry", { enqData: enqData, pages: pages, total: total });
  } catch (err) {
    console.log(err);
  }
});

route.post("/updateEnq", async (req, res) => {
  try {
    let _id = req.body._id;
    let check = await custEnquiry.findOne({ _id });
    if (check.status == "Done") {
      res.send("Done");
    } else if (check.status == "Pending") {
      await custEnquiry.updateOne({ _id: _id }, { $set: { status: "Done" } });
      res.send("Updated");
    }
  } catch (err) {
    console.log(err);
  }
});

route.get("/managetransaction", async (req, res) => {
  try {
    let month = moment().month();
    let cMonth = month + 1;
    let exMonth = moment().month();
    let transacData = await passBook.find().sort({ _id: -1 });

    let cTotal = [];
    let exTotal = [];

    for (i = 0; i < transacData.length; i++) {
      let dbDate = transacData[i].date;
      let dbAmt = parseInt(transacData[i].amount);
      let checkMonth = parseInt(dbDate.slice(3, 5));

      if (cMonth == checkMonth) {
        cTotal.push(dbAmt);
      } else if (exMonth == checkMonth) {
        exTotal.push(dbAmt);
      }
    }

    let cuMonTotal = 0;
    let exMonTotal = 0;

    for (i = 0; i < cTotal.length; i++) {
      cuMonTotal += cTotal[i];
    }

    for (i = 0; i < exTotal.length; i++) {
      exMonTotal += exTotal[i];
    }

    let date = moment().format("DD/MM/YYYY");
    let exDate = moment().subtract(1, "day").format("DD/MM/YYYY");

    let todayProf = await passBook.find({ date });
    let todayAmt = [];
    for (i = 0; i < todayProf.length; i++) {
      todayAmt.push(parseInt(todayProf[i].amount));
    }
    let profit = 0;
    for (i = 0; i < todayAmt.length; i++) {
      profit += todayAmt[i];
    }

    let yesProf = await passBook.find({ date: exDate });
    let yesProfit = [];
    for (i = 0; i < yesProf.length; i++) {
      yesProfit.push(parseInt(yesProf[i].amount));
    }
    let exDayprofit = 0;
    for (i = 0; i < yesProfit.length; i++) {
      exDayprofit += yesProfit[i];
    }

    let overall = await passBook.find();
    let overallArray = [];
    for (i = 0; i < overall.length; i++) {
      overallArray.push(parseInt(overall[i].amount));
    }

    let overallProfit = 0;
    for (i = 0; i < overallArray.length; i++) {
      overallProfit += overallArray[i];
    }

    res.render("managetransaction", {
      transacData: transacData,
      cuMonTotal: cuMonTotal,
      exMonTotal: exMonTotal,
      profit: profit,
      exDayprofit: exDayprofit,
      overallProfit: overallProfit,
    });
  } catch (err) {
    console.log(err);
  }
});

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "public/images");
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

//route that handles new post
route.post("/addservices", upload.single("serviceImg"), async (req, res) => {
  try {
    let title = req.body.title;
    let index = req.body.index;
    let desc = req.body.desc;
    let img = req.file.filename;
    let highlight = req.body.hightlightSwitch;
    let homeService = req.body.homeHighlight;

    if (typeof highlight == "undefined") {
      highlight = "off";
    }
    if (typeof homeService == "undefined") {
      homeService = "off";
    }

    await allServices.insertMany({
      title,
      index,
      desc,
      img,
      highlight,
      homeService,
    });
    res.redirect("/manageservices");
  } catch (err) {
    console.log(err);
  }
});

route.post("/deleteService", async (req, res) => {
  try {
    let _id = req.body._id;
    await allServices.deleteOne({ _id });
    res.send("deleted");
  } catch (err) {
    console.log(err);
  }
});

route.post("/edithomehighlight", async (req, res) => {
  try {
    let _id = req.body._id;
    let status = req.body.status;

    if (status == "off") {
      await allServices.updateOne({ _id }, { $set: { homeService: "on" } });
      res.send("ok");
    }
    if (status == "on") {
      await allServices.updateOne({ _id }, { $set: { homeService: "off" } });
      res.send("ok");
    }
  } catch (err) {
    console.log(err);
  }
});

route.post("/editservicehighlight", async (req, res) => {
  try {
    let _id = req.body._id;
    let status = req.body.status;

    if (status == "off") {
      await allServices.updateOne({ _id }, { $set: { highlight: "on" } });
      res.send("ok");
    }
    if (status == "on") {
      await allServices.updateOne({ _id }, { $set: { highlight: "off" } });
      res.send("ok");
    }
  } catch (err) {
    console.log(err);
  }
});

// route.post("/saveip", async (req, res) => {
//   try {
//     axios
//       .get(
//         "https://ipgeolocation.abstractapi.com/v1/?api_key=d9a8215b4a5c4f1a97c916038223c300"
//       )
//       .then(async (response) => {
//         let ipData = response.data;
//         let ip = ipData.ip_address;
//         console.log(ipData);

//         let checkIp = await custIp.findOne({ip});
//         let cDate = moment();

//         if (checkIp) {
//           let findIp = await custIp.findOne({ ip }).sort({ _id: -1 }).limit(1);
//           let exDate = findIp.date;
//           let diff = cDate.diff(exDate, "minutes");
//           if (diff > 59) {
//             await custIp.insertMany({ ip, date: cDate, ipData });
//           } else {
//             console.log("already added");
//           }
//         } else {
//           await custIp.insertMany({ ip, date: cDate, ipData });
//         }
//         res.send(ip);

//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });

route.post("/addPassbook", async (req, res) => {
  try {
    let date = moment().format("DD/MM/YYYY");
    let title = req.body.title;
    let amount = req.body.amount;

    await passBook.insertMany({ date, remarks: title, amount });

    res.redirect("/managetransaction");
  } catch (err) {
    console.log(err);
  }
});

route.get("*", async (req, res) => {
  try {
    res.render("page404");
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
