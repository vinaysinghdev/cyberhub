const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'/.env'});
const port = process.env.PORT || 2222;
require("./src/database/connection");
const mainRoute = require("./src/routes/auth");

app.set("view engine", "ejs");
app.set("views", "views");
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(mainRoute);


app.listen(port , () => {
  console.log(`Server is runnig on ${port}`);
});
