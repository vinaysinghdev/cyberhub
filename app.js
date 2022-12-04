const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'/.env'});
const port = process.env.PORT || 2222;
require("./src/database/connection");
const mainRoute = require("./src/routes/auth");
const path = require('path');

app.set("view engine", "ejs");
app.set("views", "views");
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const staticPath = path.join(__dirname,"./public")
console.log(staticPath);
app.use(express.static(staticPath));

app.use(mainRoute);


app.listen(port , () => {
  console.log(`Server is runnig on ${port}`);
});
